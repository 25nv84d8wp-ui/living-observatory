(function (root) {
  'use strict';

  const APPEARANCE_ID = 'procedural-pilot-v1';
  const DISPLAY_NAME = 'Avery';
  const DEFAULT_NEEDS = Object.freeze({ energy: 72, hunger: 68, comfort: 76 });

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function configureState(core, state) {
    let next = state;
    let changed = false;
    const profileChanges = {};
    const behavior = clone(state.residentProfile.behavior);
    const needs = { ...DEFAULT_NEEDS, ...behavior.needs };

    if (state.residentProfile.displayName === null) profileChanges.displayName = DISPLAY_NAME;
    if (state.residentProfile.appearance.assetId === null) {
      profileChanges.appearance = { assetId: APPEARANCE_ID, revision: state.residentProfile.appearance.revision + 1 };
    }
    if (Object.keys(DEFAULT_NEEDS).some(key => behavior.needs[key] === undefined)) {
      behavior.needs = needs;
      profileChanges.behavior = behavior;
    }
    if (Object.keys(profileChanges).length) {
      next = core.commitResident(next, profileChanges, 'pilot-resident-configured');
      changed = true;
    }

    const systems = clone(next.worldState.systems);
    if (!systems.pilotResident) {
      systems.pilotResident = { currentAnchor: 'entry-ground', targetAnchor: null, movementState: 'idle' };
      next = core.commitWorld(next, { systems }, 'pilot-resident-registered');
      changed = true;
    }
    return { state: next, changed };
  }

  function anchorPosition(chassis, anchorId) {
    const view = chassis.getView(anchorId);
    if (!view) return null;
    return {
      x: view.target[0],
      y: view.zone === 'upper' ? 4.12 : 0.30,
      z: view.target[2]
    };
  }

  function beginRoute(core, chassis, state, targetAnchor, eventType) {
    const resident = state.worldState.systems.pilotResident;
    const route = chassis.shortestRoute(resident.currentAnchor, targetAnchor);
    if (!route) return { ok: false, error: 'No registered resident route to ' + targetAnchor + '.' };
    let next = state;
    const systems = clone(next.worldState.systems);
    systems.pilotResident.targetAnchor = targetAnchor;
    systems.pilotResident.movementState = route.length > 1 ? 'moving' : 'idle';
    next = core.commitWorld(next, { systems }, eventType || 'resident-route-started');
    return { ok: true, state: next, route };
  }

  function acceptCall(core, chassis, state, targetAnchor) {
    const behavior = clone(state.residentProfile.behavior);
    behavior.ownerInstructions.push({ command: 'call-resident', targetAnchor });
    behavior.ownerInstructions = behavior.ownerInstructions.slice(-20);
    const next = core.commitResident(state, { behavior }, 'owner-command-accepted');
    return beginRoute(core, chassis, next, targetAnchor, 'resident-route-started');
  }

  function arrive(core, state, anchorId) {
    const systems = clone(state.worldState.systems);
    systems.pilotResident.currentAnchor = anchorId;
    systems.pilotResident.targetAnchor = null;
    systems.pilotResident.movementState = 'idle';
    return core.commitWorld(state, { systems }, 'resident-route-completed');
  }

  function createEntity(pc) {
    const resident = new pc.Entity('Pilot Resident - ' + DISPLAY_NAME);
    const material = color => {
      const result = new pc.StandardMaterial();
      result.diffuse = new pc.Color(color[0], color[1], color[2]);
      result.metalness = 0.05;
      result.gloss = 0.32;
      result.update();
      return result;
    };
    const skin = material([0.72, 0.46, 0.32]);
    const jacket = material([0.08, 0.52, 0.55]);
    const dark = material([0.055, 0.075, 0.095]);
    const accent = material([0.72, 0.87, 0.82]);

    const part = (name, type, position, scale, partMaterial, rotation) => {
      const entity = new pc.Entity(name);
      entity.addComponent('render', { type });
      entity.setLocalPosition(position[0], position[1], position[2]);
      entity.setLocalScale(scale[0], scale[1], scale[2]);
      if (rotation) entity.setLocalEulerAngles(rotation[0], rotation[1], rotation[2]);
      entity.render.material = partMaterial;
      resident.addChild(entity);
      return entity;
    };

    part('Head', 'sphere', [0, 1.72, 0], [0.27, 0.31, 0.27], skin);
    part('Neck', 'cylinder', [0, 1.48, 0], [0.13, 0.12, 0.13], skin);
    part('Torso', 'capsule', [0, 1.08, 0], [0.38, 0.56, 0.25], jacket);
    part('Core Emblem', 'box', [0, 1.20, -0.245], [0.12, 0.12, 0.025], accent);
    part('Hips', 'box', [0, 0.72, 0], [0.34, 0.18, 0.24], dark);
    part('Left Arm', 'capsule', [-0.45, 1.12, 0], [0.12, 0.45, 0.12], jacket, [0, 0, -5]);
    part('Right Arm', 'capsule', [0.45, 1.12, 0], [0.12, 0.45, 0.12], jacket, [0, 0, 5]);
    part('Left Hand', 'sphere', [-0.49, 0.72, 0], [0.13, 0.16, 0.13], skin);
    part('Right Hand', 'sphere', [0.49, 0.72, 0], [0.13, 0.16, 0.13], skin);
    part('Left Leg', 'capsule', [-0.18, 0.34, 0], [0.14, 0.42, 0.15], dark);
    part('Right Leg', 'capsule', [0.18, 0.34, 0], [0.14, 0.42, 0.15], dark);
    part('Left Shoe', 'box', [-0.18, 0.06, -0.08], [0.17, 0.08, 0.27], accent);
    part('Right Shoe', 'box', [0.18, 0.06, -0.08], [0.17, 0.08, 0.27], accent);
    resident._loMaterials = [skin, jacket, dark, accent];
    return resident;
  }

  root.LivingObservatoryPilotResident = Object.freeze({
    appearanceId: APPEARANCE_ID,
    displayName: DISPLAY_NAME,
    defaultNeeds: DEFAULT_NEEDS,
    configureState,
    anchorPosition,
    beginRoute,
    acceptCall,
    arrive,
    createEntity
  });
}(window));
