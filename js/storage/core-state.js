(function (root) {
  'use strict';

  const FORMAT = 'living-observatory-state';
  const SCHEMA_VERSION = 1;
  const STORAGE_KEY = 'living-observatory.intelligence-core.v1';
  const ROLLBACK_KEY = 'living-observatory.intelligence-core.rollback.v1';
  const MAX_STATE_BYTES = 64 * 1024;
  const WORLD_KEYS = new Set(['mode', 'currentView', 'lastInteriorView', 'decorEnabled', 'systems', 'reservations']);
  const PROFILE_KEYS = new Set(['displayName', 'appearance', 'behavior']);

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function canonical(value) {
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    if (value && typeof value === 'object') {
      return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
    }
    return JSON.stringify(value);
  }

  function fnv1a32(text) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  function utf8Bytes(text) {
    let bytes = 0;
    for (const character of text) {
      const code = character.codePointAt(0);
      bytes += code <= 0x7f ? 1 : code <= 0x7ff ? 2 : code <= 0xffff ? 3 : 4;
    }
    return bytes;
  }

  function createResidentProfile() {
    return {
      residentId: 'pilot-resident',
      displayName: null,
      appearance: { assetId: null, revision: 0 },
      behavior: {
        traits: {},
        needs: {},
        preferences: { likes: [], dislikes: [] },
        routines: [],
        tendencies: [],
        memories: [],
        goals: [],
        ownerInstructions: [],
        familiarity: {},
        skills: {}
      }
    };
  }

  function createWorldState() {
    return {
      propertyId: 'modern-house-approved',
      mode: 'exterior',
      currentView: 'exterior-overview',
      lastInteriorView: 'entry-ground',
      decorEnabled: false,
      systems: {},
      reservations: {},
      eventLog: []
    };
  }

  function createInitialState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      revision: 0,
      residentProfile: createResidentProfile(),
      worldState: createWorldState()
    };
  }

  function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  function validateState(state) {
    const errors = [];
    if (!isPlainObject(state)) return ['State must be an object.'];
    if (state.schemaVersion !== SCHEMA_VERSION) errors.push('Unsupported state schema version.');
    if (!Number.isInteger(state.revision) || state.revision < 0) errors.push('State revision must be a non-negative integer.');

    const profile = state.residentProfile;
    if (!isPlainObject(profile)) {
      errors.push('Resident Profile is missing.');
    } else {
      if (typeof profile.residentId !== 'string' || !profile.residentId) errors.push('Resident Profile requires a stable residentId.');
      if (!(profile.displayName === null || typeof profile.displayName === 'string')) errors.push('Resident displayName must be null or text.');
      if (!isPlainObject(profile.appearance)) errors.push('Replaceable appearance contract is missing.');
      else {
        if (!(profile.appearance.assetId === null || typeof profile.appearance.assetId === 'string')) errors.push('Appearance assetId must be null or text.');
        if (!Number.isInteger(profile.appearance.revision) || profile.appearance.revision < 0) errors.push('Appearance revision must be a non-negative integer.');
      }
      if (!isPlainObject(profile.behavior)) errors.push('Protected behavior contract is missing.');
      else {
        ['traits', 'needs', 'familiarity', 'skills'].forEach(key => {
          if (!isPlainObject(profile.behavior[key])) errors.push('Resident behavior.' + key + ' must be an object.');
        });
        ['routines', 'tendencies', 'memories', 'goals', 'ownerInstructions'].forEach(key => {
          if (!Array.isArray(profile.behavior[key])) errors.push('Resident behavior.' + key + ' must be an array.');
        });
        if (Array.isArray(profile.behavior.ownerInstructions) && profile.behavior.ownerInstructions.length > 20) {
          errors.push('Resident owner instruction log may contain at most 20 entries.');
        }
        if (!isPlainObject(profile.behavior.preferences) || !Array.isArray(profile.behavior.preferences.likes) || !Array.isArray(profile.behavior.preferences.dislikes)) {
          errors.push('Resident preferences contract is invalid.');
        }
        Object.values(profile.behavior.needs || {}).forEach(value => {
          if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) errors.push('Resident need values must be finite numbers from 0 to 100.');
        });
      }
    }

    const world = state.worldState;
    if (!isPlainObject(world)) {
      errors.push('World state is missing.');
    } else {
      if (world.propertyId !== 'modern-house-approved') errors.push('World state targets an unapproved property.');
      if (!['exterior', 'interior'].includes(world.mode)) errors.push('World mode is invalid.');
      if (typeof world.currentView !== 'string' || !world.currentView) errors.push('Current view is invalid.');
      if (typeof world.lastInteriorView !== 'string' || !world.lastInteriorView) errors.push('Last interior view is invalid.');
      if (typeof world.decorEnabled !== 'boolean') errors.push('Décor state must be Boolean.');
      if (!isPlainObject(world.systems) || !isPlainObject(world.reservations)) errors.push('World registries must be objects.');
      if (!Array.isArray(world.eventLog)) errors.push('World event log must be an array.');
      if (Array.isArray(world.eventLog) && world.eventLog.length > 50) errors.push('World event log may contain at most 50 entries.');
      if (isPlainObject(world.reservations) && Object.keys(world.reservations).length > 1) errors.push('At most one active reservation is permitted.');
      const pilot = isPlainObject(world.systems) ? world.systems.pilotResident : null;
      if (pilot !== undefined && pilot !== null) {
        if (!isPlainObject(pilot)) errors.push('Pilot-resident world state must be an object.');
        else {
          if (typeof pilot.currentAnchor !== 'string' || !pilot.currentAnchor) errors.push('Pilot resident requires a registered current anchor.');
          if (!(pilot.targetAnchor === null || typeof pilot.targetAnchor === 'string')) errors.push('Pilot target anchor must be null or text.');
          if (!['idle', 'moving'].includes(pilot.movementState)) errors.push('Pilot movement state is invalid.');
        }
      }
      const control = isPlainObject(world.systems) ? world.systems.intentControl : null;
      if (control !== undefined && control !== null) {
        if (!isPlainObject(control)) errors.push('Intent-control state must be an object.');
        else {
          if (!['stopped', 'running', 'paused'].includes(control.sessionState)) errors.push('Intent-control session state is invalid.');
          if (!Number.isInteger(control.sessionId) || control.sessionId < 0) errors.push('Intent-control sessionId must be a non-negative integer.');
          if (!Number.isInteger(control.actionCount) || control.actionCount < 0 || control.actionCount > 2) errors.push('Intent-control action count must be from 0 to 2.');
          if (!Number.isInteger(control.decisionSequence) || control.decisionSequence < 0) errors.push('Intent-control decision sequence must be a non-negative integer.');
          if (!Array.isArray(control.decisionLog) || control.decisionLog.length > 20) errors.push('Intent-control decision log must contain at most 20 entries.');
          if (!isPlainObject(control.ownerOverrides) || Object.keys(control.ownerOverrides).length > 4) errors.push('Intent-control Owner overrides must be a bounded object.');
          if (!(control.activeIntent === null || isPlainObject(control.activeIntent))) errors.push('Intent-control active intent must be null or an object.');
          if (isPlainObject(control.activeIntent)) {
            if (typeof control.activeIntent.id !== 'string' || !control.activeIntent.id) errors.push('Active intent requires a stable identity.');
            if (!['owner-direct', 'resident-need'].includes(control.activeIntent.authority)) errors.push('Active intent authority is invalid.');
            const expectedPriority = control.activeIntent.authority === 'owner-direct' ? 3 : control.activeIntent.authority === 'resident-need' ? 2 : null;
            if (control.activeIntent.priority !== expectedPriority) errors.push('Active intent priority does not match its authority.');
            if (control.activeIntent.action !== 'route') errors.push('Active intent action is invalid.');
            if (typeof control.activeIntent.targetAnchor !== 'string' || !control.activeIntent.targetAnchor) errors.push('Active intent target is invalid.');
            const reservation = isPlainObject(world.reservations) ? world.reservations.resident : null;
            if (!isPlainObject(reservation)) {
              errors.push('Every active intent requires exactly one resident reservation.');
            } else {
              if (reservation.intentId !== control.activeIntent.id) errors.push('Reservation and active intent identities must match.');
              if (reservation.targetAnchor !== control.activeIntent.targetAnchor) errors.push('Reservation and active intent targets must match.');
              if (reservation.authority !== control.activeIntent.authority) errors.push('Reservation and active intent authorities must match.');
            }
            if (!isPlainObject(pilot) || pilot.targetAnchor !== control.activeIntent.targetAnchor) {
              errors.push('Pilot target and active intent target must match.');
            } else {
              const pausedResidentIntent = control.sessionState === 'paused' && control.activeIntent.authority === 'resident-need' && control.activeIntent.status === 'paused';
              if (pausedResidentIntent && pilot.movementState !== 'idle') errors.push('A paused resident intent requires an idle pilot.');
              if (!pausedResidentIntent && pilot.movementState !== 'moving') errors.push('An active route requires a moving pilot.');
            }
            const life = isPlainObject(world.systems) ? world.systems.autonomousLife : null;
            if (control.activeIntent.authority === 'resident-need') {
              if (!isPlainObject(life) || life.enabled !== true) errors.push('An active resident need requires enabled autonomous life.');
              if (!isPlainObject(life) || life.targetAnchor !== control.activeIntent.targetAnchor) errors.push('Autonomous-life target and active resident intent target must match.');
            } else if (control.activeIntent.authority === 'owner-direct' && isPlainObject(life)) {
              if (life.enabled !== false || life.targetAnchor !== null) errors.push('A direct Owner intent must disable and clear the autonomous target.');
            }
          } else {
            if (isPlainObject(world.reservations) && Object.keys(world.reservations).length) errors.push('Reservations require an active intent.');
            if (isPlainObject(pilot) && (pilot.targetAnchor !== null || pilot.movementState !== 'idle')) errors.push('Pilot routing requires an active intent.');
          }
          if (!(control.environmentAction === null || isPlainObject(control.environmentAction))) {
            errors.push('Intent-control environment action must be null or an object.');
          } else if (isPlainObject(control.environmentAction)) {
            if (!isPlainObject(control.activeIntent)) errors.push('An environment action requires an active intent.');
            else if (control.environmentAction.intentId !== control.activeIntent.id) errors.push('Environment action and active intent identities must match.');
            if (typeof control.environmentAction.surface !== 'string' || !control.environmentAction.surface) errors.push('Environment action surface is invalid.');
            if (typeof control.environmentAction.mode !== 'string' || !control.environmentAction.mode) errors.push('Environment action mode is invalid.');
            if (isPlainObject(control.ownerOverrides) && Object.prototype.hasOwnProperty.call(control.ownerOverrides, control.environmentAction.surface)) {
              errors.push('An environment action may not coexist with an Owner override for the same surface.');
            }
          }
        }
      }
    }
    return errors;
  }

  function createRecord(state) {
    const errors = validateState(state);
    if (errors.length) throw new Error(errors.join(' '));
    const payload = clone(state);
    return {
      format: FORMAT,
      schemaVersion: SCHEMA_VERSION,
      integrity: { algorithm: 'fnv1a32', digest: fnv1a32(canonical(payload)) },
      payload
    };
  }

  function serialize(state) {
    return JSON.stringify(createRecord(state));
  }

  function semanticErrors(state, semanticValidator) {
    if (typeof semanticValidator !== 'function') return [];
    try {
      const errors = semanticValidator(state);
      return Array.isArray(errors) ? errors : ['Semantic validator did not return an error list.'];
    } catch (error) {
      return ['Semantic validation failed: ' + String(error.message || error)];
    }
  }

  function deserialize(text, semanticValidator) {
    let record;
    try { record = JSON.parse(text); } catch (_) { return { ok: false, code: 'invalid-json', error: 'Stored state is not valid JSON.' }; }
    if (!isPlainObject(record) || record.format !== FORMAT) return { ok: false, code: 'invalid-format', error: 'Stored state format is invalid.' };
    if (record.schemaVersion > SCHEMA_VERSION) return { ok: false, code: 'future-schema', error: 'Stored state requires a newer Intelligence Core.' };
    if (record.schemaVersion !== SCHEMA_VERSION) return { ok: false, code: 'migration-missing', error: 'No approved migration exists for this stored state.' };
    if (!record.integrity || record.integrity.algorithm !== 'fnv1a32') return { ok: false, code: 'integrity-missing', error: 'Stored state integrity record is missing.' };
    const digest = fnv1a32(canonical(record.payload));
    if (digest !== record.integrity.digest) return { ok: false, code: 'integrity-failed', error: 'Stored state failed its integrity check.' };
    const errors = validateState(record.payload);
    if (errors.length) return { ok: false, code: 'schema-invalid', error: errors.join(' ') };
    const semantic = semanticErrors(record.payload, semanticValidator);
    if (semantic.length) return { ok: false, code: 'semantic-invalid', error: semantic.join(' ') };
    return { ok: true, state: clone(record.payload) };
  }

  function save(storage, state, key) {
    if (!storage || typeof storage.setItem !== 'function') return { ok: false, code: 'storage-unavailable', error: 'Local persistence is unavailable.' };
    let text;
    try { text = serialize(state); } catch (error) { return { ok: false, code: 'state-invalid', error: error.message }; }
    const bytes = utf8Bytes(text);
    if (bytes > MAX_STATE_BYTES) return { ok: false, code: 'state-too-large', error: 'Serialized state exceeds the 64 KiB limit.', bytes };
    try { storage.setItem(key || STORAGE_KEY, text); } catch (error) { return { ok: false, code: 'storage-write-failed', error: String(error.message || error) }; }
    return { ok: true, bytes };
  }

  function restore(storage, key, semanticValidator) {
    if (!storage || typeof storage.getItem !== 'function') return { ok: false, code: 'storage-unavailable', error: 'Local persistence is unavailable.' };
    let text;
    try { text = storage.getItem(key || STORAGE_KEY); } catch (error) { return { ok: false, code: 'storage-read-failed', error: String(error.message || error) }; }
    if (text === null) return { ok: false, code: 'not-found', error: 'No stored state exists yet.' };
    return deserialize(text, semanticValidator);
  }

  function saveWithRollback(storage, state, key, rollbackKey, semanticValidator) {
    if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
      return { ok: false, code: 'storage-unavailable', error: 'Local persistence is unavailable.' };
    }
    const primaryKey = key || STORAGE_KEY;
    const safeRollbackKey = rollbackKey || ROLLBACK_KEY;
    const semantic = semanticErrors(state, semanticValidator);
    if (semantic.length) return { ok: false, code: 'semantic-invalid', error: semantic.join(' ') };
    let nextText;
    try { nextText = serialize(state); } catch (error) { return { ok: false, code: 'state-invalid', error: error.message }; }
    const bytes = utf8Bytes(nextText);
    if (bytes > MAX_STATE_BYTES) return { ok: false, code: 'state-too-large', error: 'Serialized state exceeds the 64 KiB limit.', bytes };

    let previousText;
    try { previousText = storage.getItem(primaryKey); } catch (error) {
      return { ok: false, code: 'storage-read-failed', error: String(error.message || error) };
    }
    if (previousText !== null) {
      const previous = deserialize(previousText, semanticValidator);
      if (!previous.ok) {
        return { ok: false, code: 'existing-state-rejected', error: 'Existing state was preserved because it did not validate: ' + previous.error };
      }
      try { storage.setItem(safeRollbackKey, previousText); } catch (error) {
        return { ok: false, code: 'rollback-write-failed', error: String(error.message || error) };
      }
    }
    try { storage.setItem(primaryKey, nextText); } catch (error) {
      return { ok: false, code: 'storage-write-failed', error: String(error.message || error) };
    }
    return { ok: true, bytes, rollbackPreserved: previousText !== null };
  }

  function restoreRollback(storage, key, semanticValidator) {
    return restore(storage, key || ROLLBACK_KEY, semanticValidator);
  }

  function commitWorld(state, changes, eventType) {
    const next = clone(state);
    Object.keys(changes || {}).forEach(key => {
      if (!WORLD_KEYS.has(key)) throw new Error('Unapproved world-state field: ' + key);
      next.worldState[key] = clone(changes[key]);
    });
    next.revision += 1;
    next.worldState.eventLog.push({ sequence: next.revision, type: String(eventType || 'world-update') });
    next.worldState.eventLog = next.worldState.eventLog.slice(-50);
    const errors = validateState(next);
    if (errors.length) throw new Error(errors.join(' '));
    return next;
  }

  function commitResident(state, changes, eventType) {
    const next = clone(state);
    Object.keys(changes || {}).forEach(key => {
      if (!PROFILE_KEYS.has(key)) throw new Error('Unapproved Resident Profile field: ' + key);
      next.residentProfile[key] = clone(changes[key]);
    });
    next.revision += 1;
    next.worldState.eventLog.push({ sequence: next.revision, type: String(eventType || 'resident-update') });
    next.worldState.eventLog = next.worldState.eventLog.slice(-50);
    const errors = validateState(next);
    if (errors.length) throw new Error(errors.join(' '));
    return next;
  }

  root.LivingObservatoryIntelligenceCore = Object.freeze({
    format: FORMAT,
    schemaVersion: SCHEMA_VERSION,
    storageKey: STORAGE_KEY,
    rollbackKey: ROLLBACK_KEY,
    maxStateBytes: MAX_STATE_BYTES,
    createInitialState,
    createRecord,
    serialize,
    deserialize,
    validateState,
    commitWorld,
    commitResident,
    save,
    restore,
    saveWithRollback,
    restoreRollback
  });
}(window));
