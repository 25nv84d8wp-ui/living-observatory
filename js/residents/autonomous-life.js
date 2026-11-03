(function (root) {
  'use strict';

  const ENERGY_THRESHOLD = 40;
  const DEMO_ENERGY = 32;
  const RESTORED_ENERGY = 88;
  const REST_SECONDS = 3;
  const DEFAULT_TRAITS = Object.freeze({ curiosity: 82, comfortSeeking: 64 });

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function defaultSystem() {
    return {
      enabled: false,
      phase: 'idle',
      goal: 'Waiting for owner start',
      action: 'Idle',
      reason: 'Autonomous life has not been started.',
      targetAnchor: null,
      completedLoops: 0
    };
  }

  function configureState(core, state) {
    let next = state;
    let changed = false;
    const behavior = clone(next.residentProfile.behavior);
    const traits = { ...DEFAULT_TRAITS, ...behavior.traits };
    const likes = Array.from(new Set([...(behavior.preferences.likes || []), 'media-room-observation']));
    if (Object.keys(DEFAULT_TRAITS).some(key => behavior.traits[key] === undefined) || likes.length !== behavior.preferences.likes.length) {
      behavior.traits = traits;
      behavior.preferences.likes = likes;
      next = core.commitResident(next, { behavior }, 'autonomous-life-profile-configured');
      changed = true;
    }
    if (!next.worldState.systems.autonomousLife) {
      const systems = clone(next.worldState.systems);
      systems.autonomousLife = defaultSystem();
      next = core.commitWorld(next, { systems }, 'autonomous-life-registered');
      changed = true;
    }
    return { state: next, changed };
  }

  function start(core, chassis, pilot, state, arbiter, tick) {
    const configured = configureState(core, state);
    let next = configured.state;
    const resident = next.worldState.systems.pilotResident;
    const life = next.worldState.systems.autonomousLife;
    if (!resident) return { ok: false, error: 'Pilot resident is not registered.' };
    if (resident.movementState !== 'idle') return { ok: false, error: 'Resident is already following a route.' };
    if (life.enabled) return { ok: false, error: 'Autonomous cycle is already active.' };

    const route = chassis.shortestRoute(resident.currentAnchor, 'bedroom-upper');
    if (!route) return { ok: false, error: 'No registered route to the resting place.' };

    const behavior = clone(next.residentProfile.behavior);
    behavior.needs.energy = Math.min(behavior.needs.energy, DEMO_ENERGY);
    behavior.goals = behavior.goals.filter(goal => goal.id !== 'restore-energy');
    behavior.goals.push({ id: 'restore-energy', status: 'active' });
    next = core.commitResident(next, { behavior }, 'autonomous-energy-need-observed');

    const systems = clone(next.worldState.systems);
    systems.autonomousLife = {
      ...systems.autonomousLife,
      enabled: true,
      phase: 'seeking-rest',
      goal: 'Restore energy',
      action: 'Travel to Upper bedroom',
      reason: 'Energy ' + behavior.needs.energy + ' is below the ' + ENERGY_THRESHOLD + ' attention threshold.',
      targetAnchor: 'bedroom-upper'
    };
    next = core.commitWorld(next, { systems }, 'autonomous-need-action-selected');
    const routed = arbiter
      ? arbiter.request(core, chassis, next, {
          authority: 'resident-need',
          actor: 'Avery',
          trigger: 'low-energy',
          action: 'route',
          targetAnchor: 'bedroom-upper',
          reason: systems.autonomousLife.reason,
          tick
        })
      : pilot.beginRoute(core, chassis, next, 'bedroom-upper', 'autonomous-rest-route-started');
    if (!routed.ok) return { ok: false, error: routed.error };
    return { ok: true, state: routed.state, route: routed.route };
  }

  function handleArrival(core, state, anchorId) {
    const life = state.worldState.systems.autonomousLife;
    if (!life || !life.enabled) return { changed: false, state };
    const systems = clone(state.worldState.systems);
    if (life.phase === 'seeking-rest' && anchorId === 'bedroom-upper') {
      systems.autonomousLife = {
        ...life,
        phase: 'resting',
        action: 'Resting in Upper bedroom',
        reason: 'Avery reached the registered resting place to resolve low energy.',
        targetAnchor: null
      };
      return { changed: true, state: core.commitWorld(state, { systems }, 'autonomous-rest-started') };
    }
    if (life.phase === 'trait-choice' && anchorId === life.targetAnchor) {
      systems.autonomousLife = {
        ...life,
        enabled: false,
        phase: 'complete',
        goal: 'Energy restored; ordinary choice completed',
        action: 'Observing Ground media',
        reason: 'Energy restored to ' + state.residentProfile.behavior.needs.energy + '; curiosity selected Ground media.',
        targetAnchor: null,
        completedLoops: life.completedLoops + 1
      };
      return { changed: true, state: core.commitWorld(state, { systems }, 'autonomous-life-cycle-completed') };
    }
    return { changed: false, state };
  }

  function resolveRest(core, chassis, pilot, state, arbiter, tick) {
    const life = state.worldState.systems.autonomousLife;
    if (!life || !life.enabled || life.phase !== 'resting') return { ok: false, error: 'No autonomous rest action is active.' };
    let next = state;
    const behavior = clone(next.residentProfile.behavior);
    behavior.needs.energy = RESTORED_ENERGY;
    behavior.goals = behavior.goals.map(goal => goal.id === 'restore-energy' ? { ...goal, status: 'resolved' } : goal);
    next = core.commitResident(next, { behavior }, 'autonomous-energy-restored');

    const curiosity = Number(behavior.traits.curiosity || 0);
    const comfortSeeking = Number(behavior.traits.comfortSeeking || 0);
    const targetAnchor = curiosity >= comfortSeeking ? 'media-ground' : 'living-ground';
    const targetLabel = chassis.getView(targetAnchor)?.label || targetAnchor;
    const systems = clone(next.worldState.systems);
    systems.autonomousLife = {
      ...systems.autonomousLife,
      phase: 'trait-choice',
      goal: 'Make one ordinary post-rest choice',
      action: 'Travel to ' + targetLabel,
      reason: 'Curiosity ' + curiosity + ' exceeds comfort-seeking ' + comfortSeeking + ', so Avery chose ' + targetLabel + '.',
      targetAnchor
    };
    next = core.commitWorld(next, { systems }, 'autonomous-trait-choice-selected');
    const routed = arbiter
      ? arbiter.request(core, chassis, next, {
          authority: 'resident-need',
          actor: 'Avery',
          trigger: 'rest-complete-trait-choice',
          action: 'route',
          targetAnchor,
          reason: systems.autonomousLife.reason,
          tick
        })
      : pilot.beginRoute(core, chassis, next, targetAnchor, 'autonomous-choice-route-started');
    if (!routed.ok) return { ok: false, error: routed.error };
    return { ok: true, state: routed.state, route: routed.route };
  }

  root.LivingObservatoryAutonomousLife = Object.freeze({
    energyThreshold: ENERGY_THRESHOLD,
    restSeconds: REST_SECONDS,
    restoredEnergy: RESTORED_ENERGY,
    defaultTraits: DEFAULT_TRAITS,
    configureState,
    start,
    handleArrival,
    resolveRest
  });
}(window));
