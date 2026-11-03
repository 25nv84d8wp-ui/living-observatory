(function (root) {
  'use strict';

  const AUTHORITIES = Object.freeze({
    'ambient-suggestion': 1,
    'resident-need': 2,
    'owner-direct': 3,
    'owner-stop': 4
  });
  const MAX_DECISIONS = 20;
  const MAX_AUTONOMOUS_ACTIONS = 2;
  const OWNER_MODES = Object.freeze({
    media: Object.freeze(['off', 'ambient', 'cinema']),
    suite: Object.freeze(['rest', 'sunrise', 'spa', 'terrace']),
    upper: Object.freeze(['focus', 'read', 'guest', 'night']),
    garage: Object.freeze(['arrival', 'charge', 'display', 'service'])
  });

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function defaultControl() {
    return {
      sessionState: 'stopped',
      sessionId: 0,
      actionCount: 0,
      activeIntent: null,
      environmentAction: null,
      ownerOverrides: {},
      decisionSequence: 0,
      lastDecisionTick: null,
      lastDecisionPriority: 0,
      decisionLog: []
    };
  }

  function configureState(core, state) {
    if (state.worldState.systems.intentControl) return { state, changed: false };
    const systems = clone(state.worldState.systems);
    systems.intentControl = defaultControl();
    return {
      state: core.commitWorld(state, { systems }, 'intent-control-registered'),
      changed: true
    };
  }

  function appendDecision(control, entry) {
    control.decisionSequence += 1;
    control.decisionLog.push({ sequence: control.decisionSequence, ...entry });
    control.decisionLog = control.decisionLog.slice(-MAX_DECISIONS);
  }

  function commitDecision(core, state, control, eventType, reservations, systemsOverride) {
    const systems = systemsOverride || clone(state.worldState.systems);
    systems.intentControl = control;
    return core.commitWorld(state, {
      systems,
      reservations: reservations === undefined ? state.worldState.reservations : reservations
    }, eventType);
  }

  function rejected(core, state, request, code, reason, priority) {
    const configured = configureState(core, state).state;
    const control = clone(configured.worldState.systems.intentControl);
    appendDecision(control, {
      actor: String(request?.actor || 'unknown'),
      trigger: String(request?.trigger || 'unknown'),
      authority: String(request?.authority || 'unknown'),
      selectedIntent: null,
      reason,
      result: 'rejected',
      code,
      supersededIntentId: null
    });
    if (Number.isFinite(request?.tick)) {
      if (control.lastDecisionTick === null || request.tick > control.lastDecisionTick) {
        control.lastDecisionTick = request.tick;
        control.lastDecisionPriority = Number(priority || 0);
      } else if (request.tick === control.lastDecisionTick) {
        control.lastDecisionPriority = Math.max(control.lastDecisionPriority, Number(priority || 0));
      }
    }
    return {
      ok: false,
      code,
      error: reason,
      state: commitDecision(core, configured, control, 'intent-request-rejected')
    };
  }

  function isResidentTarget(chassis, targetAnchor) {
    const view = chassis.getView(targetAnchor);
    return Boolean(view && view.zone !== 'exterior' && !view.surveyOnly && view.residentAccessible !== false && !view.provisional);
  }

  function validateState(chassis, state) {
    const errors = [];
    const world = state?.worldState;
    const systems = world?.systems;
    const control = systems?.intentControl;
    const pilot = systems?.pilotResident;
    if (!control) return errors;
    if (control.activeIntent && !isResidentTarget(chassis, control.activeIntent.targetAnchor)) {
      errors.push('Active intent target is not a registered resident destination.');
    }
    if (world?.reservations?.resident && !isResidentTarget(chassis, world.reservations.resident.targetAnchor)) {
      errors.push('Reservation target is not a registered resident destination.');
    }
    if (pilot?.currentAnchor && !isResidentTarget(chassis, pilot.currentAnchor)) {
      errors.push('Pilot current anchor is not a registered resident destination.');
    }
    if (pilot?.targetAnchor && !isResidentTarget(chassis, pilot.targetAnchor)) {
      errors.push('Pilot target anchor is not a registered resident destination.');
    }
    Object.entries(control.ownerOverrides || {}).forEach(([surface, mode]) => {
      if (!OWNER_MODES[surface] || !OWNER_MODES[surface].includes(mode)) {
        errors.push('Owner override contains an unregistered surface or mode.');
      }
    });
    if (control.environmentAction) {
      const environment = control.environmentAction;
      const allowed = environment.surface === 'suite'
        ? environment.mode === 'rest' && control.activeIntent?.targetAnchor === 'bedroom-upper'
        : environment.surface === 'media'
          ? environment.mode === 'ambient' && control.activeIntent?.targetAnchor === 'media-ground'
          : false;
      if (!allowed) errors.push('Environment action is not registered for the active resident destination.');
    }
    return errors;
  }

  function request(core, chassis, state, input) {
    const configured = configureState(core, state).state;
    const requestData = input && typeof input === 'object' ? input : {};
    const priority = AUTHORITIES[requestData.authority];
    if (!priority || requestData.authority === 'owner-stop') {
      return rejected(core, configured, requestData, 'invalid-authority', 'The request authority is not executable.', priority);
    }
    if (!Number.isFinite(requestData.tick)) {
      return rejected(core, configured, requestData, 'invalid-tick', 'The request tick must be finite.', priority);
    }
    if (requestData.action !== 'route') {
      return rejected(core, configured, requestData, 'unregistered-action', 'Only the registered resident route action is available.', priority);
    }
    if (!isResidentTarget(chassis, requestData.targetAnchor)) {
      return rejected(core, configured, requestData, 'unregistered-target', 'The requested destination is not a registered resident destination.', priority);
    }
    if (typeof requestData.reason !== 'string' || !requestData.reason.trim()) {
      return rejected(core, configured, requestData, 'missing-reason', 'Every request requires a visible reason.', priority);
    }

    const control = clone(configured.worldState.systems.intentControl);
    if (requestData.authority === 'ambient-suggestion') {
      appendDecision(control, {
        actor: String(requestData.actor || 'local-system'),
        trigger: String(requestData.trigger || 'ambient-input'),
        authority: requestData.authority,
        selectedIntent: { action: requestData.action, targetAnchor: requestData.targetAnchor },
        reason: requestData.reason,
        result: 'suggested',
        code: 'explanation-only',
        supersededIntentId: null
      });
      control.lastDecisionTick = requestData.tick;
      control.lastDecisionPriority = priority;
      return {
        ok: true,
        result: 'suggested',
        state: commitDecision(core, configured, control, 'ambient-suggestion-recorded')
      };
    }
    if (requestData.authority === 'resident-need' && control.actionCount >= MAX_AUTONOMOUS_ACTIONS) {
      return rejected(core, configured, requestData, 'session-action-limit', 'The two-action autonomous session limit has been reached.', priority);
    }
    if (requestData.authority === 'resident-need' && control.sessionState !== 'running') {
      return rejected(core, configured, requestData, 'session-not-running', 'Owner START is required before a resident need may execute.', priority);
    }
    if (control.lastDecisionTick !== null && (
      requestData.tick < control.lastDecisionTick ||
      (requestData.tick === control.lastDecisionTick && priority <= control.lastDecisionPriority)
    )) {
      return rejected(core, configured, requestData, 'duplicate-or-stale', 'The request is repeated, stale, or loses the same-tick authority comparison.', priority);
    }
    if (control.activeIntent && control.activeIntent.priority >= priority) {
      return rejected(core, configured, requestData, 'lower-priority-active', 'An equal or higher-priority intent is already active.', priority);
    }

    const resident = configured.worldState.systems.pilotResident;
    if (!resident) return rejected(core, configured, requestData, 'resident-missing', 'The pilot resident is not registered.', priority);
    const route = chassis.shortestRoute(resident.currentAnchor, requestData.targetAnchor);
    if (!route) return rejected(core, configured, requestData, 'route-unavailable', 'No registered route reaches the requested destination.', priority);

    const superseded = control.activeIntent ? control.activeIntent.id : null;
    const intent = {
      id: 'intent-' + control.sessionId + '-' + (control.decisionSequence + 1),
      authority: requestData.authority,
      priority,
      actor: String(requestData.actor || (requestData.authority === 'owner-direct' ? 'Owner' : 'Avery')),
      trigger: String(requestData.trigger || 'explicit-request'),
      action: 'route',
      targetAnchor: requestData.targetAnchor,
      reason: requestData.reason.trim(),
      status: route.length > 1 ? 'active' : 'complete',
      tick: requestData.tick
    };
    control.activeIntent = route.length > 1 ? intent : null;
    control.lastDecisionTick = requestData.tick;
    control.lastDecisionPriority = priority;
    if (requestData.authority === 'resident-need') control.actionCount += 1;
    appendDecision(control, {
      actor: intent.actor,
      trigger: intent.trigger,
      authority: intent.authority,
      selectedIntent: { id: intent.id, action: intent.action, targetAnchor: intent.targetAnchor },
      reason: intent.reason,
      result: route.length > 1 ? 'accepted' : 'completed-at-current-anchor',
      code: 'accepted',
      supersededIntentId: superseded
    });

    const systems = clone(configured.worldState.systems);
    systems.pilotResident.targetAnchor = route.length > 1 ? requestData.targetAnchor : null;
    systems.pilotResident.movementState = route.length > 1 ? 'moving' : 'idle';
    if (systems.autonomousLife) {
      if (requestData.authority === 'resident-need') {
        systems.autonomousLife.enabled = true;
        systems.autonomousLife.action = 'Travel to ' + (chassis.getView(requestData.targetAnchor)?.label || requestData.targetAnchor);
        systems.autonomousLife.reason = intent.reason;
        systems.autonomousLife.targetAnchor = requestData.targetAnchor;
      } else {
        systems.autonomousLife.enabled = false;
        systems.autonomousLife.phase = 'owner-override';
        systems.autonomousLife.goal = 'Yield to direct Owner command';
        systems.autonomousLife.action = 'Idle';
        systems.autonomousLife.reason = 'Direct Owner command superseded lower-priority automation.';
        systems.autonomousLife.targetAnchor = null;
      }
    }
    systems.intentControl = control;
    const reservations = route.length > 1 ? {
      resident: { intentId: intent.id, targetAnchor: intent.targetAnchor, authority: intent.authority }
    } : {};
    const next = commitDecision(core, configured, control, 'intent-request-accepted', reservations, systems);
    return { ok: true, result: 'accepted', state: next, route, intent };
  }

  function start(core, state, trigger) {
    const configured = configureState(core, state).state;
    const control = clone(configured.worldState.systems.intentControl);
    if (control.sessionState === 'running') return { ok: true, result: 'already-running', state: configured };
    if (control.sessionState === 'paused') {
      const systems = clone(configured.worldState.systems);
      control.sessionState = 'running';
      if (control.activeIntent?.authority === 'resident-need') {
        control.activeIntent.status = 'active';
        systems.pilotResident.movementState = 'moving';
      }
      appendDecision(control, {
        actor: 'Owner', trigger: String(trigger || 'owner-resume'), authority: 'owner-direct',
        selectedIntent: control.activeIntent ? { id: control.activeIntent.id, action: control.activeIntent.action, targetAnchor: control.activeIntent.targetAnchor } : null,
        reason: 'Owner resumed the bounded automation session.', result: 'resumed', code: 'session-resumed', supersededIntentId: null
      });
      systems.intentControl = control;
      return { ok: true, result: 'resumed', state: commitDecision(core, configured, control, 'automation-session-resumed', undefined, systems) };
    }
    control.sessionState = 'running';
    control.sessionId += 1;
    control.actionCount = 0;
    control.lastDecisionTick = null;
    control.lastDecisionPriority = 0;
    appendDecision(control, {
      actor: 'Owner', trigger: String(trigger || 'owner-start'), authority: 'owner-direct',
      selectedIntent: null, reason: 'Owner started one bounded automation session.', result: 'started',
      code: 'session-started', supersededIntentId: null
    });
    return { ok: true, result: 'started', state: commitDecision(core, configured, control, 'automation-session-started') };
  }

  function pause(core, state, trigger) {
    const configured = configureState(core, state).state;
    const control = clone(configured.worldState.systems.intentControl);
    if (control.sessionState === 'paused') return { ok: true, result: 'already-paused', state: configured };
    control.sessionState = 'paused';
    const systems = clone(configured.worldState.systems);
    if (control.activeIntent?.authority === 'resident-need') {
      control.activeIntent.status = 'paused';
      systems.pilotResident.movementState = 'idle';
    }
    appendDecision(control, {
      actor: 'Owner', trigger: String(trigger || 'owner-pause'), authority: 'owner-stop',
      selectedIntent: control.activeIntent ? { id: control.activeIntent.id, action: control.activeIntent.action, targetAnchor: control.activeIntent.targetAnchor } : null,
      reason: 'Owner paused new autonomous decisions.', result: 'paused', code: 'session-paused', supersededIntentId: null
    });
    systems.intentControl = control;
    return { ok: true, result: 'paused', state: commitDecision(core, configured, control, 'automation-session-paused', undefined, systems) };
  }

  function stop(core, state, trigger) {
    const configured = configureState(core, state).state;
    const control = clone(configured.worldState.systems.intentControl);
    const superseded = control.activeIntent ? control.activeIntent.id : null;
    const systems = clone(configured.worldState.systems);
    control.sessionState = 'stopped';
    control.activeIntent = null;
    control.environmentAction = null;
    control.lastDecisionPriority = AUTHORITIES['owner-stop'];
    systems.pilotResident.targetAnchor = null;
    systems.pilotResident.movementState = 'idle';
    if (systems.autonomousLife) {
      systems.autonomousLife.enabled = false;
      systems.autonomousLife.phase = 'stopped';
      systems.autonomousLife.goal = 'Waiting for Owner START';
      systems.autonomousLife.action = 'Idle';
      systems.autonomousLife.reason = 'Owner STOP/CANCEL cleared automation safely.';
      systems.autonomousLife.targetAnchor = null;
    }
    appendDecision(control, {
      actor: 'Owner', trigger: String(trigger || 'owner-stop'), authority: 'owner-stop',
      selectedIntent: null, reason: 'Owner STOP/CANCEL cleared active automation and routing.',
      result: superseded ? 'stopped' : 'already-stopped', code: 'session-stopped', supersededIntentId: superseded
    });
    systems.intentControl = control;
    return {
      ok: true,
      result: superseded ? 'stopped' : 'already-stopped',
      state: commitDecision(core, configured, control, 'automation-session-stopped', {}, systems)
    };
  }

  function recordOwnerOverride(core, state, surface, mode, trigger) {
    const configured = configureState(core, state).state;
    if (!OWNER_MODES[surface] || !OWNER_MODES[surface].includes(mode)) {
      return { ok: false, code: 'invalid-owner-override', error: 'Owner override surface or mode is invalid.', state: configured };
    }
    const control = clone(configured.worldState.systems.intentControl);
    control.ownerOverrides[surface] = mode;
    appendDecision(control, {
      actor: 'Owner', trigger: String(trigger || 'owner-environment-control'), authority: 'owner-direct',
      selectedIntent: { action: 'environment-mode', targetAnchor: surface, mode },
      reason: 'Owner selected the ' + mode + ' mode for ' + surface + '.', result: 'owner-override-recorded',
      code: 'owner-override-recorded', supersededIntentId: null
    });
    return { ok: true, result: 'owner-override-recorded', state: commitDecision(core, configured, control, 'owner-environment-override-recorded') };
  }

  function requestEnvironment(core, state, requestData) {
    const configured = configureState(core, state).state;
    const control = clone(configured.worldState.systems.intentControl);
    const allowed = {
      suite: { mode: 'rest', targetAnchor: 'bedroom-upper' },
      media: { mode: 'ambient', targetAnchor: 'media-ground' }
    };
    const contract = allowed[requestData?.surface];
    if (!contract || requestData.mode !== contract.mode || typeof requestData.reason !== 'string' || !requestData.reason.trim()) {
      return { ok: false, code: 'unregistered-environment-action', error: 'Environment action is not registered for the bounded scenario.', state: configured };
    }
    if (!control.activeIntent || control.activeIntent.authority !== 'resident-need' || control.activeIntent.targetAnchor !== contract.targetAnchor) {
      return { ok: false, code: 'environment-intent-mismatch', error: 'Environment action does not match the active resident intent.', state: configured };
    }
    if (control.ownerOverrides[requestData.surface]) {
      appendDecision(control, {
        actor: 'Avery', trigger: 'registered-arrival', authority: 'resident-need',
        selectedIntent: { action: 'environment-mode', targetAnchor: requestData.surface, mode: requestData.mode },
        reason: requestData.reason.trim(), result: 'owner-override-preserved', code: 'owner-override-preserved',
        supersededIntentId: null
      });
      return {
        ok: true,
        result: 'owner-override-preserved',
        state: commitDecision(core, configured, control, 'automation-owner-override-preserved')
      };
    }
    control.environmentAction = {
      intentId: control.activeIntent.id,
      surface: requestData.surface,
      mode: requestData.mode,
      reason: requestData.reason.trim()
    };
    appendDecision(control, {
      actor: 'Avery', trigger: 'registered-arrival', authority: 'resident-need',
      selectedIntent: { action: 'environment-mode', targetAnchor: requestData.surface, mode: requestData.mode },
      reason: requestData.reason.trim(), result: 'accepted', code: 'environment-action-accepted', supersededIntentId: null
    });
    return { ok: true, result: 'accepted', state: commitDecision(core, configured, control, 'automation-environment-action-accepted') };
  }

  function complete(core, state, anchorId) {
    const configured = configureState(core, state).state;
    const control = clone(configured.worldState.systems.intentControl);
    const intent = control.activeIntent;
    if (!intent || intent.targetAnchor !== anchorId) {
      return { ok: false, code: 'arrival-mismatch', error: 'Arrival does not match the active intent.', state: configured };
    }
    const systems = clone(configured.worldState.systems);
    systems.pilotResident.currentAnchor = anchorId;
    systems.pilotResident.targetAnchor = null;
    systems.pilotResident.movementState = 'idle';
    control.activeIntent = null;
    control.environmentAction = null;
    if (intent.authority === 'resident-need' && control.actionCount >= MAX_AUTONOMOUS_ACTIONS) {
      control.sessionState = 'stopped';
    }
    appendDecision(control, {
      actor: intent.actor, trigger: 'registered-arrival', authority: intent.authority,
      selectedIntent: { id: intent.id, action: intent.action, targetAnchor: intent.targetAnchor },
      reason: 'The resident reached the registered destination.', result: 'completed', code: 'intent-completed', supersededIntentId: null
    });
    systems.intentControl = control;
    return { ok: true, state: commitDecision(core, configured, control, 'intent-route-completed', {}, systems), intent };
  }

  root.LivingObservatoryIntentArbiter = Object.freeze({
    authorities: AUTHORITIES,
    maxDecisions: MAX_DECISIONS,
    maxAutonomousActions: MAX_AUTONOMOUS_ACTIONS,
    ownerModes: OWNER_MODES,
    validateState,
    configureState,
    request,
    start,
    pause,
    stop,
    complete,
    recordOwnerOverride,
    requestEnvironment
  });
}(window));
