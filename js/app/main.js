/* global pc */
(function () {
  'use strict';

  const canvas = document.getElementById('application');
  const status = document.getElementById('status');
  const detail = document.getElementById('detail');
  const fatal = document.getElementById('fatal');
  const controls = {
    enter: document.getElementById('enter'),
    space: document.getElementById('space'),
    decor: document.getElementById('decor'),
    phone: document.getElementById('phone'),
    media: document.getElementById('media'),
    suite: document.getElementById('suite'),
    upper: document.getElementById('upper-wing'),
    garage: document.getElementById('garage'),
    atc: document.getElementById('atc'),
    survey: document.getElementById('survey'),
    system: document.getElementById('system-status'),
    kitchen: document.getElementById('kitchen-status'),
    fit: document.getElementById('fit-room'),
    exit: document.getElementById('exit'),
    reset: document.getElementById('reset')
  };
  const phone = {
    panel: document.getElementById('phone-panel'),
    name: document.getElementById('phone-name'),
    needs: document.getElementById('phone-needs'),
    location: document.getElementById('phone-location'),
    command: document.getElementById('phone-command'),
    goal: document.getElementById('phone-goal'),
    reason: document.getElementById('phone-reason'),
    authority: document.getElementById('phone-authority'),
    action: document.getElementById('phone-action'),
    target: document.getElementById('phone-target'),
    override: document.getElementById('phone-override'),
    call: document.getElementById('call-resident'),
    autonomy: document.getElementById('start-autonomy'),
    pause: document.getElementById('pause-autonomy'),
    stop: document.getElementById('stop-autonomy'),
    close: document.getElementById('close-phone')
  };
  const survey = {
    panel: document.getElementById('survey-panel'),
    location: document.getElementById('survey-location'),
    instruction: document.getElementById('survey-instruction'),
    levelTitle: document.getElementById('survey-level-title'),
    roomList: document.getElementById('survey-room-list'),
    ground: document.getElementById('survey-ground'),
    upper: document.getElementById('survey-upper'),
    previous: document.getElementById('survey-previous'),
    next: document.getElementById('survey-next'),
    close: document.getElementById('survey-close')
  };
  const media = {
    panel: document.getElementById('media-panel'),
    status: document.getElementById('media-status'),
    off: document.getElementById('media-off'),
    ambient: document.getElementById('media-ambient'),
    cinema: document.getElementById('media-cinema'),
    close: document.getElementById('close-media')
  };
  const suite = {
    panel: document.getElementById('suite-panel'),
    status: document.getElementById('suite-status'),
    rest: document.getElementById('suite-rest'),
    sunrise: document.getElementById('suite-sunrise'),
    spa: document.getElementById('suite-spa'),
    terrace: document.getElementById('suite-terrace'),
    close: document.getElementById('close-suite')
  };
  const upper = {
    panel: document.getElementById('upper-panel'),
    status: document.getElementById('upper-status'),
    focus: document.getElementById('upper-focus'),
    read: document.getElementById('upper-read'),
    guest: document.getElementById('upper-guest'),
    night: document.getElementById('upper-night'),
    close: document.getElementById('close-upper')
  };
  const garage = {
    panel: document.getElementById('garage-panel'),
    status: document.getElementById('garage-status'),
    arrival: document.getElementById('garage-arrival'),
    charge: document.getElementById('garage-charge'),
    display: document.getElementById('garage-display'),
    service: document.getElementById('garage-service'),
    close: document.getElementById('close-garage')
  };
  const atc = {
    panel: document.getElementById('atc-panel'),
    route: document.getElementById('atc-route-status'),
    power: document.getElementById('atc-power-status'),
    hub: document.getElementById('atc-hub-status'),
    scientist01: document.getElementById('atc-scientist-01'),
    scientist02: document.getElementById('atc-scientist-02'),
    message: document.getElementById('atc-message-status'),
    emailTestStatus: document.getElementById('atc-email-test-status'),
    faxStatus: document.getElementById('atc-fax-status'),
    dingStatus: document.getElementById('atc-ding-status'),
    faxNotice: document.getElementById('atc-fax-notice'),
    movement: document.getElementById('atc-movement-status'),
    check: document.getElementById('atc-check-status'),
    emailTest: document.getElementById('atc-run-email-test'),
    cue: document.getElementById('atc-issue-fax-ding'),
    call: document.getElementById('atc-call-resident'),
    close: document.getElementById('close-atc')
  };
  const system = {
    panel: document.getElementById('system-panel'),
    summary: document.getElementById('system-summary'),
    results: document.getElementById('system-results'),
    close: document.getElementById('close-system')
  };
  const kitchen = {
    panel: document.getElementById('kitchen-panel'),
    connection: document.getElementById('kitchen-connection-status'),
    refrigerator: document.getElementById('kitchen-refrigerator-status'),
    oven: document.getElementById('kitchen-oven-status'),
    induction: document.getElementById('kitchen-induction-status'),
    projection: document.getElementById('kitchen-projection-status'),
    authority: document.getElementById('kitchen-authority'),
    close: document.getElementById('close-kitchen')
  };
  const chassis = window.LivingObservatoryChassis;
  const core = window.LivingObservatoryIntelligenceCore;
  const pilot = window.LivingObservatoryPilotResident;
  const autonomy = window.LivingObservatoryAutonomousLife;
  const arbiter = window.LivingObservatoryIntentArbiter;
  const MANIFEST = {
    worldScale: 0.01,
    layers: [
      ['exterior', 'assets/models/LIVING_OBSERVATORY_LAYER_01_EXTERIOR.glb'],
      ['interior', 'assets/models/LIVING_OBSERVATORY_LAYER_02_INTERIOR.glb'],
      ['furniture', 'assets/models/LIVING_OBSERVATORY_LAYER_03_FURNITURE.glb'],
      ['decor', 'assets/models/LIVING_OBSERVATORY_LAYER_04_DECOR.glb']
    ]
  };
  const E2_FOYER_CORE = Object.freeze({
    version: '2.0',
    name: 'Living Observatory - E2 Foyer Intelligence Core',
    location: [4.7, 0.3, 13.4],
    landmark: 'Foyer Intelligence Core',
    architecturalLanguage: 'warm-luxury-futurist-coastal'
  });
  const E3_CHEF_KITCHEN = Object.freeze({
    version: '3.2',
    name: 'Living Observatory - E3 Chef Kitchen',
    zone: 'kitchen-ground',
    anchor: [2.2, 1.45, 3.2],
    architecturalLanguage: 'warm-chef-luxury-futurist-coastal'
  });
  const E3_KITCHEN_EQUIPMENT_REGISTRY = Object.freeze({
    version: window.LO_VERSION.number,
    controllerId: 'LO-CORE-001',
    zone: 'kitchen-ground',
    endpoints: Object.freeze([
      Object.freeze({ id: 'KITCHEN-REFRIGERATOR-01', label: 'Advanced Refrigerator', form: 'cold-storage', state: 'SAFE_STANDBY' }),
      Object.freeze({ id: 'KITCHEN-DOUBLE-OVEN-01', label: 'Flush Double Ovens', form: 'thermal', state: 'SAFE_STANDBY' }),
      Object.freeze({ id: 'KITCHEN-INDUCTION-HOOD-01', label: 'Four-Zone Induction + Hood', form: 'cooking-ventilation', state: 'SAFE_STANDBY' }),
      Object.freeze({ id: 'KITCHEN-ISLAND-PROJECTION-01', label: 'Island Projection Surface', form: 'owner-display', state: 'VISUAL_ONLY' })
    ]),
    controlsExposed: 0,
    applianceBehaviors: 0,
    projectionBehaviors: 0
  });
  const E4_LIVING_DINING = Object.freeze({
    version: '4.0',
    name: 'Living Observatory - E4 Living and Dining',
    zones: ['living-ground', 'dining-ground'],
    livingAnchor: [9.1, 1.45, 4.0],
    diningAnchor: [13.5, 1.45, 3.2],
    architecturalLanguage: 'warm-social-luxury-futurist-coastal'
  });
  const E5_GROUND_MEDIA = Object.freeze({
    version: '5.0',
    name: 'Living Observatory - E5 Ground Media Room',
    zone: 'media-ground',
    anchor: [1.25, 1.5, 12.3],
    displayModes: ['off', 'ambient', 'cinema'],
    architecturalLanguage: 'warm-cinematic-luxury-futurist-coastal'
  });
  const E6_PRIMARY_SUITE = Object.freeze({
    version: '6.0',
    name: 'Living Observatory - E6 Primary Suite',
    zones: ['bedroom-upper', 'dressing-upper', 'primary-bath-upper', 'terrace-upper'],
    anchors: {
      bedroom: [16.1, 5.45, 14.1],
      dressing: [16.0, 5.45, 11.2],
      bath: [12.4, 5.45, 8.0],
      terrace: [14.8, 5.35, 20.3]
    },
    scenes: ['rest', 'sunrise', 'spa', 'terrace'],
    architecturalLanguage: 'magical-warm-private-luxury-futurist-coastal'
  });
  const E7_UPPER_WING = Object.freeze({
    version: '7.0',
    name: 'Living Observatory - E7 Upper Wing',
    zones: ['lounge-upper', 'workspace-upper', 'office-upper', 'shared-bath-upper'],
    anchors: {
      lounge: [0.2, 5.45, 12.8],
      study: [5.2, 5.45, 2.8],
      guest: [14.2, 5.45, 3.0],
      bath: [6.8, 5.45, 6.2]
    },
    modes: ['focus', 'read', 'guest', 'night'],
    architecturalLanguage: 'quiet-observatory-luxury-futurist-coastal'
  });
  const E8_TECH_BAY = Object.freeze({
    version: '8.0',
    name: 'Living Observatory - E8 Garage Technology Bay',
    zone: 'garage-ground',
    anchor: [14.1, 1.45, 21.4],
    modes: ['arrival', 'charge', 'display', 'service'],
    vehicleShells: 1,
    drivetrainSystems: 0,
    architecturalLanguage: 'warm-precision-luxury-futurist-mobility-bay'
  });
  const E10_1_ATC_ACCESS = Object.freeze({
    version: '11.2',
    name: 'Living Observatory - Advanced Technology Center Fax Ding Email Orientation',
    zones: ['atc-access-ground', 'atc-ground', 'atc-workshop-ground', 'atc-annex-ground', 'atc-teleporter-ground', 'atc-tme-ground'],
    route: ['garage-ground', 'atc-access-ground', 'atc-ground'],
    hubId: 'TLO-CIH-112-118-123',
    communicationsHost: 'ATC-COMMS-0.4F',
    scientistEndpoints: ['ATC-EXISTING-SCIENTIST-01', 'ATC-EXISTING-SCIENTIST-02'],
    geometryAuthority: 'PROVISIONAL_REVERSIBLE_EXPANDABLE_APPROXIMATION',
    powerAuthority: 'INHERIT_FROM_ACTIVE_ESTATE_RUNTIME',
    dutyBaseline: 'DAILY_MAINTENANCE_PASSIVE_DATA_ROUTINE_SCIENTIFIC_WORK',
    architecturalLanguage: 'protected-professional-scientific-futurist'
  });
  const E9_EXTERIOR_SHELL = Object.freeze({
    version: '9.2',
    name: 'Living Observatory - E9 Exterior Environmental Shell',
    views: ['exterior-overview', 'exterior-arrival', 'exterior-waterfront', 'exterior-fire-court', 'exterior-night-garden'],
    subsystems: ['terrain', 'hardscape', 'landscape', 'water', 'fire', 'lighting'],
    architecturalLanguage: 'warm-luxury-futurist-coastal-sanctuary',
    budgets: Object.freeze({
      externalDependencies: 0,
      largeModelAssets: 0,
      dynamicShadows: 0,
      postProcessingPasses: 0,
      particleEmitters: 0,
      continuousExteriorAnimation: 0,
      duplicateNavigationAuthorities: 0,
      protectedBehaviorChanges: 0
    })
  });

  let app;
  let root;
  let generation = 0;
  let busy = false;
  const queue = [];
  const layers = Object.create(null);
  const interactionRegistry = new Map();
  const interiorViewOrder = chassis.manifest.navigation.operational;
  const exteriorViewOrder = chassis.manifest.navigation.exterior;
  const surveyViewOrder = chassis.manifest.navigation.survey;
  const roomRegistry = chassis.manifest.roomRegistry;
  const orbit = { yaw: 0, pitch: 0, distance: 1, fov: chassis.manifest.camera.defaultFov, target: new pc.Vec3(0, 0, 0) };
  let currentViewId = 'exterior-overview';
  let lastOperationalViewId = 'exterior-overview';
  let surveyMode = false;
  let surveyLevel = 'ground';
  let coreState = null;
  let coreStorage = null;
  let coreHealth = 'state initializing';
  let residentEntity = null;
  let foyerCoreEntity = null;
  let chefKitchenEntity = null;
  let livingDiningEntity = null;
  let mediaRoomEntity = null;
  let mediaScreenEntity = null;
  let mediaDisplayMaterials = null;
  let mediaAccentEntities = [];
  let mediaMode = 'off';
  let mediaMetrics = { partCount: 0, seatingPlaces: 0, tableSurfaces: 0, lightElements: 0, audioForms: 0, registeredInteractions: 0 };
  let primarySuiteEntity = null;
  let suiteScene = 'rest';
  let suiteSceneMaterials = null;
  let suiteLightEntities = [];
  let suitePrivacyEntity = null;
  let suiteMediaEntity = null;
  let suiteWaterEntity = null;
  let suiteFireEntity = null;
  let suiteMetrics = { partCount: 0, bedroomParts: 0, dressingParts: 0, bathParts: 0, terraceParts: 0, sleepPlaces: 0, seatingPlaces: 0, tableSurfaces: 0, lightElements: 0, registeredInteractions: 0 };
  let upperWingEntity = null;
  let upperMode = 'read';
  let upperModeMaterials = null;
  let upperLightEntities = [];
  let upperDisplayEntity = null;
  let upperPrivacyEntity = null;
  let upperMirrorEntity = null;
  let upperMetrics = { partCount: 0, loungeParts: 0, studyParts: 0, guestParts: 0, bathParts: 0, sleepPlaces: 0, seatingPlaces: 0, tableSurfaces: 0, lightElements: 0, registeredInteractions: 0 };
  let garageTechBayEntity = null;
  let vehicleShellEntity = null;
  let garageMode = 'display';
  let garageModeMaterials = null;
  let garageLightEntities = [];
  let garageDiagnosticEntities = [];
  let vehicleAccentEntities = [];
  let garageMetrics = { partCount: 0, bayParts: 0, vehicleParts: 0, vehicleShells: 0, wheelForms: 0, lightElements: 0, chargingForms: 0, diagnosticForms: 0, registeredInteractions: 0 };
  let atcAccessEntity = null;
  let atcDoorRotorEntity = null;
  let atcDoorPhase = 0;
  let atcDoorActive = false;
  let atcScientistEntities = [];
  let atcScientistClock = 0;
  let atcEmailTest = {
    id: 'ATC-MAIL-TEST-0001',
    mode: 'MACHINE_SIDE_FAIL_CLOSED',
    subject: 'Communications Transport Verification',
    status: 'NOT_RUN',
    route: [],
    endpointStates: ['NOT_SENT', 'NOT_SENT'],
    ledger: [],
    scientistAcknowledgment: 'NONE',
    scientistReply: 'NONE',
    recognitionFax: 'INSTALLED_QUEUED',
    audibleDing: 'ARMED_ONCE_NOT_CLAIMED_HEARD',
    cueIssuedAt: null,
    emailOrientation: 'NOT_PRESENTED'
  };
  let atcAudioContext = null;
  const atcScientistState = [
    { id: 'ATC-EXISTING-SCIENTIST-01', anchorIndex: 0, nextIndex: 1, movementCount: 0, position: [24.0, 0.0, 17.3], anchors: [[24.0, 0.0, 17.3], [28.2, 0.0, 21.8], [24.3, 0.0, 29.4], [26.8, 0.0, 18.2]], labels: ['intake / triage', 'professional workstation', 'teleporter custody boundary', 'calibration bay'] },
    { id: 'ATC-EXISTING-SCIENTIST-02', anchorIndex: 0, nextIndex: 1, movementCount: 0, position: [36.0, 0.0, 24.7], anchors: [[36.0, 0.0, 24.7], [38.0, 0.0, 28.8], [31.5, 0.0, 20.2], [34.1, 0.0, 26.7]], labels: ['shared research office', 'TME-00 observation boundary', 'Research & Repair Ledger', 'quiet theory area'] }
  ];
  let atcMetrics = { partCount: 0, passageParts: 0, doorParts: 0, centerParts: 0, scientistBodies: 0, recognizedZones: 0, registeredInteractions: 0 };
  let exteriorShellEntity = null;
  let exteriorSubsystems = Object.create(null);
  let exteriorMetrics = { partCount: 0, terrainParts: 0, hardscapeParts: 0, landscapeParts: 0, waterParts: 0, fireParts: 0, lightingParts: 0 };
  const performanceSamples = [];
  let fitRoomUses = 0;
  let actualCameraDistance = 0;
  let preflightFailure = null;
  let residentRoute = [];
  let movementPhase = 0;
  let autonomyRestRemaining = 0;
  let decisionTick = 0;
  window.__LO_PARENT_BUILD_ID__ = window.LO_VERSION.parentBuildId;
  window.__LO_BUILD_ID__ = window.LO_VERSION.buildId;

  function bindTap(element, handler) {
    let lastTouchAt = 0;
    let touchStart = null;
    let touchMoved = false;
    element.addEventListener('touchstart', event => {
      const touch = event.changedTouches[0];
      touchStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
      touchMoved = false;
    }, { passive: true });
    element.addEventListener('touchmove', event => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      if (Math.hypot(touch.clientX - touchStart.x, touch.clientY - touchStart.y) > 10) touchMoved = true;
    }, { passive: true });
    element.addEventListener('touchcancel', () => {
      lastTouchAt = Date.now();
      touchStart = null;
      touchMoved = true;
    }, { passive: true });
    element.addEventListener('touchend', event => {
      lastTouchAt = Date.now();
      const intentionalTap = Boolean(touchStart) && !touchMoved;
      touchStart = null;
      touchMoved = false;
      if (element.disabled || !intentionalTap) return;
      event.preventDefault();
      event.stopPropagation();
      handler(event);
    }, { passive: false });
    element.addEventListener('click', event => {
      if (element.disabled || Date.now() - lastTouchAt < 700) return;
      event.stopPropagation();
      handler(event);
    });
  }

  function activateSpaceControl() {
    if (surveyMode) stepSurvey(1);
    else nextSpace();
  }

  function activateSurveyControl() {
    if (surveyMode) closeSurvey();
    else openSurvey();
  }

  function setStatus(message, extra) {
    status.textContent = message;
    const base = extra || 'Local files only · no runtime account or network dependency';
    detail.textContent = base + (coreHealth ? ' · ' + coreHealth : '');
  }

  function fail(message) {
    preflightFailure = String(message);
    fatal.style.display = 'block';
    fatal.textContent = 'Integration error: ' + message;
    setStatus('STOPPED SAFELY', message);
    console.error('[Living Observatory]', message);
    publishPreflightState();
  }

  // Phone fix: one missing model no longer stops the whole estate. The layer is marked
  // 'error', a warning is shown, everything that does not need that layer keeps working,
  // and asking for the layer again (e.g. ENTER PROPERTY / LOAD DÉCOR) retries it.
  const layerErrors = {};
  window.__LO_LAYER_ERRORS__ = layerErrors;
  function layerFailed(name, message) {
    const layer = layers[name];
    if (layer) {
      discardEmbeddedAsset(layer);
      if (!layer.embedded && layer.asset) {
        // A failed PlayCanvas asset cannot be reloaded; swap in a fresh one so a retry works.
        app.assets.remove(layer.asset);
        layer.asset = new pc.Asset('Living Observatory - ' + name, 'container', { url: layer.url });
        app.assets.add(layer.asset);
      }
      layer.state = 'error';
    }
    layerErrors[name] = String(message);
    fatal.style.display = 'block';
    fatal.textContent = 'Model unavailable: ' + message + ' · other areas still work · try again with the same button';
    setStatus('Partly loaded', name + ' model unavailable');
    console.warn('[Living Observatory]', message);
    publishPreflightState();
  }

  function requestRender() {
    if (app) app.renderNextFrame = true;
  }

  function publishPreflightState() {
    const view = chassis.getView(currentViewId);
    const sampleCount = performanceSamples.length;
    const totalFrameMs = performanceSamples.reduce((total, value) => total + value, 0);
    const averageFrameMs = sampleCount ? totalFrameMs / sampleCount : 0;
    const worstFrameMs = sampleCount ? Math.max(...performanceSamples) : 0;
    const orderedFrameMs = performanceSamples.slice().sort((a, b) => a - b);
    const p95FrameMs = sampleCount ? orderedFrameMs[Math.max(0, Math.ceil(sampleCount * 0.95) - 1)] : 0;
    const width = Number(canvas.clientWidth || canvas.width || (typeof innerWidth === 'number' ? innerWidth : 0));
    const height = Number(canvas.clientHeight || canvas.height || (typeof innerHeight === 'number' ? innerHeight : 0));
    const snapshot = {
      version: '10.0',
      buildId: window.__LO_BUILD_ID__,
      scope: 'controlled-resident-automation',
      navigationSource: 'chassis.manifest.navigation',
      operationalDestinations: interiorViewOrder.length,
      exteriorDestinations: exteriorViewOrder.length,
      surveyDestinations: surveyViewOrder.ground.length + surveyViewOrder.upper.length,
      camera: {
        viewId: currentViewId,
        defaultDistance: view ? view.distance : 0,
        requestedDistance: orbit.distance,
        actualDistance: actualCameraDistance,
        minDistance: view ? view.minDistance : 0,
        maxDistance: view ? view.maxDistance : 0,
        fitDistance: view ? view.fitDistance || null : null,
        fov: orbit.fov,
        fitRoomUses
      },
      performance: {
        sampleCount,
        averageFrameMs: Number(averageFrameMs.toFixed(3)),
        p95FrameMs: Number(p95FrameMs.toFixed(3)),
        worstFrameMs: Number(worstFrameMs.toFixed(3)),
        estimatedFps: averageFrameMs ? Number((1000 / averageFrameMs).toFixed(1)) : 0,
        viewport: [width, height],
        devicePixelRatio: Number((typeof devicePixelRatio === 'number' ? devicePixelRatio : 1).toFixed(2)),
        autoRender: false
      },
      failure: preflightFailure,
      exteriorContentAdded: exteriorShellEntity ? 1 : 0,
      exteriorSubsystems: E9_EXTERIOR_SHELL.subsystems.length,
      exteriorGeometryParts: exteriorMetrics.partCount,
      continuousExteriorAnimation: false,
      characterChanges: 0,
      residentBehaviorChanges: 0,
      runtimeNetworkDependencies: 0,
      automation: coreState?.worldState?.systems?.intentControl ? {
        sessionState: coreState.worldState.systems.intentControl.sessionState,
        actionCount: coreState.worldState.systems.intentControl.actionCount,
        activeIntents: coreState.worldState.systems.intentControl.activeIntent ? 1 : 0,
        activeReservations: Object.keys(coreState.worldState.reservations || {}).length,
        decisionEntries: coreState.worldState.systems.intentControl.decisionLog.length
      } : null
    };
    window.__LO_EXP10_STATE__ = snapshot;
    window.__LO_EXP09_PREFLIGHT_STATE__ = snapshot;
  }

  function recordPerformanceSample(dt) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    performanceSamples.push(dt * 1000);
    if (performanceSamples.length > 180) performanceSamples.shift();
    if (performanceSamples.length === 1 || performanceSamples.length % 30 === 0) publishPreflightState();
  }

  function publishE2State(active, partCount = 0, lightRibbonCount = 0) {
    window.__LO_E2_STATE__ = {
      version: E2_FOYER_CORE.version,
      active,
      landmark: E2_FOYER_CORE.landmark,
      location: E2_FOYER_CORE.location.slice(),
      architecturalLanguage: E2_FOYER_CORE.architecturalLanguage,
      partCount,
      lightRibbonCount,
      collisionComponents: 0,
      behaviorChanges: 0
    };
  }

  function createFoyerMaterial(name, diffuse, emissive, metalness, gloss) {
    const material = new pc.StandardMaterial();
    material.name = name;
    material.diffuse = new pc.Color(diffuse[0], diffuse[1], diffuse[2]);
    material.emissive = new pc.Color(emissive[0], emissive[1], emissive[2]);
    material.emissiveIntensity = emissive.some(value => value > 0) ? 1.35 : 0;
    material.metalness = metalness;
    material.gloss = gloss;
    material.update();
    return material;
  }

  function createFoyerCore() {
    if (foyerCoreEntity) return;
    const bronze = createFoyerMaterial('E2 Warm Bronze', [0.34, 0.20, 0.11], [0.04, 0.018, 0.006], 0.78, 0.82);
    const charcoal = createFoyerMaterial('E2 Satin Charcoal', [0.045, 0.055, 0.06], [0.004, 0.006, 0.007], 0.58, 0.72);
    const ivory = createFoyerMaterial('E2 Warm Ivory', [0.72, 0.68, 0.58], [0.035, 0.026, 0.014], 0.18, 0.74);
    const aqua = createFoyerMaterial('E2 Core Aqua', [0.035, 0.26, 0.25], [0.03, 0.88, 0.76], 0.32, 0.9);
    const amber = createFoyerMaterial('E2 Guidance Amber', [0.42, 0.20, 0.045], [1.0, 0.31, 0.055], 0.3, 0.86);

    foyerCoreEntity = new pc.Entity(E2_FOYER_CORE.name);
    foyerCoreEntity.setPosition(...E2_FOYER_CORE.location);
    app.root.addChild(foyerCoreEntity);
    let partCount = 0;
    let lightRibbonCount = 0;

    function part(name, type, position, scale, material, euler) {
      const entity = new pc.Entity(name);
      entity.addComponent('render', { type });
      entity.render.material = material;
      entity.setLocalPosition(position[0], position[1], position[2]);
      entity.setLocalScale(scale[0], scale[1], scale[2]);
      if (euler) entity.setLocalEulerAngles(euler[0], euler[1], euler[2]);
      foyerCoreEntity.addChild(entity);
      partCount += 1;
      return entity;
    }

    part('Core Plinth', 'cylinder', [0, 0.05, 0], [0.56, 0.08, 0.56], charcoal);
    part('Core Foundation Ring', 'cylinder', [0, 0.14, 0], [0.45, 0.055, 0.45], bronze);
    part('Core Pedestal', 'cylinder', [0, 0.53, 0], [0.24, 0.72, 0.24], charcoal);
    part('Core Pedestal Collar', 'cylinder', [0, 0.88, 0], [0.32, 0.055, 0.32], ivory);
    part('Protected Intelligence Core', 'sphere', [0, 1.16, 0], [0.29, 0.29, 0.29], aqua);
    part('Core Halo Left', 'box', [-0.43, 1.16, 0], [0.035, 0.54, 0.035], bronze);
    part('Core Halo Right', 'box', [0.43, 1.16, 0], [0.035, 0.54, 0.035], bronze);
    part('Core Halo Crown', 'box', [0, 1.69, 0], [0.46, 0.035, 0.035], bronze);
    part('Core Halo Base', 'box', [0, 0.63, 0], [0.46, 0.035, 0.035], bronze);
    part('Core Warm Axis', 'box', [0, 1.16, -0.055], [0.022, 0.40, 0.022], amber, [0, 0, 45]);

    [
      ['Entry Light Ribbon Left', [-0.66, 0.025, -1.18], [0.027, 0.014, 1.45]],
      ['Entry Light Ribbon Right', [0.66, 0.025, -1.18], [0.027, 0.014, 1.45]],
      ['Entry Light Threshold', [0, 0.025, 0.28], [0.70, 0.014, 0.027]],
      ['Core Approach Marker', [0, 0.027, -2.62], [0.32, 0.014, 0.027]]
    ].forEach(([name, position, scale]) => {
      part(name, 'box', position, scale, amber);
      lightRibbonCount += 1;
    });

    publishE2State(true, partCount, lightRibbonCount);
    requestRender();
  }

  function removeFoyerCore() {
    if (foyerCoreEntity) {
      foyerCoreEntity.destroy();
      foyerCoreEntity = null;
    }
    publishE2State(false);
    requestRender();
  }

  function publishE3State(active, details = {}) {
    window.__LO_E3_STATE__ = {
      version: E3_CHEF_KITCHEN.version,
      active,
      zone: E3_CHEF_KITCHEN.zone,
      anchor: E3_CHEF_KITCHEN.anchor.slice(),
      architecturalLanguage: E3_CHEF_KITCHEN.architecturalLanguage,
      partCount: details.partCount || 0,
      applianceForms: details.applianceForms || 0,
      lightRibbonCount: details.lightRibbonCount || 0,
      projectionSurfaces: details.projectionSurfaces || 0,
      collisionComponents: 0,
      applianceBehaviors: 0,
      residentBehaviorChanges: 0
    };
  }

  function publishKitchenEquipmentState(active) {
    const coreConnected = Boolean(
      active && coreState && validateRuntimeState(coreState).length === 0 && window.__LO_E2_STATE__?.active
    );
    const recognized = Boolean(active && chefKitchenEntity && coreConnected);
    window.__LO_KITCHEN_EQUIPMENT_STATE__ = {
      version: E3_KITCHEN_EQUIPMENT_REGISTRY.version,
      active: recognized,
      zone: E3_KITCHEN_EQUIPMENT_REGISTRY.zone,
      controllerId: E3_KITCHEN_EQUIPMENT_REGISTRY.controllerId,
      coreConnected,
      smartHouseRegistered: recognized,
      phoneVisible: 'READ_ONLY_STATUS',
      operatingAuthority: 'OWNER_APPROVAL_REQUIRED',
      actuatorCommandsExposed: 0,
      applianceBehaviors: 0,
      projectionBehaviors: 0,
      networkDependencies: 0,
      residentBehaviorChanges: 0,
      endpoints: E3_KITCHEN_EQUIPMENT_REGISTRY.endpoints.map(endpoint => ({
        ...endpoint,
        recognition: recognized ? 'RECOGNIZED_SAFE_STANDBY' : 'UNAVAILABLE',
        actuator: 'DISABLED'
      }))
    };
  }

  function createChefKitchen() {
    if (chefKitchenEntity) return;
    const walnut = createFoyerMaterial('E3 Smoked Walnut', [0.16, 0.075, 0.035], [0.006, 0.002, 0.001], 0.16, 0.62);
    const stone = createFoyerMaterial('E3 Warm Sintered Stone', [0.66, 0.62, 0.53], [0.018, 0.014, 0.009], 0.12, 0.76);
    const graphite = createFoyerMaterial('E3 Graphite Appliance Glass', [0.025, 0.035, 0.04], [0.004, 0.007, 0.008], 0.68, 0.92);
    const bronze = createFoyerMaterial('E3 Brushed Bronze', [0.34, 0.19, 0.085], [0.018, 0.008, 0.002], 0.82, 0.84);
    const aqua = createFoyerMaterial('E3 Restrained Projection Aqua', [0.025, 0.22, 0.22], [0.02, 0.72, 0.68], 0.28, 0.9);
    const warmLight = createFoyerMaterial('E3 Warm Task Light', [0.44, 0.25, 0.08], [1.0, 0.38, 0.075], 0.24, 0.88);

    chefKitchenEntity = new pc.Entity(E3_CHEF_KITCHEN.name);
    app.root.addChild(chefKitchenEntity);
    let partCount = 0;
    let applianceForms = 0;
    let lightRibbonCount = 0;
    let projectionSurfaces = 0;

    function part(name, type, position, scale, material, euler) {
      const entity = new pc.Entity(name);
      entity.addComponent('render', { type, castShadows: false, receiveShadows: true });
      entity.render.material = material;
      entity.setLocalPosition(position[0], position[1], position[2]);
      entity.setLocalScale(scale[0], scale[1], scale[2]);
      if (euler) entity.setLocalEulerAngles(euler[0], euler[1], euler[2]);
      chefKitchenEntity.addChild(entity);
      partCount += 1;
      return entity;
    }

    // Familiar chef wall: continuous worktop, backsplash, and four cabinet bays.
    part('Chef Wall Base', 'box', [2.15, 0.70, 1.52], [3.55, 0.78, 0.58], walnut);
    part('Chef Wall Worktop', 'box', [2.15, 1.12, 1.52], [3.70, 0.075, 0.68], stone);
    part('Chef Wall Backsplash', 'box', [2.15, 1.53, 1.30], [3.70, 0.72, 0.055], stone);
    [0.68, 1.65, 2.62, 3.59].forEach((x, index) => {
      part('Upper Cabinet ' + (index + 1), 'box', [x, 2.03, 1.38], [0.86, 0.72, 0.40], index % 2 ? walnut : stone);
      part('Upper Cabinet Reveal ' + (index + 1), 'box', [x, 2.03, 1.165], [0.012, 0.58, 0.012], bronze);
    });

    // Recognizable advanced cold-storage tower.
    part('Advanced Refrigerator Body', 'box', [4.43, 1.27, 1.50], [0.78, 1.90, 0.68], graphite);
    part('Advanced Refrigerator Left Door', 'box', [4.225, 1.35, 1.145], [0.35, 1.58, 0.025], stone);
    part('Advanced Refrigerator Right Door', 'box', [4.635, 1.35, 1.145], [0.35, 1.58, 0.025], stone);
    part('Refrigerator Command Seam', 'box', [4.43, 1.35, 1.12], [0.025, 1.34, 0.018], aqua);
    applianceForms += 1;

    // Familiar double-oven tower in an advanced flush enclosure.
    part('Double Oven Tower', 'box', [-0.15, 1.28, 1.50], [0.78, 1.92, 0.68], walnut);
    part('Upper Oven Glass', 'box', [-0.15, 1.57, 1.145], [0.60, 0.48, 0.026], graphite);
    part('Lower Oven Glass', 'box', [-0.15, 0.92, 1.145], [0.60, 0.48, 0.026], graphite);
    part('Upper Oven Handle', 'box', [-0.15, 1.85, 1.10], [0.52, 0.028, 0.028], bronze);
    part('Lower Oven Handle', 'box', [-0.15, 1.20, 1.10], [0.52, 0.028, 0.028], bronze);
    applianceForms += 1;

    // Pro-style induction surface and quiet sculptural hood.
    part('Induction Cooktop', 'box', [2.52, 1.175, 1.48], [1.08, 0.025, 0.48], graphite);
    [[2.20, 1.178, 1.35], [2.82, 1.178, 1.35], [2.20, 1.178, 1.66], [2.82, 1.178, 1.66]].forEach((position, index) => {
      part('Induction Zone ' + (index + 1), 'cylinder', position, [0.18, 0.012, 0.18], aqua);
    });
    part('Sculptural Hood Canopy', 'box', [2.52, 2.20, 1.38], [1.22, 0.16, 0.52], graphite);
    part('Sculptural Hood Spine', 'box', [2.52, 2.62, 1.38], [0.24, 0.72, 0.24], bronze);
    applianceForms += 1;

    // Chef island: generous work surface, sink, faucet, and three stools.
    part('Chef Island Base', 'box', [2.08, 0.72, 3.64], [2.45, 0.78, 0.82], walnut);
    part('Chef Island Stone Top', 'box', [2.08, 1.14, 3.64], [2.70, 0.085, 1.02], stone);
    part('Island Waterfall Left', 'box', [0.76, 0.74, 3.64], [0.085, 0.80, 1.02], stone);
    part('Island Waterfall Right', 'box', [3.40, 0.74, 3.64], [0.085, 0.80, 1.02], stone);
    part('Island Sink', 'box', [1.38, 1.19, 3.63], [0.62, 0.035, 0.46], graphite);
    part('Faucet Riser', 'cylinder', [1.02, 1.45, 3.92], [0.055, 0.48, 0.055], bronze);
    part('Faucet Reach', 'box', [1.19, 1.67, 3.92], [0.32, 0.055, 0.055], bronze);
    [-0.05, 0.72, 1.49].forEach((offset, index) => {
      part('Chef Stool Seat ' + (index + 1), 'cylinder', [1.32 + offset, 0.77, 4.62], [0.32, 0.075, 0.32], stone);
      part('Chef Stool Pedestal ' + (index + 1), 'cylinder', [1.32 + offset, 0.52, 4.62], [0.055, 0.45, 0.055], bronze);
    });

    // Restrained island projection: one bounded surface, no autonomous function.
    part('Island Projection Emitter', 'cylinder', [2.86, 1.22, 3.64], [0.12, 0.035, 0.12], bronze);
    part('Island Projection Surface', 'box', [2.86, 1.55, 3.64], [0.72, 0.018, 0.42], aqua);
    part('Projection Owner Marker', 'box', [2.86, 1.60, 3.64], [0.12, 0.018, 0.12], warmLight);
    projectionSurfaces += 1;

    [
      ['Under-Cabinet Task Ribbon', [2.15, 1.61, 1.64], [3.30, 0.022, 0.022]],
      ['Wall Toe-Kick Ribbon', [2.15, 0.325, 1.82], [3.28, 0.022, 0.022]],
      ['Island Toe-Kick Ribbon', [2.08, 0.325, 3.20], [2.12, 0.022, 0.022]],
      ['Island Guest-Side Ribbon', [2.08, 0.91, 4.07], [2.22, 0.022, 0.022]],
      ['Hood Task Ribbon', [2.52, 2.10, 1.68], [0.82, 0.022, 0.022]]
    ].forEach(([name, position, scale]) => {
      part(name, 'box', position, scale, warmLight);
      lightRibbonCount += 1;
    });

    publishE3State(true, { partCount, applianceForms, lightRibbonCount, projectionSurfaces });
    publishKitchenEquipmentState(true);
    requestRender();
  }

  function removeChefKitchen() {
    if (chefKitchenEntity) {
      chefKitchenEntity.destroy();
      chefKitchenEntity = null;
    }
    publishE3State(false);
    publishKitchenEquipmentState(false);
    requestRender();
  }

  function publishE4State(active, details = {}) {
    window.__LO_E4_STATE__ = {
      version: E4_LIVING_DINING.version,
      active,
      zones: E4_LIVING_DINING.zones.slice(),
      livingAnchor: E4_LIVING_DINING.livingAnchor.slice(),
      diningAnchor: E4_LIVING_DINING.diningAnchor.slice(),
      architecturalLanguage: E4_LIVING_DINING.architecturalLanguage,
      partCount: details.partCount || 0,
      seatingPlaces: details.seatingPlaces || 0,
      tableSurfaces: details.tableSurfaces || 0,
      lightElements: details.lightElements || 0,
      registeredInteractions: details.registeredInteractions || 0,
      collisionComponents: 0,
      residentBehaviorChanges: 0
    };
  }

  function createLivingDining() {
    if (livingDiningEntity) return;
    const walnut = createFoyerMaterial('E4 Smoked Walnut', [0.13, 0.058, 0.028], [0.004, 0.0015, 0.0006], 0.20, 0.68);
    const ivory = createFoyerMaterial('E4 Soft Ivory', [0.67, 0.63, 0.55], [0.014, 0.011, 0.007], 0.10, 0.72);
    const graphite = createFoyerMaterial('E4 Satin Graphite', [0.035, 0.043, 0.048], [0.003, 0.004, 0.005], 0.62, 0.82);
    const bronze = createFoyerMaterial('E4 Brushed Bronze', [0.32, 0.17, 0.075], [0.015, 0.006, 0.002], 0.82, 0.84);
    const glass = createFoyerMaterial('E4 Smoke Glass', [0.07, 0.13, 0.14], [0.004, 0.012, 0.013], 0.48, 0.94);
    const warmLight = createFoyerMaterial('E4 Indirect Amber', [0.43, 0.23, 0.065], [1.0, 0.30, 0.045], 0.22, 0.88);
    const aqua = createFoyerMaterial('E4 Core Accent Aqua', [0.025, 0.20, 0.19], [0.018, 0.48, 0.43], 0.30, 0.88);

    livingDiningEntity = new pc.Entity(E4_LIVING_DINING.name);
    app.root.addChild(livingDiningEntity);
    let partCount = 0;
    let seatingPlaces = 0;
    let tableSurfaces = 0;
    let lightElements = 0;

    function part(name, type, position, scale, material, euler) {
      const entity = new pc.Entity(name);
      entity.addComponent('render', { type, castShadows: false, receiveShadows: true });
      entity.render.material = material;
      entity.setLocalPosition(position[0], position[1], position[2]);
      entity.setLocalScale(scale[0], scale[1], scale[2]);
      if (euler) entity.setLocalEulerAngles(euler[0], euler[1], euler[2]);
      livingDiningEntity.addChild(entity);
      partCount += 1;
      return entity;
    }

    // Living room: a low conversation field aimed toward the coastal glazing.
    part('Living Rug', 'box', [9.10, 0.335, 4.18], [4.30, 0.025, 3.15], graphite);
    part('Living Sofa Plinth', 'box', [8.55, 0.48, 5.20], [2.60, 0.20, 0.78], walnut);
    part('Living Sofa Seat', 'box', [8.55, 0.68, 5.12], [2.42, 0.22, 0.68], ivory);
    part('Living Sofa Back', 'box', [8.55, 1.05, 5.48], [2.42, 0.64, 0.18], ivory);
    part('Living Sofa Arm Left', 'box', [7.27, 0.82, 5.15], [0.18, 0.48, 0.72], walnut);
    part('Living Sofa Arm Right', 'box', [9.83, 0.82, 5.15], [0.18, 0.48, 0.72], walnut);
    seatingPlaces += 3;

    [[7.05, 3.55, 28], [11.05, 3.55, -28]].forEach(([x, z, yaw], index) => {
      const side = index + 1;
      part('Living Lounge Chair ' + side + ' Seat', 'box', [x, 0.70, z], [0.82, 0.22, 0.78], ivory, [0, yaw, 0]);
      part('Living Lounge Chair ' + side + ' Back', 'box', [x, 1.05, z + 0.31], [0.82, 0.62, 0.16], ivory, [0, yaw, 0]);
      part('Living Lounge Chair ' + side + ' Base', 'cylinder', [x, 0.47, z], [0.25, 0.28, 0.25], bronze);
      seatingPlaces += 1;
    });

    part('Living Coffee Table Base', 'cylinder', [9.10, 0.49, 3.95], [0.56, 0.27, 0.56], bronze);
    part('Living Coffee Table Surface', 'cylinder', [9.10, 0.69, 3.95], [1.18, 0.10, 1.18], glass);
    tableSurfaces += 1;
    part('Living Console Base', 'box', [9.10, 0.56, 2.45], [2.45, 0.42, 0.42], walnut);
    part('Living Console Surface', 'box', [9.10, 0.81, 2.45], [2.62, 0.065, 0.50], ivory);
    tableSurfaces += 1;
    part('Living Sculptural Vessel', 'cylinder', [8.35, 1.05, 2.45], [0.18, 0.42, 0.18], bronze);
    part('Living Core Echo', 'sphere', [9.10, 1.10, 2.45], [0.22, 0.22, 0.22], aqua);
    part('Living Sculpture Fin', 'box', [9.82, 1.10, 2.45], [0.08, 0.58, 0.30], graphite, [0, 0, 18]);

    [[6.55, 4.95], [11.65, 4.95]].forEach(([x, z], index) => {
      part('Living Floor Lamp ' + (index + 1) + ' Stem', 'cylinder', [x, 1.12, z], [0.045, 1.52, 0.045], bronze);
      part('Living Floor Lamp ' + (index + 1) + ' Halo', 'cylinder', [x, 1.86, z], [0.34, 0.035, 0.34], warmLight);
      lightElements += 1;
    });

    [
      ['Living Window Cove Light', [9.10, 2.48, 2.10], [4.10, 0.025, 0.025]],
      ['Living Back-Wash Ribbon', [8.55, 0.36, 5.58], [2.35, 0.020, 0.020]],
      ['Living Console Toe Light', [9.10, 0.34, 2.68], [2.25, 0.020, 0.020]]
    ].forEach(([name, position, scale]) => {
      part(name, 'box', position, scale, warmLight);
      lightElements += 1;
    });

    // Dining room: one generous table, six comfortable places, and restrained light.
    part('Dining Rug', 'box', [13.50, 0.335, 3.20], [4.20, 0.025, 2.85], graphite);
    part('Dining Table Plinth', 'box', [13.50, 0.57, 3.20], [1.35, 0.48, 0.58], bronze);
    part('Dining Table Spine', 'box', [13.50, 0.78, 3.20], [2.10, 0.18, 0.42], walnut);
    part('Dining Table Surface', 'box', [13.50, 0.95, 3.20], [3.20, 0.11, 1.18], ivory);
    tableSurfaces += 1;

    [
      [12.55, 2.34, 0], [13.50, 2.34, 0], [14.45, 2.34, 0],
      [12.55, 4.06, 180], [13.50, 4.06, 180], [14.45, 4.06, 180]
    ].forEach(([x, z, yaw], index) => {
      part('Dining Chair ' + (index + 1) + ' Seat', 'box', [x, 0.64, z], [0.62, 0.18, 0.62], ivory, [0, yaw, 0]);
      part('Dining Chair ' + (index + 1) + ' Back', 'box', [x, 1.00, z + (yaw ? 0.25 : -0.25)], [0.62, 0.64, 0.14], ivory, [0, yaw, 0]);
      part('Dining Chair ' + (index + 1) + ' Base', 'cylinder', [x, 0.45, z], [0.19, 0.25, 0.19], bronze);
      seatingPlaces += 1;
    });

    part('Dining Sideboard Body', 'box', [15.65, 0.66, 3.20], [0.52, 0.62, 2.20], walnut);
    part('Dining Sideboard Surface', 'box', [15.65, 1.01, 3.20], [0.62, 0.075, 2.32], ivory);
    part('Dining Sideboard Light', 'box', [15.34, 1.42, 3.20], [0.020, 0.020, 1.80], warmLight);
    tableSurfaces += 1;
    lightElements += 1;

    [12.55, 13.50, 14.45].forEach((x, index) => {
      part('Dining Pendant ' + (index + 1) + ' Drop', 'cylinder', [x, 2.12, 3.20], [0.035, 0.72, 0.035], bronze);
      part('Dining Pendant ' + (index + 1) + ' Glow', 'sphere', [x, 1.78, 3.20], [0.20, 0.16, 0.20], warmLight);
      lightElements += 1;
    });
    part('Dining Perimeter Light', 'box', [13.50, 2.48, 4.56], [3.55, 0.025, 0.025], warmLight);
    lightElements += 1;

    const interactionsBefore = interactionRegistry.size;
    registerInteractions('e4', livingDiningEntity);
    publishE4State(true, {
      partCount,
      seatingPlaces,
      tableSurfaces,
      lightElements,
      registeredInteractions: interactionRegistry.size - interactionsBefore
    });
    requestRender();
  }

  function removeLivingDining() {
    unregisterLayerInteractions('e4');
    if (livingDiningEntity) {
      livingDiningEntity.destroy();
      livingDiningEntity = null;
    }
    publishE4State(false);
    requestRender();
  }

  function publishE5State(active) {
    window.__LO_E5_STATE__ = {
      version: E5_GROUND_MEDIA.version,
      active,
      zone: E5_GROUND_MEDIA.zone,
      anchor: E5_GROUND_MEDIA.anchor.slice(),
      displayModes: E5_GROUND_MEDIA.displayModes.slice(),
      displayMode: active ? mediaMode : 'off',
      architecturalLanguage: E5_GROUND_MEDIA.architecturalLanguage,
      partCount: active ? mediaMetrics.partCount : 0,
      seatingPlaces: active ? mediaMetrics.seatingPlaces : 0,
      tableSurfaces: active ? mediaMetrics.tableSurfaces : 0,
      lightElements: active ? mediaMetrics.lightElements : 0,
      audioForms: active ? mediaMetrics.audioForms : 0,
      registeredInteractions: active ? mediaMetrics.registeredInteractions : 0,
      displaySurfaces: active ? 1 : 0,
      collisionComponents: 0,
      runtimeNetworkDependencies: 0,
      residentBehaviorChanges: 0
    };
  }

  function setMediaMode(mode, announce = true) {
    if (!mediaRoomEntity || !E5_GROUND_MEDIA.displayModes.includes(mode)) return false;
    mediaMode = mode;
    if (mediaScreenEntity?.render && mediaDisplayMaterials) {
      mediaScreenEntity.render.material = mediaDisplayMaterials[mode];
    }
    if (media.status) media.status.textContent = 'Display: ' + mode.toUpperCase();
    publishE5State(true);
    if (announce) setStatus('Media display: ' + mode.toUpperCase(), 'Local owner command · no streaming or network dependency');
    requestRender();
    return true;
  }

  function createMediaRoom() {
    if (mediaRoomEntity) return;
    const walnut = createFoyerMaterial('E5 Smoked Walnut', [0.11, 0.045, 0.022], [0.003, 0.001, 0.0005], 0.20, 0.68);
    const graphite = createFoyerMaterial('E5 Cinema Graphite', [0.018, 0.024, 0.028], [0.001, 0.002, 0.003], 0.66, 0.86);
    const ivory = createFoyerMaterial('E5 Soft Ivory Upholstery', [0.56, 0.53, 0.47], [0.010, 0.008, 0.005], 0.08, 0.64);
    const bronze = createFoyerMaterial('E5 Brushed Bronze', [0.28, 0.135, 0.055], [0.012, 0.004, 0.001], 0.84, 0.84);
    const glass = createFoyerMaterial('E5 Smoke Glass', [0.035, 0.065, 0.075], [0.003, 0.006, 0.008], 0.50, 0.94);
    const warmLight = createFoyerMaterial('E5 Indirect Amber', [0.39, 0.19, 0.045], [1.0, 0.27, 0.038], 0.22, 0.88);
    const aqua = createFoyerMaterial('E5 Ambient Aqua', [0.018, 0.16, 0.17], [0.018, 0.52, 0.49], 0.28, 0.91);
    const cinema = createFoyerMaterial('E5 Cinema Blue', [0.025, 0.055, 0.105], [0.035, 0.16, 0.48], 0.34, 0.95);

    mediaRoomEntity = new pc.Entity(E5_GROUND_MEDIA.name);
    app.root.addChild(mediaRoomEntity);
    mediaDisplayMaterials = { off: graphite, ambient: aqua, cinema };
    mediaAccentEntities = [];
    mediaMode = 'off';
    let partCount = 0;
    let seatingPlaces = 0;
    let tableSurfaces = 0;
    let lightElements = 0;
    let audioForms = 0;

    function part(name, type, position, scale, material, euler) {
      const entity = new pc.Entity(name);
      entity.addComponent('render', { type, castShadows: false, receiveShadows: true });
      entity.render.material = material;
      entity.setLocalPosition(position[0], position[1], position[2]);
      entity.setLocalScale(scale[0], scale[1], scale[2]);
      if (euler) entity.setLocalEulerAngles(euler[0], euler[1], euler[2]);
      mediaRoomEntity.addChild(entity);
      partCount += 1;
      return entity;
    }

    // Cinema wall: one familiar display, local console, and recognizable audio forms.
    part('Media Acoustic Rug', 'box', [1.28, 0.335, 12.30], [4.35, 0.025, 4.05], graphite);
    part('Media Display Wall Backer', 'box', [-0.38, 1.52, 12.30], [0.10, 2.35, 4.75], walnut);
    part('Media Display Frame Top', 'box', [-0.18, 2.55, 12.30], [0.10, 0.075, 3.55], bronze);
    part('Media Display Frame Bottom', 'box', [-0.18, 0.66, 12.30], [0.10, 0.075, 3.55], bronze);
    part('Media Display Frame Left', 'box', [-0.18, 1.60, 10.56], [0.10, 1.82, 0.075], bronze);
    part('Media Display Frame Right', 'box', [-0.18, 1.60, 14.04], [0.10, 1.82, 0.075], bronze);
    mediaScreenEntity = part('Media Monitor Screen', 'box', [-0.12, 1.60, 12.30], [0.055, 1.72, 3.38], graphite);
    part('Media Console Body', 'box', [0.14, 0.55, 12.30], [0.46, 0.38, 2.40], walnut);
    part('Media Console Table Surface', 'box', [0.14, 0.78, 12.30], [0.54, 0.065, 2.54], glass);
    part('Media Control Shelf', 'box', [0.39, 0.57, 12.30], [0.025, 0.20, 1.85], bronze);
    mediaAccentEntities.push(part('Media Console Light', 'box', [0.40, 0.82, 12.30], [0.025, 0.022, 2.12], warmLight));
    tableSurfaces += 1;
    lightElements += 1;

    [[10.05, 'Left'], [14.55, 'Right']].forEach(([z, side]) => {
      part('Media ' + side + ' Speaker Cabinet', 'box', [0.02, 1.20, z], [0.42, 1.48, 0.48], graphite);
      part('Media ' + side + ' Speaker Upper Driver', 'cylinder', [0.25, 1.52, z], [0.22, 0.045, 0.22], bronze, [0, 0, 90]);
      part('Media ' + side + ' Speaker Lower Driver', 'cylinder', [0.25, 0.94, z], [0.27, 0.045, 0.27], glass, [0, 0, 90]);
      mediaAccentEntities.push(part('Media ' + side + ' Speaker Status Lamp', 'sphere', [0.27, 1.98, z], [0.07, 0.07, 0.07], aqua));
      audioForms += 1;
      lightElements += 1;
    });

    // Deep but familiar seating field with a clear sightline to the display wall.
    part('Media Sectional Sofa Plinth', 'box', [2.34, 0.47, 12.15], [2.40, 0.20, 2.70], walnut);
    part('Media Sectional Sofa Seat', 'box', [2.16, 0.68, 12.15], [2.18, 0.23, 2.48], ivory);
    part('Media Sectional Sofa Back', 'box', [2.78, 1.05, 12.15], [0.22, 0.64, 2.48], ivory);
    part('Media Sectional Sofa Arm Left', 'box', [2.20, 0.84, 10.90], [1.18, 0.46, 0.18], walnut);
    part('Media Sectional Sofa Arm Right', 'box', [2.20, 0.84, 13.40], [1.18, 0.46, 0.18], walnut);
    seatingPlaces += 3;
    part('Media Chaise Plinth', 'box', [1.55, 0.47, 14.22], [1.55, 0.20, 0.72], walnut);
    part('Media Chaise Seat', 'box', [1.55, 0.68, 14.22], [1.45, 0.23, 0.64], ivory);
    part('Media Chaise Back', 'box', [2.26, 1.02, 14.22], [0.18, 0.58, 0.64], ivory);
    seatingPlaces += 1;
    part('Media Ottoman Seat', 'cylinder', [1.38, 0.62, 10.82], [0.52, 0.18, 0.52], ivory);
    part('Media Ottoman Base', 'cylinder', [1.38, 0.44, 10.82], [0.33, 0.20, 0.33], bronze);
    seatingPlaces += 1;
    part('Media Coffee Table Base', 'cylinder', [1.12, 0.48, 12.30], [0.46, 0.25, 0.46], bronze);
    part('Media Coffee Table Surface', 'cylinder', [1.12, 0.67, 12.30], [0.92, 0.085, 0.92], glass);
    part('Media Remote Dock', 'box', [1.12, 0.76, 12.30], [0.24, 0.055, 0.40], graphite);
    mediaAccentEntities.push(part('Media Remote Indicator', 'box', [1.12, 0.80, 12.30], [0.06, 0.018, 0.16], aqua));
    tableSurfaces += 1;

    // Low-glare acoustic rhythm and indirect light; nothing blocks resident routes.
    [[10.00, 'Left'], [14.60, 'Right']].forEach(([z, side]) => {
      mediaAccentEntities.push(part('Media ' + side + ' Wall Lamp', 'cylinder', [1.72, 1.72, z], [0.18, 0.035, 0.18], warmLight));
      lightElements += 1;
    });
    [
      ['Media Left Cove', [1.10, 2.52, 9.88], [2.85, 0.022, 0.022]],
      ['Media Right Cove', [1.10, 2.52, 14.72], [2.85, 0.022, 0.022]],
      ['Media Rear Cove', [3.72, 2.52, 12.30], [0.022, 0.022, 4.20]],
      ['Media Floor Wash', [0.05, 0.35, 12.30], [0.022, 0.022, 3.72]],
      ['Media Screen Wash', [0.02, 2.58, 12.30], [0.022, 0.022, 3.30]]
    ].forEach(([name, position, scale]) => {
      mediaAccentEntities.push(part(name, 'box', position, scale, warmLight));
      lightElements += 1;
    });
    [10.45, 11.70, 12.95, 14.20].forEach((z, index) => {
      part('Media Acoustic Wall Fin ' + (index + 1), 'box', [3.88, 1.50, z], [0.10, 1.92, 0.52], index % 2 ? walnut : graphite);
    });
    [10.55, 11.75, 12.95, 14.15].forEach((z, index) => {
      part('Media Ceiling Baffle ' + (index + 1), 'box', [1.75, 2.62, z], [3.75, 0.12, 0.34], index % 2 ? graphite : walnut);
    });
    mediaAccentEntities.push(part('Media Cinematic Ceiling Halo', 'cylinder', [1.62, 2.48, 12.30], [0.72, 0.028, 0.72], warmLight));
    lightElements += 1;

    const interactionsBefore = interactionRegistry.size;
    registerInteractions('e5', mediaRoomEntity);
    mediaMetrics = {
      partCount,
      seatingPlaces,
      tableSurfaces,
      lightElements,
      audioForms,
      registeredInteractions: interactionRegistry.size - interactionsBefore
    };
    setMediaMode('off', false);
    requestRender();
  }

  function removeMediaRoom() {
    unregisterLayerInteractions('e5');
    if (mediaRoomEntity) {
      mediaRoomEntity.destroy();
      mediaRoomEntity = null;
    }
    mediaScreenEntity = null;
    mediaDisplayMaterials = null;
    mediaAccentEntities = [];
    mediaMode = 'off';
    mediaMetrics = { partCount: 0, seatingPlaces: 0, tableSurfaces: 0, lightElements: 0, audioForms: 0, registeredInteractions: 0 };
    media.panel.hidden = true;
    if (media.status) media.status.textContent = 'Display: OFF';
    publishE5State(false);
    requestRender();
  }

  function openMediaControls() {
    if (!mediaRoomEntity || currentViewId !== E5_GROUND_MEDIA.zone || surveyMode) return;
    phone.panel.hidden = true;
    suite.panel.hidden = true;
    upper.panel.hidden = true;
    garage.panel.hidden = true;
    system.panel.hidden = true;
    kitchen.panel.hidden = true;
    media.panel.hidden = false;
    if (media.status) media.status.textContent = 'Display: ' + mediaMode.toUpperCase();
  }

  function publishE6State(active) {
    window.__LO_E6_STATE__ = {
      version: E6_PRIMARY_SUITE.version,
      active,
      zones: E6_PRIMARY_SUITE.zones.slice(),
      anchors: Object.fromEntries(Object.entries(E6_PRIMARY_SUITE.anchors).map(([key, value]) => [key, value.slice()])),
      scenes: E6_PRIMARY_SUITE.scenes.slice(),
      scene: active ? suiteScene : 'rest',
      architecturalLanguage: E6_PRIMARY_SUITE.architecturalLanguage,
      partCount: active ? suiteMetrics.partCount : 0,
      bedroomParts: active ? suiteMetrics.bedroomParts : 0,
      dressingParts: active ? suiteMetrics.dressingParts : 0,
      bathParts: active ? suiteMetrics.bathParts : 0,
      terraceParts: active ? suiteMetrics.terraceParts : 0,
      sleepPlaces: active ? suiteMetrics.sleepPlaces : 0,
      seatingPlaces: active ? suiteMetrics.seatingPlaces : 0,
      tableSurfaces: active ? suiteMetrics.tableSurfaces : 0,
      lightElements: active ? suiteMetrics.lightElements : 0,
      registeredInteractions: active ? suiteMetrics.registeredInteractions : 0,
      intelligenceCores: 1,
      collisionComponents: 0,
      runtimeNetworkDependencies: 0,
      residentBehaviorChanges: 0
    };
  }

  function setSuiteScene(scene, announce = true) {
    if (!primarySuiteEntity || !E6_PRIMARY_SUITE.scenes.includes(scene) || !suiteSceneMaterials) return false;
    suiteScene = scene;
    const palette = suiteSceneMaterials[scene];
    suiteLightEntities.forEach(entity => { if (entity?.render) entity.render.material = palette.accent; });
    if (suitePrivacyEntity?.render) suitePrivacyEntity.render.material = palette.privacy;
    if (suiteMediaEntity?.render) suiteMediaEntity.render.material = palette.media;
    if (suiteWaterEntity?.render) suiteWaterEntity.render.material = palette.water;
    if (suiteFireEntity?.render) suiteFireEntity.render.material = palette.fire;
    if (suite.status) suite.status.textContent = 'Scene: ' + scene.toUpperCase();
    publishE6State(true);
    if (announce) setStatus('Primary Suite: ' + scene.toUpperCase(), 'Local owner scene · one Intelligence Core access surface');
    requestRender();
    return true;
  }

  function createPrimarySuite() {
    if (primarySuiteEntity) return;
    const walnut = createFoyerMaterial('E6 Smoked Walnut', [0.105, 0.042, 0.020], [0.003, 0.001, 0.0005], 0.22, 0.70);
    const ivory = createFoyerMaterial('E6 Cloud Ivory', [0.66, 0.63, 0.57], [0.012, 0.010, 0.007], 0.08, 0.68);
    const graphite = createFoyerMaterial('E6 Satin Graphite', [0.025, 0.032, 0.038], [0.002, 0.003, 0.004], 0.66, 0.86);
    const stone = createFoyerMaterial('E6 Warm Spa Stone', [0.48, 0.46, 0.42], [0.010, 0.009, 0.007], 0.16, 0.76);
    const bronze = createFoyerMaterial('E6 Brushed Bronze', [0.31, 0.155, 0.060], [0.014, 0.005, 0.001], 0.84, 0.86);
    const clearGlass = createFoyerMaterial('E6 Clear Privacy Glass', [0.075, 0.14, 0.15], [0.004, 0.012, 0.013], 0.46, 0.95);
    const privacyGlass = createFoyerMaterial('E6 Private Glass', [0.025, 0.050, 0.058], [0.004, 0.008, 0.010], 0.55, 0.91);
    const nightAmber = createFoyerMaterial('E6 Rest Amber', [0.32, 0.13, 0.035], [0.82, 0.16, 0.025], 0.20, 0.88);
    const sunrise = createFoyerMaterial('E6 Sunrise Gold', [0.48, 0.21, 0.055], [1.0, 0.34, 0.055], 0.18, 0.90);
    const spaAqua = createFoyerMaterial('E6 Spa Aqua', [0.018, 0.18, 0.19], [0.018, 0.62, 0.58], 0.26, 0.92);
    const terraceAmber = createFoyerMaterial('E6 Terrace Amber', [0.38, 0.17, 0.042], [0.95, 0.24, 0.030], 0.22, 0.89);
    const waterAqua = createFoyerMaterial('E6 Water Aqua', [0.02, 0.20, 0.22], [0.025, 0.43, 0.46], 0.28, 0.96);
    const fire = createFoyerMaterial('E6 Fire Accent', [0.54, 0.12, 0.022], [1.0, 0.18, 0.018], 0.12, 0.86);
    const dimFire = createFoyerMaterial('E6 Banked Fire', [0.16, 0.045, 0.015], [0.18, 0.025, 0.006], 0.18, 0.78);

    primarySuiteEntity = new pc.Entity(E6_PRIMARY_SUITE.name);
    app.root.addChild(primarySuiteEntity);
    suiteLightEntities = [];
    suitePrivacyEntity = null;
    suiteMediaEntity = null;
    suiteWaterEntity = null;
    suiteFireEntity = null;
    suiteSceneMaterials = {
      rest: { accent: nightAmber, privacy: privacyGlass, media: graphite, water: waterAqua, fire: dimFire },
      sunrise: { accent: sunrise, privacy: clearGlass, media: sunrise, water: waterAqua, fire: dimFire },
      spa: { accent: spaAqua, privacy: privacyGlass, media: graphite, water: spaAqua, fire: nightAmber },
      terrace: { accent: terraceAmber, privacy: clearGlass, media: graphite, water: waterAqua, fire }
    };
    const zoneCounts = { bedroom: 0, dressing: 0, bath: 0, terrace: 0 };
    let partCount = 0;
    let sleepPlaces = 0;
    let seatingPlaces = 0;
    let tableSurfaces = 0;
    let lightElements = 0;

    function part(zoneName, name, type, position, scale, material, euler) {
      const entity = new pc.Entity(name);
      entity.addComponent('render', { type, castShadows: false, receiveShadows: true });
      entity.render.material = material;
      entity.setLocalPosition(position[0], position[1], position[2]);
      entity.setLocalScale(scale[0], scale[1], scale[2]);
      if (euler) entity.setLocalEulerAngles(euler[0], euler[1], euler[2]);
      primarySuiteEntity.addChild(entity);
      zoneCounts[zoneName] += 1;
      partCount += 1;
      return entity;
    }

    function light(zoneName, name, type, position, scale, material, euler) {
      const entity = part(zoneName, name, type, position, scale, material, euler);
      suiteLightEntities.push(entity);
      lightElements += 1;
      return entity;
    }

    // Primary bedroom: sleep remains unmistakably familiar inside a sculptural, calm shell.
    part('bedroom', 'Primary Bedroom Rug', 'box', [15.65, 4.985, 14.35], [3.75, 0.025, 4.20], graphite);
    part('bedroom', 'Primary Bed Floating Plinth', 'box', [15.72, 5.13, 14.55], [2.55, 0.20, 2.45], walnut);
    part('bedroom', 'Primary Bed Mattress', 'box', [15.72, 5.38, 14.45], [2.38, 0.32, 2.25], ivory);
    part('bedroom', 'Primary Bed Headboard Backer', 'box', [15.72, 5.94, 15.70], [3.25, 1.45, 0.15], walnut);
    part('bedroom', 'Primary Bed Headboard Cushion', 'box', [15.72, 5.88, 15.52], [2.35, 0.92, 0.18], ivory);
    part('bedroom', 'Primary Bed Headboard Left Wing', 'box', [14.35, 5.86, 15.58], [0.32, 1.25, 0.22], bronze, [0, -12, 0]);
    part('bedroom', 'Primary Bed Headboard Right Wing', 'box', [17.09, 5.86, 15.58], [0.32, 1.25, 0.22], bronze, [0, 12, 0]);
    part('bedroom', 'Primary Bed Pillow Left', 'box', [15.12, 5.62, 15.00], [0.86, 0.18, 0.54], ivory, [5, 0, 0]);
    part('bedroom', 'Primary Bed Pillow Right', 'box', [16.32, 5.62, 15.00], [0.86, 0.18, 0.54], ivory, [5, 0, 0]);
    sleepPlaces += 1;
    part('bedroom', 'Primary Bedroom Bench Base', 'box', [15.72, 5.14, 12.82], [1.70, 0.24, 0.54], bronze);
    part('bedroom', 'Primary Bedroom Bench Seat', 'box', [15.72, 5.34, 12.82], [1.62, 0.20, 0.62], ivory);
    seatingPlaces += 1;
    [[14.15, 'Left'], [17.29, 'Right']].forEach(([x, side]) => {
      part('bedroom', 'Primary ' + side + ' Nightstand Cabinet', 'box', [x, 5.28, 14.95], [0.62, 0.48, 0.58], walnut);
      part('bedroom', 'Primary ' + side + ' Nightstand Table Surface', 'box', [x, 5.56, 14.95], [0.70, 0.075, 0.66], stone);
      part('bedroom', 'Primary ' + side + ' Pendant Drop', 'cylinder', [x, 6.20, 14.95], [0.035, 0.78, 0.035], bronze);
      light('bedroom', 'Primary ' + side + ' Pendant Lamp', 'sphere', [x, 5.84, 14.95], [0.18, 0.16, 0.18], nightAmber);
      tableSurfaces += 1;
    });
    part('bedroom', 'Primary Concealed Media Console', 'box', [15.72, 5.30, 12.05], [2.35, 0.50, 0.34], walnut);
    suiteMediaEntity = part('bedroom', 'Primary Concealed Monitor', 'box', [15.72, 6.02, 11.86], [2.20, 1.05, 0.055], graphite);
    suitePrivacyEntity = part('bedroom', 'Primary Adaptive Privacy Glass', 'box', [17.46, 5.88, 14.05], [0.045, 1.52, 3.45], privacyGlass);
    light('bedroom', 'Primary Headboard Cove Light', 'box', [15.72, 6.62, 15.66], [3.05, 0.025, 0.025], nightAmber);
    light('bedroom', 'Primary Bed Toe Light', 'box', [15.72, 5.02, 13.35], [2.20, 0.020, 0.020], nightAmber);
    light('bedroom', 'Primary Bedroom Ceiling Halo', 'cylinder', [15.72, 6.52, 14.20], [0.78, 0.028, 0.78], nightAmber);
    part('bedroom', 'Primary Core Access Orb', 'sphere', [14.15, 5.74, 14.95], [0.09, 0.09, 0.09], spaAqua);

    // Dressing gallery: recognizable wardrobe, mirror, bench, and storage with no competing screen.
    part('dressing', 'Primary Dressing Runner', 'box', [16.0, 4.985, 11.05], [2.75, 0.025, 2.05], graphite);
    [['Left', 14.74], ['Right', 17.26]].forEach(([side, x]) => {
      part('dressing', 'Primary Dressing ' + side + ' Wardrobe Cabinet', 'box', [x, 5.75, 11.05], [0.58, 1.52, 1.82], walnut);
      part('dressing', 'Primary Dressing ' + side + ' Wardrobe Door', 'box', [x + (side === 'Left' ? 0.30 : -0.30), 5.75, 11.05], [0.035, 1.38, 1.62], clearGlass);
      [-0.54, 0, 0.54].forEach((offset, index) => {
        part('dressing', 'Primary Dressing ' + side + ' Shelf ' + (index + 1), 'box', [x + (side === 'Left' ? 0.32 : -0.32), 5.24 + index * 0.42, 11.05 + offset], [0.08, 0.035, 0.46], bronze);
      });
    });
    part('dressing', 'Primary Dressing Bench Plinth', 'box', [16.0, 5.13, 11.05], [1.05, 0.20, 0.48], bronze);
    part('dressing', 'Primary Dressing Bench Seat', 'box', [16.0, 5.34, 11.05], [0.98, 0.20, 0.56], ivory);
    seatingPlaces += 1;
    part('dressing', 'Primary Dressing Mirror Frame', 'box', [16.0, 5.83, 9.98], [1.05, 1.55, 0.08], bronze);
    part('dressing', 'Primary Dressing Intelligent Mirror', 'box', [16.0, 5.83, 9.88], [0.88, 1.34, 0.035], clearGlass);
    light('dressing', 'Primary Dressing Left Toe Light', 'box', [14.98, 5.02, 11.05], [0.025, 0.020, 1.55], nightAmber);
    light('dressing', 'Primary Dressing Right Toe Light', 'box', [17.02, 5.02, 11.05], [0.025, 0.020, 1.55], nightAmber);
    light('dressing', 'Primary Dressing Guide Light', 'box', [16.0, 6.58, 11.05], [1.68, 0.022, 0.022], nightAmber);

    // Primary bath: spa forms remain legible and controls remain owner-commanded and local.
    part('bath', 'Primary Bath Heated Platform', 'box', [12.45, 5.00, 8.05], [3.85, 0.055, 3.25], stone);
    part('bath', 'Primary Bath Tub Plinth', 'cylinder', [11.25, 5.17, 8.55], [1.08, 0.20, 1.08], bronze);
    part('bath', 'Primary Bath Freestanding Tub', 'cylinder', [11.25, 5.49, 8.55], [1.28, 0.46, 1.28], ivory);
    part('bath', 'Primary Bath Tub Basin', 'cylinder', [11.25, 5.66, 8.55], [0.96, 0.32, 0.96], graphite);
    part('bath', 'Primary Bath Floating Vanity Cabinet', 'box', [13.45, 5.36, 7.05], [2.15, 0.58, 0.58], walnut);
    part('bath', 'Primary Bath Vanity Table Surface', 'box', [13.45, 5.70, 7.05], [2.32, 0.075, 0.68], stone);
    tableSurfaces += 1;
    part('bath', 'Primary Bath Left Basin', 'cylinder', [12.78, 5.79, 7.05], [0.38, 0.10, 0.30], ivory);
    part('bath', 'Primary Bath Right Basin', 'cylinder', [14.12, 5.79, 7.05], [0.38, 0.10, 0.30], ivory);
    part('bath', 'Primary Bath Mirror Frame', 'box', [13.45, 6.13, 6.72], [2.38, 1.25, 0.075], bronze);
    part('bath', 'Primary Bath Intelligent Mirror', 'box', [13.45, 6.13, 6.63], [2.15, 1.05, 0.035], clearGlass);
    light('bath', 'Primary Bath Left Mirror Lamp', 'box', [12.20, 6.13, 6.68], [0.025, 1.00, 0.025], nightAmber);
    light('bath', 'Primary Bath Right Mirror Lamp', 'box', [14.70, 6.13, 6.68], [0.025, 1.00, 0.025], nightAmber);
    part('bath', 'Primary Bath Shower Floor', 'box', [13.55, 5.06, 9.15], [1.55, 0.11, 1.35], graphite);
    part('bath', 'Primary Bath Shower Glass Left', 'box', [12.82, 5.83, 9.15], [0.035, 1.48, 1.35], clearGlass);
    part('bath', 'Primary Bath Shower Glass Right', 'box', [14.28, 5.83, 9.15], [0.035, 1.48, 1.35], clearGlass);
    part('bath', 'Primary Bath Rainfall Ceiling', 'box', [13.55, 6.55, 9.15], [0.72, 0.055, 0.72], bronze);
    suiteWaterEntity = part('bath', 'Primary Bath Rainfall Water', 'cylinder', [13.55, 6.02, 9.15], [0.44, 0.82, 0.44], waterAqua);
    light('bath', 'Primary Bath Heated Toe Light', 'box', [13.45, 5.04, 7.36], [1.95, 0.020, 0.020], nightAmber);
    light('bath', 'Primary Bath Tub Cove Light', 'cylinder', [11.25, 5.72, 8.55], [1.12, 0.020, 1.12], nightAmber);
    part('bath', 'Primary Bath Towel Cabinet', 'box', [10.82, 5.70, 7.05], [0.62, 1.35, 0.52], walnut);
    part('bath', 'Primary Bath Plant Stem', 'cylinder', [10.72, 5.58, 9.25], [0.09, 0.90, 0.09], bronze);
    part('bath', 'Primary Bath Plant Crown', 'sphere', [10.72, 6.08, 9.25], [0.46, 0.58, 0.46], spaAqua);

    // Private terrace: coastal lounge, dining, living water, and banked fire remain restrained.
    part('terrace', 'Primary Terrace Deck Inset', 'box', [14.75, 4.95, 20.20], [5.85, 0.055, 4.05], walnut);
    part('terrace', 'Primary Terrace Daybed Base', 'box', [12.25, 5.12, 20.45], [1.78, 0.24, 2.10], bronze);
    part('terrace', 'Primary Terrace Daybed Mattress', 'box', [12.25, 5.34, 20.45], [1.65, 0.22, 1.95], ivory);
    part('terrace', 'Primary Terrace Daybed Headrest', 'box', [12.25, 5.64, 21.35], [1.65, 0.48, 0.18], ivory);
    seatingPlaces += 1;
    [[14.45, 19.45, -22], [14.45, 20.95, 202]].forEach(([x, z, yaw], index) => {
      part('terrace', 'Primary Terrace Lounge Chair ' + (index + 1) + ' Seat', 'box', [x, 5.34, z], [0.74, 0.20, 0.76], ivory, [0, yaw, 0]);
      part('terrace', 'Primary Terrace Lounge Chair ' + (index + 1) + ' Back', 'box', [x, 5.66, z + (index ? -0.28 : 0.28)], [0.74, 0.58, 0.15], ivory, [0, yaw, 0]);
      seatingPlaces += 1;
    });
    part('terrace', 'Primary Terrace Low Table Base', 'cylinder', [13.55, 5.18, 20.20], [0.34, 0.24, 0.34], bronze);
    part('terrace', 'Primary Terrace Low Table Surface', 'cylinder', [13.55, 5.38, 20.20], [0.78, 0.075, 0.78], clearGlass);
    tableSurfaces += 1;
    part('terrace', 'Primary Terrace Dining Table Base', 'box', [16.05, 5.30, 20.20], [0.58, 0.55, 0.46], bronze);
    part('terrace', 'Primary Terrace Dining Table Surface', 'box', [16.05, 5.64, 20.20], [1.75, 0.09, 1.10], stone);
    tableSurfaces += 1;
    [[15.55, 19.42, 0], [16.55, 19.42, 0], [15.55, 20.98, 180], [16.55, 20.98, 180]].forEach(([x, z, yaw], index) => {
      part('terrace', 'Primary Terrace Dining Chair ' + (index + 1) + ' Seat', 'box', [x, 5.30, z], [0.54, 0.17, 0.54], ivory, [0, yaw, 0]);
      part('terrace', 'Primary Terrace Dining Chair ' + (index + 1) + ' Back', 'box', [x, 5.59, z + (yaw ? 0.22 : -0.22)], [0.54, 0.52, 0.13], ivory, [0, yaw, 0]);
      seatingPlaces += 1;
    });
    [[11.75, 18.65, 'Left'], [17.30, 21.75, 'Right']].forEach(([x, z, side]) => {
      part('terrace', 'Primary Terrace ' + side + ' Planter', 'cylinder', [x, 5.30, z], [0.42, 0.46, 0.42], graphite);
      part('terrace', 'Primary Terrace ' + side + ' Plant', 'sphere', [x, 5.75, z], [0.58, 0.72, 0.58], spaAqua);
    });
    part('terrace', 'Primary Terrace Water Basin', 'box', [12.10, 5.16, 18.72], [1.25, 0.22, 0.60], stone);
    part('terrace', 'Primary Terrace Water Feature', 'box', [12.10, 5.31, 18.72], [1.08, 0.035, 0.46], waterAqua);
    part('terrace', 'Primary Terrace Fire Plinth', 'cylinder', [17.15, 5.20, 18.75], [0.54, 0.25, 0.54], graphite);
    suiteFireEntity = part('terrace', 'Primary Terrace Fire Accent', 'sphere', [17.15, 5.49, 18.75], [0.30, 0.34, 0.30], dimFire);
    [[11.82, 18.36, 2.40, 0.022], [17.42, 18.36, 2.40, 0.022], [11.82, 22.05, 2.40, 0.022], [17.42, 22.05, 2.40, 0.022]].forEach(([x, z, sx, sz], index) => {
      light('terrace', 'Primary Terrace Edge Lamp ' + (index + 1), 'box', [x, 5.02, z], [sx, 0.020, sz], nightAmber);
    });

    const interactionsBefore = interactionRegistry.size;
    registerInteractions('e6', primarySuiteEntity);
    suiteMetrics = {
      partCount,
      bedroomParts: zoneCounts.bedroom,
      dressingParts: zoneCounts.dressing,
      bathParts: zoneCounts.bath,
      terraceParts: zoneCounts.terrace,
      sleepPlaces,
      seatingPlaces,
      tableSurfaces,
      lightElements,
      registeredInteractions: interactionRegistry.size - interactionsBefore
    };
    setSuiteScene('rest', false);
    requestRender();
  }

  function removePrimarySuite() {
    unregisterLayerInteractions('e6');
    if (primarySuiteEntity) {
      primarySuiteEntity.destroy();
      primarySuiteEntity = null;
    }
    suiteScene = 'rest';
    suiteSceneMaterials = null;
    suiteLightEntities = [];
    suitePrivacyEntity = null;
    suiteMediaEntity = null;
    suiteWaterEntity = null;
    suiteFireEntity = null;
    suiteMetrics = { partCount: 0, bedroomParts: 0, dressingParts: 0, bathParts: 0, terraceParts: 0, sleepPlaces: 0, seatingPlaces: 0, tableSurfaces: 0, lightElements: 0, registeredInteractions: 0 };
    suite.panel.hidden = true;
    if (suite.status) suite.status.textContent = 'Scene: REST';
    publishE6State(false);
    requestRender();
  }

  function openSuiteControls() {
    if (!primarySuiteEntity || !E6_PRIMARY_SUITE.zones.includes(currentViewId) || surveyMode) return;
    phone.panel.hidden = true;
    media.panel.hidden = true;
    upper.panel.hidden = true;
    garage.panel.hidden = true;
    system.panel.hidden = true;
    kitchen.panel.hidden = true;
    suite.panel.hidden = false;
    if (suite.status) suite.status.textContent = 'Scene: ' + suiteScene.toUpperCase();
  }

  function publishE7State(active) {
    window.__LO_E7_STATE__ = {
      version: E7_UPPER_WING.version,
      active,
      zones: E7_UPPER_WING.zones.slice(),
      anchors: Object.fromEntries(Object.entries(E7_UPPER_WING.anchors).map(([key, value]) => [key, value.slice()])),
      modes: E7_UPPER_WING.modes.slice(),
      mode: active ? upperMode : 'read',
      routeOrder: interiorViewOrder.slice(),
      restoredStartAware: true,
      architecturalLanguage: E7_UPPER_WING.architecturalLanguage,
      partCount: active ? upperMetrics.partCount : 0,
      loungeParts: active ? upperMetrics.loungeParts : 0,
      studyParts: active ? upperMetrics.studyParts : 0,
      guestParts: active ? upperMetrics.guestParts : 0,
      bathParts: active ? upperMetrics.bathParts : 0,
      sleepPlaces: active ? upperMetrics.sleepPlaces : 0,
      seatingPlaces: active ? upperMetrics.seatingPlaces : 0,
      tableSurfaces: active ? upperMetrics.tableSurfaces : 0,
      lightElements: active ? upperMetrics.lightElements : 0,
      registeredInteractions: active ? upperMetrics.registeredInteractions : 0,
      intelligenceCores: 1,
      collisionComponents: 0,
      runtimeNetworkDependencies: 0,
      residentBehaviorChanges: 0,
      guestResidentsAdded: 0
    };
  }

  function setUpperMode(mode, announce = true) {
    if (!upperWingEntity || !E7_UPPER_WING.modes.includes(mode) || !upperModeMaterials) return false;
    upperMode = mode;
    const palette = upperModeMaterials[mode];
    upperLightEntities.forEach(entity => { if (entity?.render) entity.render.material = palette.accent; });
    if (upperDisplayEntity?.render) upperDisplayEntity.render.material = palette.display;
    if (upperPrivacyEntity?.render) upperPrivacyEntity.render.material = palette.privacy;
    if (upperMirrorEntity?.render) upperMirrorEntity.render.material = palette.mirror;
    if (upper.status) upper.status.textContent = 'Mode: ' + mode.toUpperCase();
    publishE7State(true);
    if (announce) setStatus('Upper Wing: ' + mode.toUpperCase(), 'Local owner mode · one Intelligence Core access surface');
    requestRender();
    return true;
  }

  function createUpperWing() {
    if (upperWingEntity) return;
    const walnut = createFoyerMaterial('E7 Smoked Walnut', [0.095, 0.040, 0.020], [0.003, 0.001, 0.0005], 0.24, 0.72);
    const ivory = createFoyerMaterial('E7 Cloud Ivory', [0.67, 0.64, 0.58], [0.012, 0.010, 0.007], 0.08, 0.70);
    const graphite = createFoyerMaterial('E7 Satin Graphite', [0.024, 0.032, 0.040], [0.002, 0.003, 0.004], 0.66, 0.86);
    const stone = createFoyerMaterial('E7 Warm Mineral Stone', [0.49, 0.47, 0.43], [0.010, 0.009, 0.007], 0.16, 0.77);
    const bronze = createFoyerMaterial('E7 Brushed Bronze', [0.32, 0.16, 0.062], [0.014, 0.005, 0.001], 0.84, 0.87);
    const clearGlass = createFoyerMaterial('E7 Clear Glass', [0.070, 0.135, 0.150], [0.004, 0.012, 0.014], 0.48, 0.95);
    const privateGlass = createFoyerMaterial('E7 Private Glass', [0.022, 0.047, 0.057], [0.004, 0.008, 0.011], 0.56, 0.91);
    const focusBlue = createFoyerMaterial('E7 Focus Blue', [0.028, 0.135, 0.23], [0.035, 0.36, 0.90], 0.25, 0.91);
    const readAmber = createFoyerMaterial('E7 Reading Amber', [0.36, 0.15, 0.038], [0.92, 0.22, 0.028], 0.18, 0.89);
    const guestGold = createFoyerMaterial('E7 Guest Gold', [0.47, 0.23, 0.060], [1.0, 0.38, 0.060], 0.20, 0.90);
    const nightAqua = createFoyerMaterial('E7 Night Aqua', [0.015, 0.14, 0.17], [0.012, 0.42, 0.52], 0.28, 0.92);

    upperWingEntity = new pc.Entity(E7_UPPER_WING.name);
    app.root.addChild(upperWingEntity);
    upperLightEntities = [];
    upperDisplayEntity = null;
    upperPrivacyEntity = null;
    upperMirrorEntity = null;
    upperModeMaterials = {
      focus: { accent: focusBlue, display: focusBlue, privacy: clearGlass, mirror: clearGlass },
      read: { accent: readAmber, display: graphite, privacy: clearGlass, mirror: clearGlass },
      guest: { accent: guestGold, display: guestGold, privacy: privateGlass, mirror: clearGlass },
      night: { accent: nightAqua, display: graphite, privacy: privateGlass, mirror: privateGlass }
    };
    const zoneCounts = { lounge: 0, study: 0, guest: 0, bath: 0 };
    let partCount = 0;
    let sleepPlaces = 0;
    let seatingPlaces = 0;
    let tableSurfaces = 0;
    let lightElements = 0;

    function part(zoneName, name, type, position, scale, material, euler) {
      const entity = new pc.Entity(name);
      entity.addComponent('render', { type, castShadows: false, receiveShadows: true });
      entity.render.material = material;
      entity.setLocalPosition(position[0], position[1], position[2]);
      entity.setLocalScale(scale[0], scale[1], scale[2]);
      if (euler) entity.setLocalEulerAngles(euler[0], euler[1], euler[2]);
      upperWingEntity.addChild(entity);
      zoneCounts[zoneName] += 1;
      partCount += 1;
      return entity;
    }

    function light(zoneName, name, type, position, scale, material, euler) {
      const entity = part(zoneName, name, type, position, scale, material, euler);
      upperLightEntities.push(entity);
      lightElements += 1;
      return entity;
    }

    // Observatory lounge: quiet conversation, reading, display, and storage remain familiar.
    part('lounge', 'Upper Lounge Rug', 'box', [0.35, 4.985, 12.80], [4.20, 0.025, 4.10], graphite);
    part('lounge', 'Upper Lounge Sofa Platform', 'box', [-0.15, 5.14, 13.70], [2.55, 0.20, 1.10], bronze);
    part('lounge', 'Upper Lounge Sofa Seat', 'box', [-0.15, 5.36, 13.70], [2.42, 0.24, 1.02], ivory);
    part('lounge', 'Upper Lounge Sofa Back', 'box', [-0.15, 5.75, 14.12], [2.42, 0.68, 0.18], ivory);
    part('lounge', 'Upper Lounge Sofa Left Arm', 'box', [-1.36, 5.56, 13.70], [0.18, 0.48, 1.02], walnut);
    part('lounge', 'Upper Lounge Sofa Right Arm', 'box', [1.06, 5.56, 13.70], [0.18, 0.48, 1.02], walnut);
    seatingPlaces += 3;
    [[-0.75, 11.65, -28], [1.15, 11.65, 28]].forEach(([x, z, yaw], index) => {
      part('lounge', 'Upper Lounge Reading Chair ' + (index + 1) + ' Seat', 'box', [x, 5.36, z], [0.72, 0.20, 0.76], ivory, [0, yaw, 0]);
      part('lounge', 'Upper Lounge Reading Chair ' + (index + 1) + ' Back', 'box', [x, 5.70, z + 0.28], [0.72, 0.62, 0.16], ivory, [0, yaw, 0]);
      seatingPlaces += 1;
    });
    part('lounge', 'Upper Lounge Coffee Table Base', 'cylinder', [0.20, 5.18, 12.75], [0.42, 0.24, 0.42], bronze);
    part('lounge', 'Upper Lounge Coffee Table Surface', 'cylinder', [0.20, 5.39, 12.75], [0.92, 0.075, 0.92], clearGlass);
    tableSurfaces += 1;
    part('lounge', 'Upper Lounge Side Table Base', 'cylinder', [1.65, 5.20, 13.55], [0.28, 0.30, 0.28], bronze);
    part('lounge', 'Upper Lounge Side Table Surface', 'cylinder', [1.65, 5.48, 13.55], [0.48, 0.065, 0.48], stone);
    tableSurfaces += 1;
    part('lounge', 'Upper Lounge Display Wall', 'box', [2.15, 5.83, 12.30], [0.12, 1.66, 2.75], walnut);
    upperDisplayEntity = part('lounge', 'Upper Lounge Monitor', 'box', [2.00, 5.92, 12.30], [0.055, 1.02, 1.85], graphite);
    part('lounge', 'Upper Lounge Shelf Left', 'box', [-1.72, 5.80, 12.55], [0.10, 1.62, 1.72], bronze);
    part('lounge', 'Upper Lounge Shelf Right', 'box', [-1.42, 5.80, 12.55], [0.10, 1.62, 1.72], bronze);
    part('lounge', 'Upper Lounge Shelf Top', 'box', [-1.57, 6.58, 12.55], [0.38, 0.075, 1.72], bronze);
    part('lounge', 'Upper Lounge Shelf Bottom', 'box', [-1.57, 5.04, 12.55], [0.38, 0.075, 1.72], bronze);
    [11.55, 12.55, 13.55].forEach((z, index) => part('lounge', 'Upper Lounge Bookshelf ' + (index + 1), 'box', [-1.55, 5.68, z], [0.30, 0.055, 0.78], walnut));
    light('lounge', 'Upper Lounge Left Reading Lamp', 'sphere', [-0.75, 6.25, 11.40], [0.17, 0.17, 0.17], readAmber);
    light('lounge', 'Upper Lounge Right Reading Lamp', 'sphere', [1.15, 6.25, 11.40], [0.17, 0.17, 0.17], readAmber);
    light('lounge', 'Upper Lounge Cove Light', 'box', [0.20, 6.58, 14.32], [2.75, 0.022, 0.022], readAmber);
    part('lounge', 'Upper Core Access Orb', 'sphere', [1.65, 5.62, 13.55], [0.09, 0.09, 0.09], nightAqua);

    // Study: dedicated desk, storage, focused task light, and creative display.
    part('study', 'Upper Study Rug', 'box', [5.20, 4.985, 2.85], [3.60, 0.025, 3.30], graphite);
    part('study', 'Upper Study Desk Base', 'box', [5.20, 5.35, 2.15], [1.65, 0.62, 0.56], walnut);
    part('study', 'Upper Study Desk Table Surface', 'box', [5.20, 5.72, 2.15], [2.10, 0.075, 0.78], stone);
    tableSurfaces += 1;
    part('study', 'Upper Study Chair Seat', 'box', [5.20, 5.35, 3.25], [0.62, 0.18, 0.62], ivory);
    part('study', 'Upper Study Chair Back', 'box', [5.20, 5.70, 3.53], [0.62, 0.62, 0.15], ivory);
    seatingPlaces += 1;
    part('study', 'Upper Study Shelf Backer', 'box', [3.45, 5.80, 2.85], [0.12, 1.60, 2.55], walnut);
    [2.00, 2.85, 3.70].forEach((z, index) => part('study', 'Upper Study Bookshelf ' + (index + 1), 'box', [3.62, 5.30 + index * 0.48, z], [0.55, 0.055, 0.70], bronze));
    part('study', 'Upper Study Storage Cabinet Left', 'box', [6.75, 5.45, 2.05], [0.72, 0.82, 0.62], walnut);
    part('study', 'Upper Study Storage Cabinet Right', 'box', [6.75, 5.45, 3.55], [0.72, 0.82, 0.62], walnut);
    part('study', 'Upper Study Holographic Monitor', 'box', [5.20, 6.08, 1.83], [1.35, 0.82, 0.035], clearGlass);
    light('study', 'Upper Study Task Lamp', 'sphere', [6.10, 6.12, 2.18], [0.16, 0.16, 0.16], readAmber);
    light('study', 'Upper Study Cove Light', 'box', [5.20, 6.58, 4.20], [2.45, 0.022, 0.022], readAmber);
    [4.12, 4.86, 5.60, 6.34].forEach((x, index) => part('study', 'Upper Study Acoustic Wall Panel ' + (index + 1), 'box', [x, 5.92, 4.45], [0.58, 1.05, 0.075], index % 2 ? walnut : graphite));

    // Guest suite: complete and welcoming, but no second resident is introduced.
    part('guest', 'Guest Suite Rug', 'box', [14.20, 4.985, 3.10], [3.65, 0.025, 3.80], graphite);
    part('guest', 'Guest Bed Floating Plinth', 'box', [14.20, 5.14, 3.45], [2.25, 0.20, 2.25], walnut);
    part('guest', 'Guest Bed Mattress', 'box', [14.20, 5.39, 3.38], [2.10, 0.32, 2.08], ivory);
    part('guest', 'Guest Bed Headboard', 'box', [14.20, 5.95, 4.55], [2.70, 1.35, 0.16], walnut);
    part('guest', 'Guest Bed Pillow Left', 'box', [13.68, 5.62, 3.95], [0.76, 0.18, 0.50], ivory, [5, 0, 0]);
    part('guest', 'Guest Bed Pillow Right', 'box', [14.72, 5.62, 3.95], [0.76, 0.18, 0.50], ivory, [5, 0, 0]);
    sleepPlaces += 1;
    part('guest', 'Guest Suite Bench Base', 'box', [14.20, 5.14, 1.82], [1.55, 0.22, 0.50], bronze);
    part('guest', 'Guest Suite Bench Seat', 'box', [14.20, 5.34, 1.82], [1.48, 0.19, 0.58], ivory);
    seatingPlaces += 1;
    [[12.82, 'Left'], [15.58, 'Right']].forEach(([x, side]) => {
      part('guest', 'Guest ' + side + ' Nightstand Cabinet', 'box', [x, 5.30, 3.95], [0.58, 0.48, 0.55], walnut);
      part('guest', 'Guest ' + side + ' Nightstand Table Surface', 'box', [x, 5.58, 3.95], [0.66, 0.070, 0.63], stone);
      part('guest', 'Guest ' + side + ' Pendant Drop', 'cylinder', [x, 6.22, 3.95], [0.035, 0.76, 0.035], bronze);
      light('guest', 'Guest ' + side + ' Pendant Lamp', 'sphere', [x, 5.88, 3.95], [0.17, 0.16, 0.17], readAmber);
      tableSurfaces += 1;
    });
    part('guest', 'Guest Wardrobe Cabinet', 'box', [16.20, 5.78, 2.55], [0.64, 1.55, 1.65], walnut);
    part('guest', 'Guest Wardrobe Door', 'box', [15.86, 5.78, 2.55], [0.035, 1.40, 1.48], clearGlass);
    part('guest', 'Guest Mirror Frame', 'box', [12.20, 5.88, 2.55], [0.10, 1.35, 0.92], bronze);
    part('guest', 'Guest Intelligent Mirror', 'box', [12.08, 5.88, 2.55], [0.035, 1.18, 0.76], clearGlass);
    upperPrivacyEntity = part('guest', 'Guest Adaptive Privacy Glass', 'box', [14.20, 5.90, 1.12], [2.75, 1.48, 0.040], clearGlass);
    light('guest', 'Guest Headboard Cove Light', 'box', [14.20, 6.58, 4.50], [2.48, 0.022, 0.022], readAmber);

    // Shared bath: familiar fixtures and privacy, completed from the confirmed upper bath zone.
    part('bath', 'Upper Shared Bath Heated Platform', 'box', [6.80, 5.00, 6.20], [3.30, 0.055, 3.00], stone);
    part('bath', 'Upper Shared Bath Vanity Cabinet', 'box', [6.15, 5.38, 5.25], [1.55, 0.62, 0.58], walnut);
    part('bath', 'Upper Shared Bath Vanity Table Surface', 'box', [6.15, 5.74, 5.25], [1.72, 0.075, 0.68], stone);
    tableSurfaces += 1;
    part('bath', 'Upper Shared Bath Basin', 'cylinder', [6.15, 5.83, 5.25], [0.42, 0.10, 0.32], ivory);
    part('bath', 'Upper Shared Bath Mirror Frame', 'box', [6.15, 6.12, 4.92], [1.72, 1.18, 0.075], bronze);
    upperMirrorEntity = part('bath', 'Upper Shared Bath Intelligent Mirror', 'box', [6.15, 6.12, 4.83], [1.50, 0.98, 0.035], clearGlass);
    light('bath', 'Upper Shared Bath Left Mirror Lamp', 'box', [5.20, 6.12, 4.88], [0.025, 0.94, 0.025], readAmber);
    light('bath', 'Upper Shared Bath Right Mirror Lamp', 'box', [7.10, 6.12, 4.88], [0.025, 0.94, 0.025], readAmber);
    part('bath', 'Upper Shared Bath Shower Floor', 'box', [7.72, 5.07, 6.70], [1.28, 0.12, 1.35], graphite);
    part('bath', 'Upper Shared Bath Shower Glass Left', 'box', [7.12, 5.82, 6.70], [0.035, 1.46, 1.35], clearGlass);
    part('bath', 'Upper Shared Bath Shower Glass Right', 'box', [8.32, 5.82, 6.70], [0.035, 1.46, 1.35], clearGlass);
    part('bath', 'Upper Shared Bath Rainfall Ceiling', 'box', [7.72, 6.54, 6.70], [0.62, 0.055, 0.62], bronze);
    part('bath', 'Upper Shared Bath Rainfall Water', 'cylinder', [7.72, 6.02, 6.70], [0.36, 0.80, 0.36], nightAqua);
    part('bath', 'Upper Shared Bath Storage Cabinet', 'box', [5.15, 5.72, 6.75], [0.58, 1.35, 0.52], walnut);
    part('bath', 'Upper Shared Bath Towel Shelf', 'box', [5.15, 5.65, 7.38], [0.58, 0.08, 0.72], bronze);
    light('bath', 'Upper Shared Bath Guide Light', 'box', [6.80, 5.04, 7.62], [2.65, 0.020, 0.020], readAmber);
    part('bath', 'Upper Shared Bath Plant Stem', 'cylinder', [5.20, 5.58, 5.62], [0.08, 0.82, 0.08], bronze);
    part('bath', 'Upper Shared Bath Plant Crown', 'sphere', [5.20, 6.05, 5.62], [0.42, 0.54, 0.42], nightAqua);

    const interactionsBefore = interactionRegistry.size;
    registerInteractions('e7', upperWingEntity);
    upperMetrics = {
      partCount,
      loungeParts: zoneCounts.lounge,
      studyParts: zoneCounts.study,
      guestParts: zoneCounts.guest,
      bathParts: zoneCounts.bath,
      sleepPlaces,
      seatingPlaces,
      tableSurfaces,
      lightElements,
      registeredInteractions: interactionRegistry.size - interactionsBefore
    };
    setUpperMode('read', false);
    requestRender();
  }

  function removeUpperWing() {
    unregisterLayerInteractions('e7');
    if (upperWingEntity) {
      upperWingEntity.destroy();
      upperWingEntity = null;
    }
    upperMode = 'read';
    upperModeMaterials = null;
    upperLightEntities = [];
    upperDisplayEntity = null;
    upperPrivacyEntity = null;
    upperMirrorEntity = null;
    upperMetrics = { partCount: 0, loungeParts: 0, studyParts: 0, guestParts: 0, bathParts: 0, sleepPlaces: 0, seatingPlaces: 0, tableSurfaces: 0, lightElements: 0, registeredInteractions: 0 };
    upper.panel.hidden = true;
    if (upper.status) upper.status.textContent = 'Mode: READ';
    publishE7State(false);
    requestRender();
  }

  function openUpperControls() {
    if (!upperWingEntity || !E7_UPPER_WING.zones.includes(currentViewId) || surveyMode) return;
    phone.panel.hidden = true;
    media.panel.hidden = true;
    suite.panel.hidden = true;
    garage.panel.hidden = true;
    system.panel.hidden = true;
    kitchen.panel.hidden = true;
    upper.panel.hidden = false;
    if (upper.status) upper.status.textContent = 'Mode: ' + upperMode.toUpperCase();
  }

  function publishE8State(active) {
    window.__LO_E8_STATE__ = {
      version: E8_TECH_BAY.version,
      active,
      zone: E8_TECH_BAY.zone,
      anchor: E8_TECH_BAY.anchor.slice(),
      modes: E8_TECH_BAY.modes.slice(),
      mode: active ? garageMode : 'display',
      architecturalLanguage: E8_TECH_BAY.architecturalLanguage,
      partCount: active ? garageMetrics.partCount : 0,
      bayParts: active ? garageMetrics.bayParts : 0,
      vehicleParts: active ? garageMetrics.vehicleParts : 0,
      vehicleShells: active ? garageMetrics.vehicleShells : 0,
      wheelForms: active ? garageMetrics.wheelForms : 0,
      lightElements: active ? garageMetrics.lightElements : 0,
      chargingForms: active ? garageMetrics.chargingForms : 0,
      diagnosticForms: active ? garageMetrics.diagnosticForms : 0,
      registeredInteractions: active ? garageMetrics.registeredInteractions : 0,
      drivetrainSystems: 0,
      vehicleActors: 0,
      intelligenceCores: 1,
      collisionComponents: 0,
      runtimeNetworkDependencies: 0,
      residentBehaviorChanges: 0
    };
  }

  function setGarageMode(mode, announce = true) {
    if (!garageTechBayEntity || !E8_TECH_BAY.modes.includes(mode) || !garageModeMaterials) return false;
    garageMode = mode;
    const palette = garageModeMaterials[mode];
    garageLightEntities.forEach(entity => { if (entity?.render) entity.render.material = palette.light; });
    garageDiagnosticEntities.forEach(entity => { if (entity?.render) entity.render.material = palette.diagnostic; });
    vehicleAccentEntities.forEach(entity => { if (entity?.render) entity.render.material = palette.vehicle; });
    if (garage.status) garage.status.textContent = 'Mode: ' + mode.toUpperCase();
    publishE8State(true);
    if (announce) setStatus('Technology Bay: ' + mode.toUpperCase(), 'Local owner mode · modular vehicle shell · no drivetrain');
    requestRender();
    return true;
  }

  function createGarageTechBay() {
    if (garageTechBayEntity) return;
    const graphite = createFoyerMaterial('E8 Precision Graphite', [0.018, 0.024, 0.030], [0.001, 0.002, 0.003], 0.76, 0.90);
    const titanium = createFoyerMaterial('E8 Warm Titanium', [0.34, 0.35, 0.34], [0.010, 0.010, 0.009], 0.88, 0.91);
    const bronze = createFoyerMaterial('E8 Brushed Bronze', [0.31, 0.15, 0.050], [0.014, 0.004, 0.001], 0.84, 0.88);
    const stone = createFoyerMaterial('E8 Mineral Floor', [0.30, 0.31, 0.30], [0.006, 0.006, 0.005], 0.22, 0.72);
    const ivory = createFoyerMaterial('E8 Warm Ivory', [0.65, 0.62, 0.55], [0.014, 0.012, 0.008], 0.12, 0.76);
    const glass = createFoyerMaterial('E8 Smoked Vehicle Glass', [0.020, 0.065, 0.082], [0.002, 0.009, 0.012], 0.62, 0.96);
    const tire = createFoyerMaterial('E8 Tire Black', [0.010, 0.011, 0.012], [0, 0, 0], 0.05, 0.28);
    const arrivalAmber = createFoyerMaterial('E8 Arrival Amber', [0.42, 0.17, 0.030], [1.0, 0.24, 0.022], 0.18, 0.90);
    const chargeAqua = createFoyerMaterial('E8 Charge Aqua', [0.010, 0.20, 0.20], [0.010, 0.78, 0.70], 0.25, 0.92);
    const displayWhite = createFoyerMaterial('E8 Display White', [0.56, 0.54, 0.48], [0.80, 0.70, 0.48], 0.16, 0.91);
    const serviceBlue = createFoyerMaterial('E8 Service Blue', [0.020, 0.10, 0.25], [0.025, 0.34, 0.95], 0.24, 0.92);

    garageTechBayEntity = new pc.Entity(E8_TECH_BAY.name);
    app.root.addChild(garageTechBayEntity);
    vehicleShellEntity = new pc.Entity('E8 Modular Luxury Vehicle Shell');
    garageTechBayEntity.addChild(vehicleShellEntity);
    garageLightEntities = [];
    garageDiagnosticEntities = [];
    vehicleAccentEntities = [];
    garageModeMaterials = {
      arrival: { light: arrivalAmber, diagnostic: graphite, vehicle: arrivalAmber },
      charge: { light: chargeAqua, diagnostic: chargeAqua, vehicle: chargeAqua },
      display: { light: displayWhite, diagnostic: glass, vehicle: displayWhite },
      service: { light: serviceBlue, diagnostic: serviceBlue, vehicle: serviceBlue }
    };
    const groupCounts = { bay: 0, vehicle: 0 };
    let partCount = 0;
    let wheelForms = 0;
    let lightElements = 0;
    let chargingForms = 0;
    let diagnosticForms = 0;

    function part(group, name, type, position, scale, material, euler) {
      const entity = new pc.Entity(name);
      entity.addComponent('render', { type, castShadows: false, receiveShadows: true });
      entity.render.material = material;
      entity.setLocalPosition(position[0], position[1], position[2]);
      entity.setLocalScale(scale[0], scale[1], scale[2]);
      if (euler) entity.setLocalEulerAngles(euler[0], euler[1], euler[2]);
      (group === 'vehicle' ? vehicleShellEntity : garageTechBayEntity).addChild(entity);
      groupCounts[group] += 1;
      partCount += 1;
      return entity;
    }

    function bayLight(name, type, position, scale, material, euler) {
      const entity = part('bay', name, type, position, scale, material, euler);
      garageLightEntities.push(entity);
      lightElements += 1;
      return entity;
    }

    function diagnostic(name, type, position, scale, material, euler) {
      const entity = part('bay', name, type, position, scale, material, euler);
      garageDiagnosticEntities.push(entity);
      diagnosticForms += 1;
      return entity;
    }

    function vehicleAccent(name, type, position, scale, material, euler) {
      const entity = part('vehicle', name, type, position, scale, material, euler);
      vehicleAccentEntities.push(entity);
      lightElements += 1;
      return entity;
    }

    // Technology-bay envelope: familiar work, storage, charging, and diagnostics in advanced forms.
    part('bay', 'Technology Bay Mineral Floor', 'box', [14.10, 0.02, 21.40], [6.40, 0.08, 7.20], stone);
    part('bay', 'Technology Bay Rear Wall', 'box', [14.10, 1.60, 25.12], [6.40, 3.10, 0.10], graphite);
    part('bay', 'Technology Bay Left Wall', 'box', [10.82, 1.60, 21.40], [0.10, 3.10, 7.20], graphite);
    part('bay', 'Technology Bay Right Wall', 'box', [17.38, 1.60, 21.40], [0.10, 3.10, 7.20], graphite);
    part('bay', 'Technology Bay Entry Threshold', 'box', [14.10, 0.07, 17.76], [5.70, 0.08, 0.16], bronze);
    [[12.55, 19.10], [15.65, 19.10], [12.55, 23.60], [15.65, 23.60]].forEach(([x, z], index) => {
      part('bay', 'Parking Guidance Rail ' + (index + 1), 'box', [x, 0.09, z], [0.08, 0.035, 1.55], titanium);
    });
    [18.70, 19.82, 20.94, 22.06, 23.18, 24.30].forEach((z, index) => {
      part('bay', 'Technology Storage Cabinet ' + (index + 1), 'box', [17.02, 0.78, z], [0.52, 1.42, 0.88], index % 2 ? graphite : titanium);
    });
    part('bay', 'Service Workbench Base', 'box', [11.48, 0.62, 23.34], [0.92, 1.10, 2.72], graphite);
    part('bay', 'Service Workbench Surface', 'box', [11.48, 1.20, 23.34], [1.04, 0.10, 2.88], titanium);
    part('bay', 'Service Tool Wall', 'box', [10.98, 1.92, 23.34], [0.08, 1.22, 2.88], bronze);
    [21.20, 22.05, 22.90, 23.75, 24.60, 25.02].forEach((z, index) => {
      part('bay', 'Service Tool Dock ' + (index + 1), 'box', [10.88, 1.92, z], [0.05, 0.14, 0.48], index % 2 ? ivory : titanium);
    });
    part('bay', 'Charging Pedestal', 'cylinder', [16.46, 0.42, 18.72], [0.42, 0.78, 0.42], graphite);
    part('bay', 'Charging Mast', 'cylinder', [16.46, 1.22, 18.72], [0.10, 1.42, 0.10], bronze);
    part('bay', 'Charging Head', 'box', [16.46, 1.78, 18.72], [0.48, 0.58, 0.32], glass);
    const chargingRing = part('bay', 'Charging Status Ring', 'cylinder', [16.46, 1.82, 18.53], [0.30, 0.035, 0.30], chargeAqua, [90, 0, 0]);
    garageLightEntities.push(chargingRing);
    chargingForms = 4;
    diagnostic('Diagnostic Arch Left', 'box', [12.08, 1.63, 21.40], [0.12, 3.05, 0.18], glass);
    diagnostic('Diagnostic Arch Right', 'box', [16.12, 1.63, 21.40], [0.12, 3.05, 0.18], glass);
    diagnostic('Diagnostic Arch Crown', 'box', [14.10, 3.10, 21.40], [4.16, 0.14, 0.18], glass);
    diagnostic('Diagnostic Command Display', 'box', [11.05, 2.12, 19.24], [0.05, 1.10, 1.46], glass);
    part('bay', 'Service Lift Platform', 'box', [14.10, 0.13, 21.42], [3.15, 0.14, 5.05], graphite);
    part('bay', 'Service Lift Rail Left', 'box', [12.52, 0.22, 21.42], [0.10, 0.12, 5.05], bronze);
    part('bay', 'Service Lift Rail Right', 'box', [15.68, 0.22, 21.42], [0.10, 0.12, 5.05], bronze);
    part('bay', 'Technology Bay Core Pedestal', 'cylinder', [11.55, 0.55, 18.25], [0.26, 1.00, 0.26], graphite);
    part('bay', 'Technology Bay Core Access Orb', 'sphere', [11.55, 1.15, 18.25], [0.18, 0.18, 0.18], chargeAqua);
    [11.55, 13.25, 14.95, 16.65].forEach((x, index) => bayLight('Technology Bay Ceiling Ribbon ' + (index + 1), 'box', [x, 3.12, 21.30], [0.055, 0.025, 5.85], displayWhite));
    bayLight('Technology Bay Left Floor Guide', 'box', [11.15, 0.11, 21.30], [0.035, 0.025, 5.70], displayWhite);
    bayLight('Technology Bay Right Floor Guide', 'box', [17.05, 0.11, 21.30], [0.035, 0.025, 5.70], displayWhite);
    bayLight('Technology Bay Charging Beacon', 'sphere', [16.46, 2.20, 18.72], [0.13, 0.13, 0.13], displayWhite);
    bayLight('Technology Bay Diagnostic Crown Light', 'box', [14.10, 3.08, 21.22], [3.75, 0.035, 0.035], displayWhite);
    bayLight('Technology Bay Threshold Light', 'box', [14.10, 0.12, 17.65], [5.40, 0.025, 0.025], displayWhite);

    // One modular luxury vehicle shell: recognizable proportions, no drivetrain or driving behavior.
    part('vehicle', 'Vehicle Display Plinth', 'box', [14.10, 0.25, 21.42], [2.72, 0.12, 4.72], graphite);
    part('vehicle', 'Vehicle Underbody', 'box', [14.10, 0.52, 21.42], [2.08, 0.28, 3.92], titanium);
    part('vehicle', 'Vehicle Lower Body', 'box', [14.10, 0.76, 21.42], [2.28, 0.42, 4.34], graphite);
    part('vehicle', 'Vehicle Center Body', 'box', [14.10, 1.00, 21.42], [2.18, 0.38, 3.76], titanium);
    part('vehicle', 'Vehicle Sculpted Hood', 'box', [14.10, 1.20, 19.92], [2.04, 0.22, 1.48], ivory, [-5, 0, 0]);
    part('vehicle', 'Vehicle Aerodynamic Nose', 'box', [14.10, 0.88, 19.18], [2.14, 0.38, 0.34], graphite, [-8, 0, 0]);
    part('vehicle', 'Vehicle Rear Deck', 'box', [14.10, 1.16, 22.98], [2.08, 0.24, 1.18], titanium, [4, 0, 0]);
    part('vehicle', 'Vehicle Left Sill', 'box', [12.98, 0.71, 21.55], [0.18, 0.24, 3.22], bronze);
    part('vehicle', 'Vehicle Right Sill', 'box', [15.22, 0.71, 21.55], [0.18, 0.24, 3.22], bronze);
    part('vehicle', 'Vehicle Cabin Base', 'box', [14.10, 1.31, 21.48], [1.78, 0.24, 2.34], graphite);
    part('vehicle', 'Vehicle Panoramic Roof', 'box', [14.10, 1.98, 21.54], [1.54, 0.10, 1.72], glass);
    part('vehicle', 'Vehicle Windshield', 'box', [14.10, 1.66, 20.52], [1.70, 0.86, 0.08], glass, [-24, 0, 0]);
    part('vehicle', 'Vehicle Rear Glass', 'box', [14.10, 1.62, 22.52], [1.68, 0.76, 0.08], glass, [22, 0, 0]);
    part('vehicle', 'Vehicle Left Side Glass', 'box', [13.24, 1.64, 21.52], [0.07, 0.70, 1.62], glass);
    part('vehicle', 'Vehicle Right Side Glass', 'box', [14.96, 1.64, 21.52], [0.07, 0.70, 1.62], glass);
    part('vehicle', 'Vehicle Left Door Shell', 'box', [12.94, 1.11, 21.55], [0.10, 0.70, 1.82], titanium);
    part('vehicle', 'Vehicle Right Door Shell', 'box', [15.26, 1.11, 21.55], [0.10, 0.70, 1.82], titanium);
    part('vehicle', 'Vehicle Left Door Seam', 'box', [12.82, 1.11, 21.55], [0.025, 0.54, 1.55], bronze);
    part('vehicle', 'Vehicle Right Door Seam', 'box', [15.38, 1.11, 21.55], [0.025, 0.54, 1.55], bronze);
    part('vehicle', 'Vehicle Front Fascia', 'box', [14.10, 0.87, 18.98], [1.82, 0.34, 0.10], glass);
    part('vehicle', 'Vehicle Rear Fascia', 'box', [14.10, 0.88, 23.62], [1.88, 0.34, 0.10], glass);
    [[12.94, 19.92], [15.26, 19.92], [12.94, 22.92], [15.26, 22.92]].forEach(([x, z], index) => {
      part('vehicle', 'Vehicle Wheel ' + (index + 1), 'cylinder', [x, 0.73, z], [0.46, 0.24, 0.46], tire, [0, 0, 90]);
      part('vehicle', 'Vehicle Wheel Hub ' + (index + 1), 'cylinder', [x + (x < 14 ? -0.13 : 0.13), 0.73, z], [0.25, 0.035, 0.25], bronze, [0, 0, 90]);
      wheelForms += 1;
    });
    vehicleAccent('Vehicle Front Light Left', 'box', [13.45, 1.05, 18.86], [0.48, 0.08, 0.035], displayWhite);
    vehicleAccent('Vehicle Front Light Right', 'box', [14.75, 1.05, 18.86], [0.48, 0.08, 0.035], displayWhite);
    vehicleAccent('Vehicle Rear Light Left', 'box', [13.45, 1.06, 23.74], [0.48, 0.08, 0.035], displayWhite);
    vehicleAccent('Vehicle Rear Light Right', 'box', [14.75, 1.06, 23.74], [0.48, 0.08, 0.035], displayWhite);
    vehicleAccent('Vehicle Center Identity Light', 'box', [14.10, 0.69, 18.84], [0.44, 0.035, 0.035], displayWhite);
    part('vehicle', 'Vehicle Dashboard', 'box', [14.10, 1.28, 20.72], [1.45, 0.18, 0.40], graphite);
    part('vehicle', 'Vehicle Center Console', 'box', [14.10, 1.05, 21.50], [0.28, 0.45, 1.38], bronze);
    [[13.62, 21.10], [14.58, 21.10], [13.62, 22.08], [14.58, 22.08]].forEach(([x, z], index) => {
      part('vehicle', 'Vehicle Cabin Seat ' + (index + 1), 'box', [x, 1.24, z], [0.54, 0.62, 0.64], ivory);
    });
    part('vehicle', 'Vehicle Steering Yoke', 'box', [13.62, 1.55, 20.76], [0.42, 0.08, 0.18], bronze);
    part('vehicle', 'Vehicle Rear Aero Blade', 'box', [14.10, 1.40, 23.28], [1.72, 0.10, 0.32], graphite);
    part('vehicle', 'Vehicle Front Splitter', 'box', [14.10, 0.58, 18.74], [2.02, 0.09, 0.28], bronze);
    part('vehicle', 'Vehicle Rear Diffuser', 'box', [14.10, 0.58, 23.86], [2.02, 0.09, 0.28], bronze);
    part('vehicle', 'Vehicle Modular Shell Registry', 'box', [14.10, 0.92, 23.96], [0.72, 0.22, 0.035], chargeAqua);

    const interactionsBefore = interactionRegistry.size;
    registerInteractions('e8', garageTechBayEntity);
    garageMetrics = {
      partCount,
      bayParts: groupCounts.bay,
      vehicleParts: groupCounts.vehicle,
      vehicleShells: 1,
      wheelForms,
      lightElements,
      chargingForms,
      diagnosticForms,
      registeredInteractions: interactionRegistry.size - interactionsBefore
    };
    setGarageMode('display', false);
    requestRender();
  }

  function removeGarageTechBay() {
    unregisterLayerInteractions('e8');
    if (garageTechBayEntity) {
      garageTechBayEntity.destroy();
      garageTechBayEntity = null;
    }
    vehicleShellEntity = null;
    garageMode = 'display';
    garageModeMaterials = null;
    garageLightEntities = [];
    garageDiagnosticEntities = [];
    vehicleAccentEntities = [];
    garageMetrics = { partCount: 0, bayParts: 0, vehicleParts: 0, vehicleShells: 0, wheelForms: 0, lightElements: 0, chargingForms: 0, diagnosticForms: 0, registeredInteractions: 0 };
    garage.panel.hidden = true;
    if (garage.status) garage.status.textContent = 'Mode: DISPLAY';
    publishE8State(false);
    requestRender();
  }

  function openGarageControls() {
    if (!garageTechBayEntity || currentViewId !== E8_TECH_BAY.zone || surveyMode) return;
    phone.panel.hidden = true;
    media.panel.hidden = true;
    suite.panel.hidden = true;
    upper.panel.hidden = true;
    system.panel.hidden = true;
    kitchen.panel.hidden = true;
    garage.panel.hidden = false;
    if (garage.status) garage.status.textContent = 'Mode: ' + garageMode.toUpperCase();
  }

  function runATCEmailTransportTest(source = 'owner-control') {
    const routeReady = Boolean(
      atcAccessEntity
      && chassis.shortestRoute('garage-ground', 'atc-ground')
      && E10_1_ATC_ACCESS.hubId === 'TLO-CIH-112-118-123'
      && E10_1_ATC_ACCESS.communicationsHost === 'ATC-COMMS-0.4F'
    );
    const testTime = new Date().toISOString();
    const cueAlreadyIssued = Boolean(atcEmailTest.cueIssuedAt);
    const preservedCueLedger = cueAlreadyIssued
      ? atcEmailTest.ledger.filter(entry => entry.event.startsWith('FAX_') || entry.event === 'EMAIL_ORIENTATION_PRESENTED')
      : [];
    atcEmailTest = {
      ...atcEmailTest,
      source,
      testedAt: testTime,
      status: routeReady ? 'DELIVERED_UNREAD_BOTH_ENDPOINTS' : 'FAILED_CLOSED_ROUTE_UNAVAILABLE',
      route: routeReady
        ? ['TLO-CIH-112-118-123', 'ATC-COMMS-0.4F', 'ATC-EXISTING-SCIENTIST-01', 'ATC-EXISTING-SCIENTIST-02']
        : [],
      endpointStates: routeReady ? ['DELIVERED_UNREAD', 'DELIVERED_UNREAD'] : ['NOT_SENT', 'NOT_SENT'],
      scientistAcknowledgment: 'NONE',
      scientistReply: 'NONE',
      recognitionFax: cueAlreadyIssued ? atcEmailTest.recognitionFax : 'INSTALLED_QUEUED_FOR_VERIFIED_PERSONNEL_NOTICE',
      audibleDing: cueAlreadyIssued ? atcEmailTest.audibleDing : 'ARMED_ONCE_NOT_CLAIMED_HEARD',
      cueIssuedAt: cueAlreadyIssued ? atcEmailTest.cueIssuedAt : null,
      emailOrientation: cueAlreadyIssued ? atcEmailTest.emailOrientation : 'NOT_PRESENTED',
      ledger: routeReady ? [
        { sequence: 1, event: 'MESSAGE_CREATED', actor: 'MACHINE_TEST_HARNESS', at: testTime },
        { sequence: 2, event: 'HUB_ROUTE_VERIFIED', actor: 'TLO-CIH-112-118-123', at: testTime },
        { sequence: 3, event: 'HOST_ACCEPTED', actor: 'ATC-COMMS-0.4F', at: testTime },
        { sequence: 4, event: 'ENDPOINT_01_DELIVERED_UNREAD', actor: 'MACHINE_DELIVERY_SERVICE', at: testTime },
        { sequence: 5, event: 'ENDPOINT_02_DELIVERED_UNREAD', actor: 'MACHINE_DELIVERY_SERVICE', at: testTime },
        { sequence: 6, event: 'LEDGER_CORRELATION_COMPLETE', actor: 'MACHINE_TEST_HARNESS', at: testTime }
      ].concat(preservedCueLedger.map((entry, index) => ({ ...entry, sequence: 7 + index }))) : [
        { sequence: 1, event: 'FAILED_CLOSED_ROUTE_UNAVAILABLE', actor: 'MACHINE_TEST_HARNESS', at: testTime }
      ]
    };
    window.__LO_ATC_EMAIL_LEDGER__ = atcEmailTest.ledger.map(entry => ({ ...entry }));
    publishATCState();
    if (!atc.panel.hidden) updateATCPanel();
    if (source === 'owner-control') {
      atc.emailTest.textContent = routeReady ? 'EMAIL DELIVERED ✓' : 'EMAIL TEST FAILED';
      setStatus(
        routeReady ? 'ATC email transport passed' : 'ATC email transport stopped safely',
        routeReady
          ? 'Both endpoints delivered / unread · Ledger correlation complete · no acknowledgment or reply asserted'
          : 'Hub route unavailable · nothing delivered'
      );
    }
    return routeReady;
  }

  function playATCFaxDing() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return 'AUDIO_UNAVAILABLE';
    try {
      if (!atcAudioContext) atcAudioContext = new AudioContextClass();
      if (atcAudioContext.state === 'suspended') atcAudioContext.resume();
      const start = atcAudioContext.currentTime + 0.30;
      const oscillator = atcAudioContext.createOscillator();
      const gain = atcAudioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1046.5, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.22, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.72);
      oscillator.connect(gain);
      gain.connect(atcAudioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.74);
      return 'PLAYBACK_REQUESTED_NOT_CLAIMED_HEARD';
    } catch (error) {
      return 'AUDIO_BLOCKED_NOT_CLAIMED_HEARD';
    }
  }

  function issueATCFaxDing() {
    if (atcEmailTest.status !== 'DELIVERED_UNREAD_BOTH_ENDPOINTS') {
      setStatus('Fax cue stopped safely', 'The email route must pass before the recognition notice can be issued');
      return false;
    }
    if (atcEmailTest.cueIssuedAt) {
      setStatus('Fax cue already issued', 'The one-shot notice will not repeat during this runtime');
      return false;
    }
    const issuedAt = new Date().toISOString();
    const audioResult = playATCFaxDing();
    const startSequence = atcEmailTest.ledger.length + 1;
    atcEmailTest = {
      ...atcEmailTest,
      recognitionFax: 'PRINTED_SHARED_NOTICE_ONCE',
      audibleDing: 'ISSUED_ONCE_' + audioResult,
      cueIssuedAt: issuedAt,
      emailOrientation: 'PRESENTED_BASIC_OPERATION_NOTICE',
      ledger: atcEmailTest.ledger.concat([
        { sequence: startSequence, event: 'FAX_RECOGNITION_NOTICE_PRINTED', actor: 'ATC-FAX-EMAIL-ADVISORY-UNIT', at: issuedAt },
        { sequence: startSequence + 1, event: 'FAX_DING_' + audioResult, actor: 'ATC-LOCAL-AUDIO-CUE', at: issuedAt },
        { sequence: startSequence + 2, event: 'EMAIL_ORIENTATION_PRESENTED', actor: 'ATC-COMMUNICATIONS-HOST', at: issuedAt }
      ])
    };
    window.__LO_ATC_EMAIL_LEDGER__ = atcEmailTest.ledger.map(entry => ({ ...entry }));
    updateATCPanel();
    atc.panel.hidden = false;
    setStatus('Fax notice printed · ding issued once', 'Scientists directed to Orientation 0001-A and basic email operation · no attention, reading, acknowledgment, or reply inferred');
    return true;
  }

  function publishATCState() {
    const resident = coreState?.worldState?.systems?.pilotResident;
    window.__LO_ATC_STATE__ = {
      version: E10_1_ATC_ACCESS.version,
      active: Boolean(atcAccessEntity),
      environment: 'advanced-technology-center',
      route: E10_1_ATC_ACCESS.route.slice(),
      routeValid: Boolean(chassis.shortestRoute('garage-ground', 'atc-ground')),
      hubId: E10_1_ATC_ACCESS.hubId,
      communicationsHost: E10_1_ATC_ACCESS.communicationsHost,
      geometryAuthority: E10_1_ATC_ACCESS.geometryAuthority,
      power: {
        authority: E10_1_ATC_ACCESS.powerAuthority,
        available: Boolean(app && root && layers.furniture.state === 'ready'),
        separateATCPowerSourceInvented: false
      },
      hub: {
        id: E10_1_ATC_ACCESS.hubId,
        communicationsHost: E10_1_ATC_ACCESS.communicationsHost,
        role: 'RECOGNIZE_ROUTE_RECORD_ONLY',
        connected: Boolean(atcAccessEntity),
        manufacturesScientistJudgment: false
      },
      scientistEndpoints: atcScientistState.map((state, index) => ({
        id: state.id,
        roleLabel: 'Scientist ' + String(index + 1).padStart(2, '0'),
        intendedDuty: E10_1_ATC_ACCESS.dutyBaseline,
        authorityState: 'RELEASED_ACTIVE_AVAILABLE',
        runtimeBodySignal: atcScientistEntities[index] ? 'OBSERVABLE_ENDPOINT_BOUND_REPRESENTATION' : 'NOT_EXPOSED',
        movement: atcScientistEntities[index] ? 'ACTIVE_INDEPENDENT_ROUTINE' : 'UNAVAILABLE',
        currentWorkAnchor: state.labels[state.nextIndex],
        completedMoves: state.movementCount
      })),
      scientistRoutineRuntimeSeconds: Number(atcScientistClock.toFixed(1)),
      emailTest: {
        id: atcEmailTest.id,
        mode: atcEmailTest.mode,
        subject: atcEmailTest.subject,
        status: atcEmailTest.status,
        route: atcEmailTest.route.slice(),
        endpointStates: atcEmailTest.endpointStates.slice(),
        ledgerEntries: atcEmailTest.ledger.length,
        scientistAcknowledgment: atcEmailTest.scientistAcknowledgment,
        scientistReply: atcEmailTest.scientistReply,
        recognitionFax: atcEmailTest.recognitionFax,
        audibleDing: atcEmailTest.audibleDing,
        cueIssuedAt: atcEmailTest.cueIssuedAt,
        emailOrientation: atcEmailTest.emailOrientation
      },
      orientation: 'DELIVERED_UNREAD_BOTH_ENDPOINTS',
      scientistReply: 'NONE',
      residentAnchor: resident?.currentAnchor || null,
      teleporter: 'WORKING_PROTECTED_SCIENTIST_CUSTODY_NO_CONTROLS_EXPOSED',
      tme00: 'DORMANT_NONFUNCTIONAL_SEALED',
      restoredZones: ['professional-work-area', 'bridge-diagnostic-workshop', 'research-operations-annex', 'tme-00-sealed-observation-enclosure', 'protected-teleporter-area'],
      metrics: { ...atcMetrics },
      candidate10Modified: false,
      candidate101Modified: false,
      candidate102Modified: false
    };
  }

  function createATCAccess() {
    if (atcAccessEntity) return;
    const graphite = createFoyerMaterial('ATC Graphite', [0.016, 0.024, 0.032], [0.001, 0.003, 0.005], 0.76, 0.91);
    const titanium = createFoyerMaterial('ATC Titanium', [0.34, 0.37, 0.39], [0.010, 0.013, 0.015], 0.88, 0.92);
    const mineral = createFoyerMaterial('ATC Mineral Floor', [0.31, 0.32, 0.31], [0.006, 0.007, 0.007], 0.22, 0.73);
    const warm = createFoyerMaterial('ATC Warm Work Light', [0.58, 0.53, 0.42], [0.74, 0.58, 0.30], 0.14, 0.90);
    const aqua = createFoyerMaterial('ATC Endpoint Aqua', [0.010, 0.20, 0.21], [0.010, 0.78, 0.74], 0.22, 0.94);
    const amber = createFoyerMaterial('ATC Unread Amber', [0.34, 0.12, 0.018], [0.92, 0.23, 0.018], 0.20, 0.91);
    const glass = createFoyerMaterial('ATC Observation Glass', [0.025, 0.075, 0.090], [0.004, 0.025, 0.032], 0.60, 0.96);

    atcAccessEntity = new pc.Entity(E10_1_ATC_ACCESS.name);
    app.root.addChild(atcAccessEntity);
    let partCount = 0;
    let passageParts = 0;
    let doorParts = 0;
    let centerParts = 0;

    function part(group, name, type, position, scale, material, euler, parent) {
      const entity = new pc.Entity(name);
      entity.addComponent('render', { type, castShadows: false, receiveShadows: true });
      entity.render.material = material;
      entity.setLocalPosition(position[0], position[1], position[2]);
      entity.setLocalScale(scale[0], scale[1], scale[2]);
      if (euler) entity.setLocalEulerAngles(euler[0], euler[1], euler[2]);
      (parent || atcAccessEntity).addChild(entity);
      partCount += 1;
      if (group === 'passage') passageParts += 1;
      if (group === 'door') doorParts += 1;
      if (group === 'center') centerParts += 1;
      return entity;
    }

    // Short enclosed ground-level passage extending the garage's approved service-entrance function.
    part('passage', 'TLO ATC Service Passage Floor', 'box', [19.0, 0.05, 23.40], [3.20, 0.10, 2.20], mineral);
    part('passage', 'TLO ATC Service Passage North Wall', 'box', [19.0, 1.55, 24.55], [3.20, 3.00, 0.10], graphite);
    part('passage', 'TLO ATC Service Passage South Wall', 'box', [19.0, 1.55, 22.25], [3.20, 3.00, 0.10], graphite);
    part('passage', 'TLO ATC Service Passage Ceiling', 'box', [19.0, 3.08, 23.40], [3.20, 0.10, 2.20], graphite);
    part('passage', 'TLO ATC Service Passage Floor Guide Left', 'box', [19.0, 0.12, 22.55], [3.00, 0.025, 0.035], aqua);
    part('passage', 'TLO ATC Service Passage Floor Guide Right', 'box', [19.0, 0.12, 24.25], [3.00, 0.025, 0.035], aqua);

    // Revolving entry: a visible controlled portal, separated from teleporter systems.
    part('door', 'TLO ATC Revolving Entry Drum', 'cylinder', [20.72, 1.50, 23.40], [1.02, 2.90, 1.02], glass);
    atcDoorRotorEntity = new pc.Entity('TLO ATC Controlled Revolving Entry');
    atcDoorRotorEntity.setLocalPosition(20.72, 1.50, 23.40);
    atcAccessEntity.addChild(atcDoorRotorEntity);
    part('door', 'ATC Revolving Door Spine', 'cylinder', [0, 0, 0], [0.09, 2.70, 0.09], titanium, null, atcDoorRotorEntity);
    part('door', 'ATC Revolving Door Wing A', 'box', [0.48, 0, 0], [0.96, 2.62, 0.055], titanium, null, atcDoorRotorEntity);
    part('door', 'ATC Revolving Door Wing B', 'box', [-0.48, 0, 0], [0.96, 2.62, 0.055], titanium, null, atcDoorRotorEntity);
    part('door', 'ATC Revolving Door Wing C', 'box', [0, 0, 0.48], [0.055, 2.62, 0.96], titanium, null, atcDoorRotorEntity);
    part('door', 'ATC Revolving Door Wing D', 'box', [0, 0, -0.48], [0.055, 2.62, 0.96], titanium, null, atcDoorRotorEntity);
    part('door', 'ATC Entry Status Crown', 'box', [20.72, 3.04, 23.40], [2.20, 0.12, 0.18], aqua);

    // Expanded first-floor ATC shell. Its geometry is deliberately provisional, reversible, and expandable.
    part('center', 'ATC Restored Mineral Floor', 'box', [31.75, 0.03, 24.00], [21.80, 0.08, 20.40], mineral);
    part('center', 'ATC North Perimeter', 'box', [31.75, 1.70, 34.25], [21.80, 3.35, 0.12], graphite);
    part('center', 'ATC South Perimeter', 'box', [31.75, 1.70, 13.75], [21.80, 3.35, 0.12], graphite);
    part('center', 'ATC East Perimeter', 'box', [42.70, 1.70, 24.00], [0.12, 3.35, 20.40], graphite);
    part('center', 'ATC West Boundary Left', 'box', [20.82, 1.70, 18.70], [0.12, 3.35, 9.80], graphite);
    part('center', 'ATC West Boundary Right', 'box', [20.82, 1.70, 28.70], [0.12, 3.35, 9.80], graphite);
    [15.2, 20.4, 25.6, 30.8].forEach((z, index) => {
      part('center', 'ATC Circulation Guide West ' + (index + 1), 'box', [29.8, 0.12, z], [15.8, 0.025, 0.035], aqua);
    });

    // Bridge Diagnostic Workshop, retained physically left of the professional workstation reference.
    part('center', 'ATC Intake Triage Bench', 'box', [23.35, 0.76, 16.05], [3.60, 1.35, 0.92], graphite);
    part('center', 'ATC Diagnostic Spine', 'box', [25.65, 0.76, 17.95], [7.80, 1.35, 0.90], graphite);
    part('center', 'ATC Layered Teardown Station', 'box', [22.90, 0.76, 19.65], [2.60, 1.35, 1.05], graphite);
    part('center', 'ATC Clean Component Table', 'box', [26.20, 0.76, 19.65], [2.80, 1.35, 1.05], titanium);
    part('center', 'ATC Calibration Bay', 'box', [28.35, 0.76, 16.20], [1.55, 1.35, 3.10], glass);
    part('center', 'ATC Evidence Locker', 'box', [21.45, 1.32, 15.25], [0.45, 2.45, 2.10], titanium);
    part('center', 'ATC Reassembly Verification Bench', 'box', [26.60, 0.76, 14.75], [4.50, 1.35, 0.85], graphite);
    part('center', 'ATC Advanced Tool Wall', 'box', [24.80, 2.22, 13.92], [6.90, 1.30, 0.08], titanium);
    [22.0, 23.1, 24.2, 25.3, 26.4, 27.5].forEach((x, index) => {
      part('center', 'ATC Recognizable Advanced Tool Dock ' + (index + 1), 'box', [x, 2.20, 13.82], [0.48, 0.14, 0.04], index % 2 ? warm : aqua);
    });

    // Reinstalled first-floor professional communications and records package.
    part('center', 'ATC Professional Workstation Base', 'box', [31.75, 0.70, 20.45], [3.80, 1.25, 1.25], graphite);
    part('center', 'ATC Professional Workstation Surface', 'box', [31.75, 1.38, 20.45], [4.10, 0.10, 1.45], titanium);
    part('center', 'ATC Communications Display', 'box', [31.75, 2.04, 19.88], [2.10, 1.08, 0.08], glass);
    part('center', 'ATC Fax Email Advisory Unit', 'box', [33.30, 1.72, 20.45], [0.72, 0.44, 0.74], titanium);
    part('center', 'ATC Research Repair Ledger Console', 'box', [30.15, 1.67, 20.45], [0.72, 0.36, 0.74], glass);
    part('center', 'ATC Notification Resource Request Surface', 'box', [34.10, 1.82, 19.90], [0.70, 0.70, 0.08], warm);
    part('center', 'ATC Endpoint Beacon 01', 'sphere', [31.35, 2.10, 19.75], [0.13, 0.13, 0.13], amber);
    part('center', 'ATC Endpoint Beacon 02', 'sphere', [32.15, 2.10, 19.75], [0.13, 0.13, 0.13], amber);

    // Research Operations Annex: quiet theory, shared office, break/observation, storage, expansion reserve.
    part('center', 'ATC Annex Divider', 'box', [34.40, 1.70, 24.65], [0.10, 3.25, 8.30], titanium);
    part('center', 'ATC Quiet Theory Table', 'box', [37.00, 0.74, 23.55], [2.80, 1.25, 1.35], graphite);
    part('center', 'ATC Shared Research Office Desk', 'box', [39.75, 0.74, 25.20], [2.80, 1.25, 1.20], graphite);
    part('center', 'ATC Shared Research Display', 'box', [41.85, 1.80, 25.20], [0.08, 1.35, 2.20], glass);
    part('center', 'ATC Break Observation Counter', 'box', [37.10, 0.74, 27.40], [2.60, 1.25, 0.85], titanium);
    part('center', 'ATC Secure Storage', 'box', [41.75, 1.35, 22.00], [0.70, 2.50, 2.40], graphite);
    part('center', 'ATC Future Expansion Reserve Marker', 'box', [38.30, 0.12, 31.75], [5.60, 0.025, 0.12], aqua);

    // Dormant sealed TME-00 enclosure. No activation path is exposed.
    part('center', 'TME-00 Sealed Observation Glazing West', 'box', [35.55, 1.65, 30.15], [0.10, 3.10, 5.10], glass);
    part('center', 'TME-00 Sealed Observation Glazing South', 'box', [38.30, 1.65, 27.55], [5.60, 3.10, 0.10], glass);
    part('center', 'TME-00 Dormant Prototype Core', 'cylinder', [38.50, 0.82, 30.45], [0.86, 1.45, 0.86], graphite);
    part('center', 'TME-00 Dormant Prototype Crown', 'cylinder', [38.50, 1.68, 30.45], [0.92, 0.08, 0.92], titanium);

    // Protected teleporter custody zone. The machine is represented, but no controls or settings exist.
    part('center', 'ATC Protected Teleporter Boundary', 'cylinder', [24.75, 0.12, 29.80], [2.55, 0.05, 2.55], aqua);
    part('center', 'ATC Teleporter Lower Ring', 'cylinder', [24.75, 0.24, 29.80], [1.75, 0.18, 1.75], titanium);
    part('center', 'ATC Teleporter Protected Column', 'cylinder', [24.75, 1.42, 29.80], [1.18, 2.15, 1.18], glass);
    part('center', 'ATC Teleporter Upper Ring', 'cylinder', [24.75, 2.58, 29.80], [1.75, 0.18, 1.75], titanium);
    part('center', 'ATC Teleporter No-Control Marker', 'box', [27.10, 0.38, 29.80], [1.45, 0.36, 0.12], graphite);

    // Endpoint-bound, neutral scientist representations. No names, personalities, speech, or authored results are invented.
    function scientistBody(state, index) {
      const body = new pc.Entity(state.id + ' Observable Representation');
      body.setLocalPosition(state.position[0], state.position[1], state.position[2]);
      atcAccessEntity.addChild(body);
      part('center', 'Scientist ' + (index + 1) + ' Torso', 'cylinder', [0, 1.08, 0], [0.34, 0.88, 0.34], aqua, null, body);
      part('center', 'Scientist ' + (index + 1) + ' Head', 'sphere', [0, 1.82, 0], [0.34, 0.34, 0.34], warm, null, body);
      part('center', 'Scientist ' + (index + 1) + ' Left Arm', 'cylinder', [-0.43, 1.05, 0], [0.13, 0.78, 0.13], aqua, null, body);
      part('center', 'Scientist ' + (index + 1) + ' Right Arm', 'cylinder', [0.43, 1.05, 0], [0.13, 0.78, 0.13], aqua, null, body);
      part('center', 'Scientist ' + (index + 1) + ' Left Leg', 'cylinder', [-0.16, 0.35, 0], [0.13, 0.65, 0.13], graphite, null, body);
      part('center', 'Scientist ' + (index + 1) + ' Right Leg', 'cylinder', [0.16, 0.35, 0], [0.13, 0.65, 0.13], graphite, null, body);
      part('center', 'Scientist ' + (index + 1) + ' Role Badge', 'box', [0.20, 1.20, -0.30], [0.16, 0.18, 0.04], titanium, null, body);
      return body;
    }
    atcScientistEntities = atcScientistState.map(scientistBody);

    const interactionsBefore = interactionRegistry.size;
    registerInteractions('atc-11-2', atcAccessEntity);
    atcMetrics = {
      partCount,
      passageParts,
      doorParts,
      centerParts,
      scientistBodies: atcScientistEntities.length,
      recognizedZones: 5,
      registeredInteractions: interactionRegistry.size - interactionsBefore
    };
    runATCEmailTransportTest('startup');
    requestRender();
  }

  function removeATCAccess() {
    unregisterLayerInteractions('atc-11-2');
    if (atcAccessEntity) {
      atcAccessEntity.destroy();
      atcAccessEntity = null;
    }
    atcDoorRotorEntity = null;
    atcDoorPhase = 0;
    atcDoorActive = false;
    atcScientistEntities = [];
    atcScientistClock = 0;
    atcScientistState.forEach(state => {
      state.anchorIndex = 0;
      state.nextIndex = 1;
      state.movementCount = 0;
      state.position = state.anchors[0].slice();
    });
    atcEmailTest = {
      id: 'ATC-MAIL-TEST-0001',
      mode: 'MACHINE_SIDE_FAIL_CLOSED',
      subject: 'Communications Transport Verification',
      status: 'NOT_RUN',
      route: [],
      endpointStates: ['NOT_SENT', 'NOT_SENT'],
      ledger: [],
      scientistAcknowledgment: 'NONE',
      scientistReply: 'NONE',
      recognitionFax: 'INSTALLED_QUEUED',
      audibleDing: 'ARMED_ONCE_NOT_CLAIMED_HEARD',
      cueIssuedAt: null,
      emailOrientation: 'NOT_PRESENTED'
    };
    if (atc.faxNotice) atc.faxNotice.hidden = true;
    if (atc.cue) {
      atc.cue.disabled = false;
      atc.cue.textContent = 'ISSUE FAX + DING';
    }
    atcMetrics = { partCount: 0, passageParts: 0, doorParts: 0, centerParts: 0, scientistBodies: 0, recognizedZones: 0, registeredInteractions: 0 };
    atc.panel.hidden = true;
    publishATCState();
    requestRender();
  }

  function updateATCAccess(dt) {
    if (!atcAccessEntity) return;
    if (atcDoorRotorEntity) {
      const residentState = coreState?.worldState?.systems?.pilotResident;
      const routeTouchesDoor = residentRoute.some(id => E10_1_ATC_ACCESS.zones.includes(id));
      atcDoorActive = routeTouchesDoor || residentState?.currentAnchor === 'atc-access-ground';
      if (atcDoorActive) {
        atcDoorPhase = (atcDoorPhase + dt * 42) % 360;
        atcDoorRotorEntity.setLocalEulerAngles(0, atcDoorPhase, 0);
      }
    }

    const step = Math.min(Math.max(dt, 0), 0.05);
    atcScientistClock += step;
    atcScientistEntities.forEach((entity, index) => {
      const state = atcScientistState[index];
      const target = state.anchors[state.nextIndex];
      const position = entity.getLocalPosition();
      const dx = target[0] - position.x;
      const dz = target[2] - position.z;
      const distance = Math.hypot(dx, dz);
      if (distance < 0.06) {
        state.anchorIndex = state.nextIndex;
        state.nextIndex = (state.nextIndex + 1) % state.anchors.length;
        state.movementCount += 1;
        if (!atc.panel.hidden) updateATCPanel();
        else publishATCState();
      } else {
        const speed = index === 0 ? 0.46 : 0.38;
        const amount = Math.min(distance, speed * step);
        entity.setLocalPosition(position.x + dx / distance * amount, 0, position.z + dz / distance * amount);
        entity.setLocalEulerAngles(0, Math.atan2(dx, dz) * 180 / Math.PI, 0);
        state.position = [position.x, 0, position.z];
      }
    });
    if (chassis.getView(currentViewId)?.zone === 'atc') requestRender();
  }

  function updateATCPanel() {
    const residentAnchor = coreState?.worldState?.systems?.pilotResident?.currentAnchor;
    const routeValid = Boolean(chassis.shortestRoute('garage-ground', 'atc-ground'));
    atc.route.textContent = 'Route: ' + (routeValid && atcAccessEntity ? 'GARAGE → PASSAGE → REVOLVING ENTRY → ATC' : 'NOT AVAILABLE');
    atc.power.textContent = 'Power: ' + (app && root && layers.furniture.state === 'ready' ? 'AVAILABLE · inherited from active estate runtime' : 'NOT AVAILABLE');
    atc.hub.textContent = 'Hub: ' + (atcAccessEntity ? 'CONNECTED FOR RECOGNITION / MESSAGE ROUTING' : 'NOT CONNECTED') + ' · separate from power';
    atc.scientist01.textContent = 'Scientist 01: active routine · ' + atcScientistState[0].labels[atcScientistState[0].nextIndex] + ' · moves ' + atcScientistState[0].movementCount;
    atc.scientist02.textContent = 'Scientist 02: active routine · ' + atcScientistState[1].labels[atcScientistState[1].nextIndex] + ' · moves ' + atcScientistState[1].movementCount;
    atc.message.textContent = 'Orientation 0001-A: DELIVERED / UNREAD at both endpoints';
    atc.emailTestStatus.textContent = 'Email test: ' + (
      atcEmailTest.status === 'DELIVERED_UNREAD_BOTH_ENDPOINTS'
        ? 'PASS · both endpoints delivered / unread · Ledger ' + atcEmailTest.ledger.length + ' events'
        : atcEmailTest.status
    );
    const cueIssued = Boolean(atcEmailTest.cueIssuedAt);
    atc.faxStatus.textContent = 'Recognition fax: ' + (cueIssued ? 'PRINTED ONCE' : 'INSTALLED / ARMED ONCE');
    atc.dingStatus.textContent = 'Audible ding: ' + (cueIssued ? 'ISSUED ONCE · not claimed heard' : 'ARMED ONCE · awaiting direct tap');
    atc.faxNotice.hidden = !cueIssued;
    atc.cue.disabled = cueIssued || atcEmailTest.status !== 'DELIVERED_UNREAD_BOTH_ENDPOINTS';
    atc.cue.textContent = cueIssued ? 'FAX + DING ISSUED ✓' : 'ISSUE FAX + DING';
    atc.movement.textContent = 'Movement: two endpoint-bound representations active independently'
      + (E10_1_ATC_ACCESS.zones.includes(residentAnchor) ? ' · Avery is also in the ATC' : '');
    publishATCState();
  }

  function openATCControls() {
    if (!atcAccessEntity || surveyMode) return;
    if (currentViewId === 'garage-ground') {
      applyView('atc-access-ground', true);
      return;
    }
    if (currentViewId === 'atc-access-ground') {
      applyView('atc-ground', true);
      return;
    }
    if (!E10_1_ATC_ACCESS.zones.includes(currentViewId) || currentViewId === 'atc-access-ground') return;
    phone.panel.hidden = true;
    media.panel.hidden = true;
    suite.panel.hidden = true;
    upper.panel.hidden = true;
    garage.panel.hidden = true;
    system.panel.hidden = true;
    kitchen.panel.hidden = true;
    updateATCPanel();
    atc.panel.hidden = false;
  }

  function checkATCStatus() {
    updateATCPanel();
    atc.route.textContent = '\u2713 STATUS CHECK COMPLETE · ' + atc.route.textContent;
    atc.check.textContent = 'STATUS CHECKED \u2713';
    setStatus('ATC status checked', 'Power available · Hub route connected · two independent scientist routines active · geometry provisional');
  }

  function callAveryFromATC() {
    callResident();
    if (!E10_1_ATC_ACCESS.zones.includes(currentViewId) || currentViewId === 'atc-access-ground') return;
    updateATCPanel();
    atc.call.textContent = 'CALL ACKNOWLEDGED \u2713';
    atc.movement.textContent = residentRoute.length
      ? 'Movement: Avery route accepted; both scientist routines remain independent'
      : 'Movement: Avery is already present; both scientist routines remain independent';
    atc.panel.hidden = false;
    publishATCState();
  }

  function publishE9ExteriorState(active) {
    window.__LO_E9_EXTERIOR_STATE__ = {
      version: E9_EXTERIOR_SHELL.version,
      active,
      views: E9_EXTERIOR_SHELL.views.slice(),
      subsystems: E9_EXTERIOR_SHELL.subsystems.slice(),
      architecturalLanguage: E9_EXTERIOR_SHELL.architecturalLanguage,
      partCount: active ? exteriorMetrics.partCount : 0,
      terrainParts: active ? exteriorMetrics.terrainParts : 0,
      hardscapeParts: active ? exteriorMetrics.hardscapeParts : 0,
      landscapeParts: active ? exteriorMetrics.landscapeParts : 0,
      waterParts: active ? exteriorMetrics.waterParts : 0,
      fireParts: active ? exteriorMetrics.fireParts : 0,
      lightingParts: active ? exteriorMetrics.lightingParts : 0,
      removableSubsystemGroups: active ? Object.keys(exteriorSubsystems).sort() : [],
      budgets: { ...E9_EXTERIOR_SHELL.budgets },
      animatedWater: false,
      particleFire: false,
      dynamicShadows: false,
      continuousRendering: false,
      collisionComponents: 0,
      runtimeNetworkDependencies: 0,
      residentBehaviorChanges: 0,
      cameraUx01Implemented: false
    };
  }

  function createExteriorEnvironmentalShell() {
    if (exteriorShellEntity) return;

    const terrainGreen = createFoyerMaterial('E9 Coastal Terrain', [0.075, 0.13, 0.085], [0.003, 0.006, 0.004], 0.02, 0.34);
    const sand = createFoyerMaterial('E9 Mineral Sand', [0.46, 0.39, 0.27], [0.010, 0.008, 0.004], 0.04, 0.42);
    const stone = createFoyerMaterial('E9 Warm Architectural Stone', [0.31, 0.29, 0.25], [0.008, 0.006, 0.004], 0.22, 0.68);
    const graphite = createFoyerMaterial('E9 Satin Graphite', [0.026, 0.032, 0.034], [0.002, 0.003, 0.003], 0.68, 0.84);
    const bronze = createFoyerMaterial('E9 Brushed Bronze', [0.30, 0.16, 0.055], [0.014, 0.006, 0.001], 0.82, 0.86);
    const foliage = createFoyerMaterial('E9 Coastal Foliage', [0.035, 0.15, 0.075], [0.002, 0.008, 0.004], 0.03, 0.30);
    const foliageLight = createFoyerMaterial('E9 Coastal Foliage Highlight', [0.08, 0.23, 0.12], [0.004, 0.012, 0.006], 0.03, 0.34);
    const water = createFoyerMaterial('E9 Static Coastal Water', [0.018, 0.15, 0.19], [0.006, 0.17, 0.22], 0.38, 0.90);
    const waterEdge = createFoyerMaterial('E9 Static Water Edge', [0.035, 0.30, 0.32], [0.010, 0.32, 0.34], 0.26, 0.86);
    const fire = createFoyerMaterial('E9 Static Fire Amber', [0.56, 0.12, 0.018], [1.0, 0.21, 0.010], 0.08, 0.72);
    const ember = createFoyerMaterial('E9 Static Ember Gold', [0.62, 0.24, 0.025], [1.0, 0.43, 0.025], 0.12, 0.80);
    const guide = createFoyerMaterial('E9 Architectural Guide Light', [0.35, 0.22, 0.07], [0.82, 0.48, 0.10], 0.20, 0.86);

    exteriorShellEntity = new pc.Entity(E9_EXTERIOR_SHELL.name);
    app.root.addChild(exteriorShellEntity);
    exteriorSubsystems = Object.create(null);
    const groupCounts = Object.fromEntries(E9_EXTERIOR_SHELL.subsystems.map(name => [name, 0]));
    E9_EXTERIOR_SHELL.subsystems.forEach(name => {
      const group = new pc.Entity('E9 Exterior Subsystem - ' + name);
      exteriorShellEntity.addChild(group);
      exteriorSubsystems[name] = group;
    });

    function part(groupName, name, type, position, scale, material, euler) {
      const entity = new pc.Entity(name);
      entity.addComponent('render', { type, castShadows: false, receiveShadows: false });
      entity.render.material = material;
      entity.setLocalPosition(position[0], position[1], position[2]);
      entity.setLocalScale(scale[0], scale[1], scale[2]);
      if (euler) entity.setLocalEulerAngles(euler[0], euler[1], euler[2]);
      exteriorSubsystems[groupName].addChild(entity);
      groupCounts[groupName] += 1;
      return entity;
    }

    // Terrain: one broad low-cost base plus readable coastal grade bands.
    part('terrain', 'E9 Terrain Base', 'box', [8.0, -0.34, 12.5], [48, 0.42, 58], terrainGreen);
    part('terrain', 'E9 Mineral Shore Shelf', 'box', [-2.45, -0.10, 12.0], [4.6, 0.18, 46], sand);
    part('terrain', 'E9 Arrival Green Left', 'box', [1.25, -0.07, -2.3], [4.8, 0.22, 8.8], terrainGreen);
    part('terrain', 'E9 Arrival Green Right', 'box', [15.1, -0.07, -2.3], [4.8, 0.22, 8.8], terrainGreen);
    part('terrain', 'E9 Fire Court Green', 'box', [21.0, -0.06, 10.5], [8.4, 0.20, 10.0], terrainGreen);
    part('terrain', 'E9 Night Garden Green', 'box', [8.2, -0.05, 29.0], [17.5, 0.20, 8.5], terrainGreen);

    // Hardscape: familiar circulation expressed with restrained advanced forms.
    part('hardscape', 'E9 Arrival Court', 'box', [8.1, 0.02, -2.6], [8.2, 0.10, 8.0], stone);
    part('hardscape', 'E9 Arrival Center Spine', 'box', [8.1, 0.08, 2.2], [1.4, 0.08, 5.4], graphite);
    part('hardscape', 'E9 Entry Bridge', 'box', [8.1, 0.08, 6.0], [3.2, 0.10, 2.1], stone);
    part('hardscape', 'E9 Waterfront Promenade', 'box', [-0.20, 0.03, 12.0], [3.6, 0.12, 23.0], stone);
    part('hardscape', 'E9 Waterfront Edge Rail', 'box', [-1.75, 0.42, 12.0], [0.08, 0.78, 22.8], bronze);
    part('hardscape', 'E9 Fire Court Platform', 'box', [21.0, 0.03, 10.5], [6.6, 0.12, 7.2], graphite);
    part('hardscape', 'E9 Fire Court Bench North', 'box', [21.0, 0.38, 13.35], [4.8, 0.46, 0.54], stone);
    part('hardscape', 'E9 Fire Court Bench South', 'box', [21.0, 0.38, 7.65], [4.8, 0.46, 0.54], stone);
    part('hardscape', 'E9 Night Garden Walk', 'box', [8.2, 0.04, 29.0], [14.0, 0.10, 1.2], stone);
    part('hardscape', 'E9 Night Garden Cross Walk', 'box', [8.2, 0.04, 29.0], [1.2, 0.10, 7.0], stone);
    part('hardscape', 'E9 Garden Observation Plinth', 'cylinder', [8.2, 0.11, 32.0], [2.6, 0.18, 2.6], graphite);
    part('hardscape', 'E9 Coastal Terrace Step', 'box', [14.8, 0.12, 24.8], [7.6, 0.18, 1.0], bronze);

    // Landscape: sparse shared-material forms keep draw and memory pressure bounded.
    [[0.0, 0.95, 1.2], [18.0, 1.10, 0.8], [-0.1, 1.10, 5.0], [19.0, 1.15, 17.2], [1.0, 1.15, 27.0], [15.8, 1.20, 28.8], [3.0, 1.05, 33.0], [13.0, 1.10, 33.4]].forEach(([x, height, z], index) => {
      part('landscape', 'E9 Coastal Tree Trunk ' + (index + 1), 'cylinder', [x, height * 0.50, z], [0.22, height, 0.22], bronze);
      part('landscape', 'E9 Coastal Tree Canopy ' + (index + 1), 'sphere', [x, height + 0.64, z], [0.88, 1.18, 0.88], index % 2 ? foliageLight : foliage);
    });
    [[-0.2, 8.0], [0.1, 16.0], [18.8, 5.2], [19.4, 14.5], [3.5, 27.4], [12.8, 27.3], [4.4, 31.0], [12.0, 31.2]].forEach(([x, z], index) => {
      part('landscape', 'E9 Sculpted Coastal Shrub ' + (index + 1), 'sphere', [x, 0.42, z], [0.72, 0.72, 0.72], index % 2 ? foliage : foliageLight);
    });
    [[2.4, 0.28, -0.6], [13.8, 0.28, -0.6], [18.2, 0.28, 8.2], [18.2, 0.28, 12.8]].forEach(([x, y, z], index) => {
      part('landscape', 'E9 Mineral Planter ' + (index + 1), 'box', [x, y, z], [1.2, 0.48, 1.2], stone);
      part('landscape', 'E9 Planter Foliage ' + (index + 1), 'sphere', [x, y + 0.55, z], [0.62, 0.72, 0.62], foliageLight);
    });

    // Water: static opaque forms; no reflection, refraction, transparency, or animation pass.
    part('water', 'E9 Static Coastal Water Field', 'box', [-10.0, -0.12, 12.0], [14.0, 0.10, 46.0], water);
    part('water', 'E9 Static Shoreline Ribbon', 'box', [-3.05, -0.035, 12.0], [0.34, 0.045, 45.0], waterEdge);
    part('water', 'E9 Night Garden Reflecting Rill', 'box', [8.2, 0.105, 29.0], [5.2, 0.055, 1.02], waterEdge);

    // Fire: layered emissive geometry only; intentionally no particle emitter.
    part('fire', 'E9 Fire Court Hearth', 'cylinder', [21.0, 0.20, 10.5], [1.50, 0.28, 1.50], stone);
    part('fire', 'E9 Fire Court Ember Bed', 'cylinder', [21.0, 0.38, 10.5], [1.04, 0.10, 1.04], ember);
    [[-0.48, 0.82, 0.0, -12], [0.48, 0.82, 0.0, 12], [0.0, 1.02, -0.32, 0], [0.0, 0.72, 0.38, 0]].forEach(([x, y, z, tilt], index) => {
      part('fire', 'E9 Static Flame Layer ' + (index + 1), 'cone', [21.0 + x, y, 10.5 + z], [0.34, 0.92, 0.34], index % 2 ? ember : fire, [0, 0, tilt]);
    });

    // Lighting: emissive guide geometry only; no additional light components or shadows.
    [[5.4, -0.70], [8.1, -0.70], [10.8, -0.70]].forEach(([x, z], index) => {
      part('lighting', 'E9 Arrival Guide ' + (index + 1), 'box', [x, 0.115, z], [1.7, 0.025, 0.06], guide);
    });
    [-0.4, 4.0, 8.4, 12.8, 17.2, 21.6].forEach((z, index) => {
      part('lighting', 'E9 Waterfront Guide ' + (index + 1), 'box', [-1.62, 0.20, z], [0.04, 0.05, 1.45], guide);
    });
    [[18.4, 8.0], [23.6, 8.0], [18.4, 13.0], [23.6, 13.0]].forEach(([x, z], index) => {
      part('lighting', 'E9 Fire Court Marker ' + (index + 1), 'cylinder', [x, 0.38, z], [0.10, 0.68, 0.10], graphite);
      part('lighting', 'E9 Fire Court Marker Light ' + (index + 1), 'sphere', [x, 0.78, z], [0.13, 0.13, 0.13], guide);
    });
    [[3.0, 29.0], [5.6, 29.0], [10.8, 29.0], [13.4, 29.0]].forEach(([x, z], index) => {
      part('lighting', 'E9 Night Garden Path Light ' + (index + 1), 'box', [x, 0.13, z], [0.72, 0.035, 0.05], guide);
    });

    exteriorMetrics = {
      partCount: Object.values(groupCounts).reduce((total, count) => total + count, 0),
      terrainParts: groupCounts.terrain,
      hardscapeParts: groupCounts.hardscape,
      landscapeParts: groupCounts.landscape,
      waterParts: groupCounts.water,
      fireParts: groupCounts.fire,
      lightingParts: groupCounts.lighting
    };
    publishE9ExteriorState(true);
    publishPreflightState();
    requestRender();
  }

  function removeExteriorEnvironmentalShell() {
    if (exteriorShellEntity) exteriorShellEntity.destroy();
    exteriorShellEntity = null;
    exteriorSubsystems = Object.create(null);
    exteriorMetrics = { partCount: 0, terrainParts: 0, hardscapeParts: 0, landscapeParts: 0, waterParts: 0, fireParts: 0, lightingParts: 0 };
    publishE9ExteriorState(false);
    publishPreflightState();
    requestRender();
  }

  function updateKitchenPanel() {
    const state = window.__LO_KITCHEN_EQUIPMENT_STATE__;
    const byId = Object.fromEntries((state?.endpoints || []).map(endpoint => [endpoint.id, endpoint]));
    const endpointText = endpoint => endpoint
      ? endpoint.label + ': ' + endpoint.recognition.replaceAll('_', ' ') + ' · actuator ' + endpoint.actuator.toLowerCase()
      : 'Unavailable';
    kitchen.connection.textContent = state?.active && state?.coreConnected
      ? 'CONNECTED — Core, smart house, and Resident phone can read four kitchen equipment endpoints.'
      : 'WAITING — recognition completes when the furnished house and Foyer Core are ready.';
    kitchen.refrigerator.textContent = endpointText(byId['KITCHEN-REFRIGERATOR-01']);
    kitchen.oven.textContent = endpointText(byId['KITCHEN-DOUBLE-OVEN-01']);
    kitchen.induction.textContent = endpointText(byId['KITCHEN-INDUCTION-HOOD-01']);
    kitchen.projection.textContent = endpointText(byId['KITCHEN-ISLAND-PROJECTION-01']);
    kitchen.authority.textContent = 'Read-only recognition · zero actuator commands · zero simulated appliance behaviors · owner approval required before any operating contract.';
  }

  function openKitchenStatus() {
    phone.panel.hidden = true;
    media.panel.hidden = true;
    suite.panel.hidden = true;
    upper.panel.hidden = true;
    garage.panel.hidden = true;
    atc.panel.hidden = true;
    survey.panel.hidden = true;
    system.panel.hidden = true;
    updateKitchenPanel();
    kitchen.panel.hidden = false;
    setStatus('Chef Kitchen recognized', 'Four existing equipment endpoints · read-only safe standby · no appliance actuation');
  }

  function updateButtons() {
    const view = chassis.getView(currentViewId);
    const exteriorActive = view?.zone === 'exterior';
    controls.enter.disabled = surveyMode || busy || !['ready', 'error'].includes(layers.exterior.state);
    controls.space.disabled = surveyMode ? false : busy || (exteriorActive ? layers.exterior.state !== 'ready' || !exteriorShellEntity : layers.furniture.state !== 'ready');
    controls.space.textContent = surveyMode ? 'NEXT SURVEY SPACE' : exteriorActive ? 'NEXT EXTERIOR' : 'NEXT SPACE';
    controls.decor.disabled = surveyMode || busy || layers.furniture.state !== 'ready' || layers.decor.state === 'ready';
    controls.phone.disabled = surveyMode || busy || layers.furniture.state !== 'ready' || !residentEntity;
    controls.media.disabled = surveyMode || busy || layers.furniture.state !== 'ready' || currentViewId !== E5_GROUND_MEDIA.zone;
    controls.suite.disabled = surveyMode || busy || layers.furniture.state !== 'ready' || !E6_PRIMARY_SUITE.zones.includes(currentViewId);
    controls.upper.disabled = surveyMode || busy || layers.furniture.state !== 'ready' || !E7_UPPER_WING.zones.includes(currentViewId);
    controls.garage.disabled = surveyMode || busy || layers.furniture.state !== 'ready' || currentViewId !== E8_TECH_BAY.zone;
    const atcControlAvailable = currentViewId === 'garage-ground' || E10_1_ATC_ACCESS.zones.includes(currentViewId);
    controls.atc.disabled = surveyMode || busy || layers.furniture.state !== 'ready' || !atcAccessEntity || !atcControlAvailable;
    controls.atc.textContent = currentViewId === 'garage-ground'
      ? 'ENTER ATC'
      : currentViewId === 'atc-access-ground'
        ? 'OPEN ENTRY'
        : 'ATC STATUS';
    controls.survey.disabled = surveyMode ? false : busy || layers.furniture.state !== 'ready';
    controls.survey.textContent = surveyMode ? 'CLOSE SURVEY' : 'SURVEY HOUSE';
    controls.fit.disabled = busy || !view?.fitDistance || (exteriorActive ? layers.exterior.state !== 'ready' || !exteriorShellEntity : layers.furniture.state !== 'ready');
    controls.kitchen.disabled = surveyMode || busy || layers.furniture.state !== 'ready' || !window.__LO_KITCHEN_EQUIPMENT_STATE__?.active;
    controls.fit.textContent = exteriorActive ? 'FIT EXTERIOR' : 'FIT ROOM';
    const life = coreState?.worldState?.systems?.autonomousLife;
    const intentControl = coreState?.worldState?.systems?.intentControl;
    phone.autonomy.disabled = busy || layers.furniture.state !== 'ready' || !residentEntity || intentControl?.sessionState === 'running' || (intentControl?.sessionState === 'stopped' && Boolean(intentControl?.activeIntent));
    phone.autonomy.textContent = intentControl?.sessionState === 'paused' ? 'RESUME' : life?.phase === 'complete' ? 'START NEW SESSION' : 'START';
    phone.pause.disabled = busy || !residentEntity || intentControl?.sessionState !== 'running';
    phone.stop.disabled = busy || !residentEntity || (intentControl?.sessionState === 'stopped' && !intentControl?.activeIntent);
    controls.exit.disabled = surveyMode || !['queued', 'loading', 'ready'].some(s =>
      ['interior', 'furniture', 'decor'].some(n => layers[n].state === s));
    if (system.panel && !system.panel.hidden) refreshSystemStatus();
    if (kitchen.panel && !kitchen.panel.hidden) updateKitchenPanel();
  }

  function collectSystemStatus() {
    const layerState = name => layers[name]?.state || 'unregistered';
    const layerSummary = MANIFEST.layers.map(([name]) => name + ': ' + layerState(name).toUpperCase()).join(' · ');
    const runtimePower = Boolean(app && app.graphicsDevice && !preflightFailure);
    const coreErrors = coreState ? validateRuntimeState(coreState) : ['Core state unavailable.'];
    const coreReady = Boolean(coreState && coreErrors.length === 0);
    const resident = coreState?.worldState?.systems?.pilotResident;
    const phoneReady = Boolean(coreReady && residentEntity && resident?.currentAnchor && phone.panel);
    const roomCount = (roomRegistry.ground?.length || 0) + (roomRegistry.upper?.length || 0);
    const registryReady = chassis.validate().length === 0 && roomCount > 0;
    const houseReady = MANIFEST.layers.every(([name]) => layerState(name) === 'ready');
    const smartHouseReady = Boolean(
      coreReady && houseReady && registryReady &&
      window.__LO_E5_STATE__?.active && window.__LO_E6_STATE__?.active &&
      window.__LO_E7_STATE__?.active && window.__LO_E8_STATE__?.active
    );
    const commandPathReady = Boolean(
      coreReady && phoneReady && smartHouseReady && arbiter &&
      typeof arbiter.recordOwnerOverride === 'function' &&
      typeof core.saveWithRollback === 'function'
    );
    const atcState = window.__LO_ATC_STATE__;
    const atcReady = Boolean(atcState?.active && atcState?.power?.available && atcState?.hub?.connected);
    const scientistSignals = Array.isArray(atcState?.scientistEndpoints) ? atcState.scientistEndpoints : [];
    const scientistsReady = scientistSignals.length === 2 && scientistSignals.every(endpoint => endpoint.movement === 'ACTIVE_INDEPENDENT_ROUTINE');
    const kitchenState = window.__LO_KITCHEN_EQUIPMENT_STATE__;
    const kitchenReady = Boolean(
      kitchenState?.active && kitchenState?.coreConnected && kitchenState?.smartHouseRegistered &&
      kitchenState?.endpoints?.length === 4 && kitchenState.endpoints.every(endpoint => endpoint.actuator === 'DISABLED') &&
      kitchenState.actuatorCommandsExposed === 0 && kitchenState.applianceBehaviors === 0
    );
    const checks = [
      { label: 'Runtime power', ok: runtimePower, detail: runtimePower ? 'ACTIVE — local engine and graphics runtime available. This does not invent a separate electrical branch model.' : 'NOT READY — local runtime has not completed startup.' },
      { label: 'Intelligence Core', ok: coreReady, detail: coreReady ? 'READY — one validated Core; ' + coreHealth + '.' : 'NOT READY — ' + coreErrors.join(' ') },
      { label: 'Resident phone', ok: phoneReady, detail: phoneReady ? 'BOUND — ' + (coreState.residentProfile.displayName || coreState.residentProfile.residentId) + ' at ' + resident.currentAnchor + '.' : 'WAITING — phone contract exists; Resident binding completes when the furnished house is ready.' },
      { label: 'Smart house', ok: smartHouseReady, detail: smartHouseReady ? 'READY — Media, Primary Suite, Upper Wing, and Technology Bay share the single Core.' : 'WAITING — control surfaces complete after the interior and furniture layers load.' },
      { label: 'House layers', ok: houseReady, detail: layerSummary },
      { label: 'Room registry', ok: registryReady, detail: registryReady ? 'READY — ' + roomCount + ' ground/upper descriptions plus operational, survey, exterior, and ATC routes.' : 'NOT READY — room or route registry validation failed.' },
      { label: 'Command spine', ok: commandPathReady, detail: commandPathReady ? 'READY — phone → intent authority → Core persistence → smart-house surface contract is present. This read-only check issues no command.' : 'WAITING — full contract requires the Core, Resident phone, and house surfaces together.' },
      { label: 'Technology Center', ok: atcReady, detail: atcReady ? 'READY — estate runtime power inherited; Hub route connected; no separate ATC power source invented.' : 'WAITING — ATC registers after the furnished house becomes ready.' },
      { label: 'Scientists', ok: scientistsReady, detail: scientistsReady ? 'OBSERVABLE — two endpoint-bound representations report independent active routines.' : 'WAITING — no movement conclusion until both endpoint signals are present.' },
      { label: 'Kitchen equipment', ok: kitchenReady, detail: kitchenReady ? 'RECOGNIZED / SAFE STANDBY — four existing equipment surfaces registered; zero actuator commands and zero simulated behaviors.' : 'WAITING — read-only equipment recognition completes with the furnished house and Foyer Core.' },
      { label: 'Infinity Shrine', ok: false, neutral: true, detail: 'PARKED — complete concept preserved; mansion placement and newcomer activation remain separate future work.' }
    ];
    const required = checks.filter(check => !check.neutral);
    const ready = required.every(check => check.ok);
    return { version: window.LO_VERSION.number, ready, checkedAt: new Date().toISOString(), checks };
  }

  function refreshSystemStatus() {
    const report = collectSystemStatus();
    window.__LO_HOUSE_BACKBONE_STATUS__ = report;
    system.summary.textContent = report.ready
      ? 'PASS — phone, Core, smart house, Technology Center, and scientist signals share one local estate runtime.'
      : 'COMMISSIONING — the complete house is opening; this panel updates as each local layer becomes ready.';
    system.results.replaceChildren(...report.checks.map(check => {
      const row = document.createElement('div');
      row.className = 'system-row';
      const term = document.createElement('dt');
      term.textContent = check.label;
      const description = document.createElement('dd');
      description.className = check.neutral || !check.ok ? 'system-wait' : 'system-pass';
      description.textContent = check.detail;
      row.append(term, description);
      return row;
    }));
    return report;
  }

  function commissionHouseAndOpenStatus() {
    phone.panel.hidden = true;
    media.panel.hidden = true;
    suite.panel.hidden = true;
    upper.panel.hidden = true;
    garage.panel.hidden = true;
    atc.panel.hidden = true;
    kitchen.panel.hidden = true;
    if (surveyMode) closeSurvey();
    if (coreState && !coreState.worldState.decorEnabled) commitWorld({ decorEnabled: true }, 'commissioning-decor-requested');
    enqueue(['exterior', 'interior', 'furniture', 'decor']);
    system.panel.hidden = false;
    const report = refreshSystemStatus();
    setStatus(report.ready ? 'House backbone ready' : 'Opening complete house…', 'Read-only Resident phone · Core · smart-house commissioning diagnostic');
  }

  function publishChassisState() {
    window.__LO_CHASSIS_STATE__ = {
      version: chassis.manifest.version,
      currentView: currentViewId,
      surveyMode,
      surveyLevel: surveyMode ? surveyLevel : null,
      navigationSource: 'chassis.manifest.navigation',
      operationalOrder: interiorViewOrder.slice(),
      exteriorOrder: exteriorViewOrder.slice(),
      interactions: interactionRegistry.size,
      valid: chassis.validate().length === 0
    };
    publishPreflightState();
  }

  function publishCoreState() {
    if (!coreState) return;
    window.__LO_CORE_STATE__ = {
      schemaVersion: coreState.schemaVersion,
      revision: coreState.revision,
      residentId: coreState.residentProfile.residentId,
      appearanceAssetId: coreState.residentProfile.appearance.assetId,
      currentView: coreState.worldState.currentView,
      lastInteriorView: coreState.worldState.lastInteriorView,
      decorEnabled: coreState.worldState.decorEnabled,
      residentName: coreState.residentProfile.displayName,
      needs: { ...coreState.residentProfile.behavior.needs },
      residentAnchor: coreState.worldState.systems.pilotResident ? coreState.worldState.systems.pilotResident.currentAnchor : null,
      autonomousLife: coreState.worldState.systems.autonomousLife ? { ...coreState.worldState.systems.autonomousLife } : null,
      intentControl: coreState.worldState.systems.intentControl ? { ...coreState.worldState.systems.intentControl } : null,
      health: coreHealth
    };
  }

  function updatePhone() {
    if (!coreState) return;
    const profile = coreState.residentProfile;
    const resident = coreState.worldState.systems.pilotResident;
    const needs = profile.behavior.needs;
    const lastCommand = profile.behavior.ownerInstructions.at(-1);
    const life = coreState.worldState.systems.autonomousLife;
    const control = coreState.worldState.systems.intentControl;
    const active = control?.activeIntent;
    const lastDecision = control?.decisionLog?.at(-1);
    phone.name.textContent = profile.displayName || 'Pilot Resident';
    phone.needs.textContent = 'Energy ' + needs.energy + ' · Hunger ' + needs.hunger + ' · Comfort ' + needs.comfort;
    phone.location.textContent = 'Location: ' + (resident ? resident.currentAnchor : 'not registered');
    phone.command.textContent = lastCommand ? 'Last command: call to ' + lastCommand.targetAnchor : 'No owner command';
    phone.goal.textContent = life ? 'Goal: ' + life.goal + ' · Action: ' + life.action : 'Goal unavailable';
    phone.reason.textContent = life ? 'Reason: ' + life.reason : 'Reason unavailable';
    phone.authority.textContent = 'Authority: ' + (active?.authority || lastDecision?.authority || (control?.sessionState === 'running' ? 'OWNER-ENABLED AUTOMATION' : 'NONE')).toUpperCase();
    phone.action.textContent = 'Action: ' + (active?.action || life?.action || 'Idle');
    phone.target.textContent = 'Target: ' + (active?.targetAnchor || life?.targetAnchor || 'None');
    phone.override.textContent = 'Override: ' + (lastDecision?.supersededIntentId ? 'Owner superseded ' + lastDecision.supersededIntentId : lastDecision?.result || 'None');
  }

  function protectCoreState() {
    const saved = core.saveWithRollback(coreStorage, coreState, undefined, undefined, validateRuntimeState);
    coreHealth = saved.ok ? 'state protected locally with rollback' : 'PERSISTENCE WARNING: ' + saved.error;
    return saved;
  }

  function validateRuntimeState(state) {
    return arbiter.validateState(chassis, state);
  }

  function initializeCoreState() {
    try { coreStorage = window.localStorage; } catch (_) { coreStorage = null; }
    const restored = core.restore(coreStorage, undefined, validateRuntimeState);
    if (restored.ok) {
      coreState = restored.state;
      coreHealth = 'state restored locally';
    } else {
      const rollback = restored.code === 'not-found'
        ? { ok: false, code: 'not-requested' }
        : core.restoreRollback(coreStorage, undefined, validateRuntimeState);
      coreState = rollback.ok ? rollback.state : core.createInitialState();
      if (rollback.ok) {
        coreHealth = 'primary state rejected; validated rollback loaded without overwriting evidence';
      } else if (restored.code === 'not-found') {
        const created = core.saveWithRollback(coreStorage, coreState, undefined, undefined, validateRuntimeState);
        coreHealth = created.ok ? 'state protected locally' : 'PERSISTENCE WARNING: ' + created.error;
      } else {
        coreHealth = restored.code === 'storage-unavailable'
          ? 'PERSISTENCE WARNING: ' + restored.error
          : 'STATE REJECTED SAFELY: ' + restored.error;
      }
    }
    const configured = pilot.configureState(core, coreState);
    coreState = configured.state;
    const autonomyConfigured = autonomy.configureState(core, coreState);
    coreState = autonomyConfigured.state;
    const controlConfigured = arbiter.configureState(core, coreState);
    coreState = controlConfigured.state;
    const needsRecovery = Boolean(
      coreState.worldState.systems.intentControl.activeIntent ||
      coreState.worldState.systems.autonomousLife?.enabled ||
      coreState.worldState.systems.pilotResident?.movementState === 'moving'
    );
    if (needsRecovery) {
      coreState = arbiter.stop(core, coreState, 'reload-recovery').state;
      coreHealth = 'interrupted action stopped safely after reload';
    }
    if (configured.changed || autonomyConfigured.changed || controlConfigured.changed || needsRecovery) {
      protectCoreState();
    }
    decisionTick = Number.isFinite(coreState.worldState.systems.intentControl.lastDecisionTick)
      ? coreState.worldState.systems.intentControl.lastDecisionTick
      : 0;
    publishCoreState();
    updatePhone();
  }

  function commitWorld(changes, eventType) {
    coreState = core.commitWorld(coreState, changes, eventType);
    protectCoreState();
    publishCoreState();
    updatePhone();
    updateButtons();
  }

  function adoptCoreState(nextState) {
    coreState = nextState;
    protectCoreState();
    publishCoreState();
    updatePhone();
    updateButtons();
  }

  function removeResident() {
    residentRoute.length = 0;
    if (residentEntity) {
      residentEntity.destroy();
      residentEntity = null;
    }
    phone.panel.hidden = true;
    updateButtons();
  }

  function ensureResident() {
    if (residentEntity) return;
    residentEntity = pilot.createEntity(pc);
    app.root.addChild(residentEntity);
    const residentState = coreState.worldState.systems.pilotResident;
    const position = pilot.anchorPosition(chassis, residentState.currentAnchor) || pilot.anchorPosition(chassis, 'entry-ground');
    residentEntity.setPosition(position.x, position.y, position.z);
    if (residentState.targetAnchor && residentState.movementState === 'moving') {
      const route = chassis.shortestRoute(residentState.currentAnchor, residentState.targetAnchor);
      residentRoute = route ? route.slice(1) : [];
    }
    if (coreState.worldState.systems.autonomousLife?.phase === 'resting') autonomyRestRemaining = autonomy.restSeconds;
    updateButtons();
    updatePhone();
    requestRender();
  }

  function updateResident(dt) {
    if (!residentEntity || residentRoute.length === 0) return;
    if (coreState?.worldState?.systems?.pilotResident?.movementState !== 'moving') return;
    const targetAnchor = residentRoute[0];
    const target = pilot.anchorPosition(chassis, targetAnchor);
    if (!target) {
      residentRoute.length = 0;
      fail('Resident route contains an unregistered anchor.');
      return;
    }
    const position = residentEntity.getPosition();
    const dx = target.x - position.x;
    const dy = target.y - position.y;
    const dz = target.z - position.z;
    const distance = Math.hypot(dx, dy, dz);
    const step = 3.2 * dt;
    movementPhase += dt * 8;
    const leftLeg = residentEntity.findByName('Left Leg');
    const rightLeg = residentEntity.findByName('Right Leg');
    if (leftLeg && rightLeg) {
      const swing = Math.sin(movementPhase) * 24;
      leftLeg.setLocalEulerAngles(swing, 0, 0);
      rightLeg.setLocalEulerAngles(-swing, 0, 0);
    }
    if (distance <= step || distance === 0) {
      residentEntity.setPosition(target.x, target.y, target.z);
      residentRoute.shift();
      if (residentRoute.length === 0) {
        if (leftLeg && rightLeg) {
          leftLeg.setLocalEulerAngles(0, 0, 0);
          rightLeg.setLocalEulerAngles(0, 0, 0);
        }
        let arrivalState = coreState;
        const environmentRequest = targetAnchor === 'bedroom-upper'
          ? { surface: 'suite', mode: 'rest', reason: 'Low energy favors the existing reversible REST scene.' }
          : targetAnchor === 'media-ground'
            ? { surface: 'media', mode: 'ambient', reason: 'Curiosity selected the existing reversible AMBIENT display mode.' }
            : null;
        if (environmentRequest && arrivalState.worldState.systems.intentControl.activeIntent?.authority === 'resident-need') {
          const environment = arbiter.requestEnvironment(core, arrivalState, environmentRequest);
          if (!environment.ok) {
            stopAutomation('environment-action-failure', false);
            fail(environment.error);
            return;
          }
          arrivalState = environment.state;
          if (environment.result === 'accepted') {
            if (environmentRequest.surface === 'suite') setSuiteScene(environmentRequest.mode, false);
            if (environmentRequest.surface === 'media') setMediaMode(environmentRequest.mode, false);
          }
        }
        const completedIntent = arbiter.complete(core, arrivalState, targetAnchor);
        if (!completedIntent.ok) {
          residentRoute.length = 0;
          stopAutomation('arrival-mismatch', false);
          fail('Resident arrival did not match the active intent.');
          return;
        }
        let next = completedIntent.state;
        const lifeArrival = autonomy.handleArrival(core, next, targetAnchor);
        next = lifeArrival.state;
        adoptCoreState(next);
        const life = next.worldState.systems.autonomousLife;
        if (lifeArrival.changed && life.phase === 'resting') {
          autonomyRestRemaining = autonomy.restSeconds;
          setStatus('Autonomous need action', life.action + ' · ' + life.reason);
        } else if (lifeArrival.changed && life.phase === 'complete') {
          setStatus('Autonomous life cycle complete', life.reason);
        } else {
          setStatus('Resident arrived', pilot.displayName + ' reached ' + chassis.getView(targetAnchor).label);
        }
      }
    } else {
      residentEntity.setPosition(position.x + dx / distance * step, position.y + dy / distance * step, position.z + dz / distance * step);
      residentEntity.lookAt(target.x, position.y, target.z);
    }
    updatePhone();
    requestRender();
  }

  function updateAutonomy(dt) {
    const life = coreState?.worldState?.systems?.autonomousLife;
    const control = coreState?.worldState?.systems?.intentControl;
    if (!residentEntity || control?.sessionState !== 'running' || !life?.enabled || life.phase !== 'resting') return;
    autonomyRestRemaining -= dt;
    if (autonomyRestRemaining > 0) return;
    const resolved = autonomy.resolveRest(core, chassis, pilot, coreState, arbiter, ++decisionTick);
    if (!resolved.ok) {
      setStatus('Autonomous life stopped safely', resolved.error);
      return;
    }
    adoptCoreState(resolved.state);
    residentRoute = resolved.route.slice(1);
    const nextLife = coreState.worldState.systems.autonomousLife;
    setStatus('Trait-based choice', nextLife.action + ' · ' + nextLife.reason);
    if (residentRoute.length === 0) {
      const completion = autonomy.handleArrival(core, coreState, nextLife.targetAnchor);
      if (completion.changed) {
        adoptCoreState(completion.state);
        setStatus('Autonomous life cycle complete', completion.state.worldState.systems.autonomousLife.reason);
      }
    }
  }

  function startAutonomousLife() {
    if (!residentEntity || layers.furniture.state !== 'ready') return;
    const session = arbiter.start(core, coreState, 'owner-phone');
    if (!session.ok) {
      setStatus('Automation did not start', session.error);
      return;
    }
    if (session.result === 'resumed') {
      adoptCoreState(session.state);
      const active = coreState.worldState.systems.intentControl.activeIntent;
      if (active && residentRoute.length === 0) {
        residentRoute = (chassis.shortestRoute(coreState.worldState.systems.pilotResident.currentAnchor, active.targetAnchor) || []).slice(1);
      }
      setStatus('Automation resumed', active ? active.reason : 'New decisions are enabled.');
      return;
    }
    const started = autonomy.start(core, chassis, pilot, session.state, arbiter, ++decisionTick);
    if (!started.ok) {
      adoptCoreState(arbiter.stop(core, session.state, 'start-failure').state);
      setStatus('Autonomous life stopped safely', started.error);
      return;
    }
    adoptCoreState(started.state);
    residentRoute = started.route.slice(1);
    phone.panel.hidden = true;
    garage.panel.hidden = true;
    atc.panel.hidden = true;
    const life = coreState.worldState.systems.autonomousLife;
    setStatus('Autonomous need detected', life.action + ' · ' + life.reason);
    if (residentRoute.length === 0) {
      const arrival = autonomy.handleArrival(core, coreState, life.targetAnchor);
      if (arrival.changed) {
        adoptCoreState(arrival.state);
        autonomyRestRemaining = autonomy.restSeconds;
      }
    }
  }

  function callResident() {
    if (!residentEntity || layers.furniture.state !== 'ready') return;
    const destination = chassis.getView(currentViewId);
    if (surveyMode || currentViewId === 'exterior-overview' || destination?.residentAccessible === false) {
      setStatus('Command rejected safely', 'Choose a registered interior space before calling the resident');
      return;
    }
    const behavior = JSON.parse(JSON.stringify(coreState.residentProfile.behavior));
    behavior.ownerInstructions.push({ command: 'call-resident', targetAnchor: currentViewId });
    behavior.ownerInstructions = behavior.ownerInstructions.slice(-20);
    const instructed = core.commitResident(coreState, { behavior }, 'owner-command-recorded');
    const accepted = arbiter.request(core, chassis, instructed, {
      authority: 'owner-direct',
      actor: 'Owner',
      trigger: 'call-resident',
      action: 'route',
      targetAnchor: currentViewId,
      reason: 'Owner called Avery to ' + destination.label + '.',
      tick: ++decisionTick
    });
    if (!accepted.ok) {
      setStatus('Command rejected safely', accepted.error);
      return;
    }
    adoptCoreState(accepted.state);
    residentRoute = accepted.route.slice(1);
    phone.panel.hidden = true;
    garage.panel.hidden = true;
    atc.panel.hidden = true;
    if (residentRoute.length === 0) {
      setStatus('Resident already present', pilot.displayName + ' is at ' + chassis.getView(currentViewId).label);
    } else {
      setStatus('Owner command accepted', pilot.displayName + ' following ' + accepted.route.length + ' registered anchors');
    }
  }

  function pauseAutonomousLife() {
    if (!coreState) return;
    const paused = arbiter.pause(core, coreState, 'owner-phone');
    if (!paused.ok) {
      setStatus('Automation pause rejected', paused.error);
      return;
    }
    adoptCoreState(paused.state);
    const directOwnerRoute = paused.state.worldState.systems.intentControl.activeIntent?.authority === 'owner-direct';
    setStatus('Automation paused', directOwnerRoute
      ? 'New autonomous decisions are frozen; the direct Owner route remains authoritative.'
      : 'Resident motion and new decisions are frozen; RESUME or STOP remains available.');
  }

  function stopAutomation(reason, announce = true) {
    if (!coreState) return false;
    const stopped = arbiter.stop(core, coreState, reason || 'owner-phone');
    if (!stopped.ok) return false;
    residentRoute.length = 0;
    autonomyRestRemaining = 0;
    adoptCoreState(stopped.state);
    if (announce) setStatus('Automation stopped', 'Owner STOP/CANCEL cleared intent, route, reservation, and autonomous action.');
    return true;
  }

  function applyOwnerEnvironment(surface, mode, setter) {
    if (!setter(mode)) return false;
    const recorded = arbiter.recordOwnerOverride(core, coreState, surface, mode, 'owner-' + surface + '-control');
    if (!recorded.ok) {
      setStatus('Owner mode not recorded', recorded.error);
      return false;
    }
    adoptCoreState(recorded.state);
    return true;
  }

  function registerInteractions(layerName, entity) {
    let index = 0;
    const visit = node => {
      const kind = chassis.classifyEntity(node.name);
      if (kind) {
        const id = layerName + ':' + node.name + ':' + index;
        interactionRegistry.set(id, { id, layer: layerName, entityName: node.name, kind, entity: node });
        index += 1;
      }
      (node.children || []).forEach(visit);
    };
    visit(entity);
    publishChassisState();
  }

  function unregisterLayerInteractions(layerName) {
    for (const [id, interaction] of interactionRegistry) {
      if (interaction.layer === layerName) interactionRegistry.delete(id);
    }
    publishChassisState();
  }

  function registerLayers() {
    MANIFEST.layers.forEach(([name, url]) => {
      const embedded = Boolean(window.__LO_EMBEDDED__ && window.__LO_EMBEDDED__[name]);
      const asset = embedded ? null : new pc.Asset('Living Observatory - ' + name, 'container', { url });
      if (asset) app.assets.add(asset);
      layers[name] = { name, url, embedded, asset, entity: null, state: 'idle', generation: 0 };
    });
  }

  async function prepareEmbeddedAsset(layer) {
    if (layer.asset) return layer.asset;
    const encoded = window.__LO_EMBEDDED__ && window.__LO_EMBEDDED__[layer.name];
    if (!encoded) throw new Error('Embedded layer data is missing.');
    if (typeof DecompressionStream !== 'function') throw new Error('This iPad does not support local gzip decoding.');
    const raw = atob(encoded);
    const compressed = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i += 1) compressed[i] = raw.charCodeAt(i);
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const buffer = await new Response(stream).arrayBuffer();
    const filename = layer.url.split('/').pop();
    // Pass the already-local GLB bytes directly to PlayCanvas. Some iPad local viewers
    // reject a fetch of a temporary blob: URL even when that URL was created in-page.
    layer.asset = new pc.Asset('Living Observatory - ' + layer.name, 'container', {
      url: filename,
      filename,
      size: buffer.byteLength,
      contents: buffer
    });
    app.assets.add(layer.asset);
    return layer.asset;
  }

  function discardEmbeddedAsset(layer) {
    if (!layer.embedded || !layer.asset) return;
    if (layer.asset.loaded) layer.asset.unload();
    app.assets.remove(layer.asset);
    layer.asset = null;
  }

  function enqueue(names) {
    names.forEach(name => {
      const layer = layers[name];
      if (layer && (layer.state === 'idle' || layer.state === 'error')) {
        if (layer.state === 'error') { delete layerErrors[name]; if (!Object.keys(layerErrors).length) { fatal.style.display = 'none'; fatal.textContent = ''; } }
        layer.state = 'queued';
        layer.generation = generation;
        queue.push(name);
      }
    });
    updateButtons();
    pump();
  }

  function startAssetLoad(name, layer, expectedGeneration) {
    if (layer.generation !== generation || expectedGeneration !== generation) {
      discardEmbeddedAsset(layer);
      layer.state = 'idle';
      busy = false;
      updateButtons();
      pump();
      return;
    }
    const onError = err => {
      layer.asset.off('error', onError);
      busy = false;
      if (layer.generation !== generation || expectedGeneration !== generation) {
        if (layer.asset && layer.asset.loaded) layer.asset.unload();
        discardEmbeddedAsset(layer);
        layer.state = 'idle';
        pump();
        return;
      }
      layerFailed(name, name + ' failed to load: ' + String(err || 'unknown error'));
      updateButtons();
      pump();
    };
    layer.asset.once('error', onError);
    layer.asset.ready(asset => {
      layer.asset.off('error', onError);
      busy = false;
      if (layer.generation !== generation || expectedGeneration !== generation) {
        if (asset.loaded) asset.unload();
        discardEmbeddedAsset(layer);
        layer.state = 'idle';
        updateButtons();
        pump();
        return;
      }
      if (!asset.resource || !asset.resource.instantiateRenderEntity) {
        onError('container could not be instantiated');
        return;
      }
      layer.entity = asset.resource.instantiateRenderEntity({ castShadows: false, receiveShadows: true });
      layer.entity.name = 'Living Observatory - ' + name;
      root.addChild(layer.entity);
      registerInteractions(name, layer.entity);
      layer.state = 'ready';
      if (name === 'exterior') createExteriorEnvironmentalShell();
      if (name === 'furniture') {
        const entryViewId = chassis.resolveInteriorEntry(currentViewId, coreState.worldState.lastInteriorView);
        if (entryViewId !== currentViewId) applyView(entryViewId, false);
      }
      if (name === 'furniture') {
        createFoyerCore();
        createChefKitchen();
        createLivingDining();
        createMediaRoom();
        createPrimarySuite();
        createUpperWing();
        createGarageTechBay();
        createATCAccess();
        ensureResident();
      }
      if (name === 'decor' && !coreState.worldState.decorEnabled) commitWorld({ decorEnabled: true }, 'decor-enabled');
      const readyDetail = name === 'furniture'
        ? 'Route chassis active · ' + interactionRegistry.size + ' registered interactions'
        : undefined;
      setStatus(name.charAt(0).toUpperCase() + name.slice(1) + ' ready', readyDetail);
      updateButtons();
      requestRender();
      if (name === 'furniture' && coreState.worldState.decorEnabled && layers.decor.state === 'idle') enqueue(['decor']);
      pump();
    });
    app.assets.load(layer.asset);
  }

  function pump() {
    if (busy || queue.length === 0) return;
    const name = queue.shift();
    const layer = layers[name];
    if (!layer || layer.state !== 'queued' || layer.generation !== generation) {
      pump();
      return;
    }
    busy = true;
    layer.state = 'loading';
    setStatus('Loading ' + name + '…', 'Sequential local layer load');
    updateButtons();

    const expectedGeneration = generation;
    if (layer.asset) {
      startAssetLoad(name, layer, expectedGeneration);
    } else {
      prepareEmbeddedAsset(layer)
        .then(() => startAssetLoad(name, layer, expectedGeneration))
        .catch(error => {
          busy = false;
          layerFailed(name, name + ' failed to prepare: ' + String(error.message || error));
          updateButtons();
          pump();
        });
    }
  }

  function release(name) {
    const layer = layers[name];
    if (!layer) return;
    if (layer.entity) {
      unregisterLayerInteractions(name);
      layer.entity.destroy();
      layer.entity = null;
    }
    if (layer.asset && layer.asset.loaded) layer.asset.unload();
    discardEmbeddedAsset(layer);
    layer.state = 'idle';
    requestRender();
  }

  function exitProperty() {
    stopAutomation('property-exit', false);
    kitchen.panel.hidden = true;
    generation += 1;
    queue.length = 0;
    ['decor', 'furniture', 'interior'].forEach(name => {
      const layer = layers[name];
      layer.generation = generation;
      if (layer.state !== 'loading') release(name);
    });
    removeResident();
    removeFoyerCore();
    removeChefKitchen();
    removeLivingDining();
    removeMediaRoom();
    removePrimarySuite();
    removeUpperWing();
    removeGarageTechBay();
    removeATCAccess();
    applyView('exterior-overview', false);
    setStatus('Exterior mode', 'Optional layers released or cancelled · exterior route restored');
    if (layers.exterior.state === 'error') enqueue(['exterior']); // retry a model that failed earlier
    updateButtons();
  }

  function updateSurveyPanel() {
    if (!surveyMode) return;
    const view = chassis.getView(currentViewId);
    survey.location.textContent = 'Viewing: ' + (view ? view.label : 'unregistered space');
    survey.levelTitle.textContent = surveyLevel === 'ground' ? 'Ground-level registry' : 'Upper-level registry';
    survey.roomList.replaceChildren(...roomRegistry[surveyLevel].map(label => {
      const item = document.createElement('li');
      item.textContent = label;
      return item;
    }));
  }

  function applySurveyView(id, announce) {
    if (!chassis.getView(id)) {
      const recoveryId = surveyLevel === 'ground' ? 'survey-ground' : 'survey-upper';
      setStatus('Survey stopped safely', 'Invalid destination rejected · ' + chassis.getView(recoveryId).label + ' restored');
      applyView(recoveryId, false, false);
      return false;
    }
    applyView(id, announce, false);
    return true;
  }

  function selectSurveyLevel(level) {
    if (!surveyViewOrder[level]) return;
    surveyLevel = level;
    applySurveyView(level === 'ground' ? 'survey-ground' : 'survey-upper', true);
    updateSurveyPanel();
    setStatus(level === 'ground' ? 'Ground-level interior survey' : 'Upper-level interior survey', 'Floor-level start · drag to pan · pinch to change distance');
  }

  function openSurvey() {
    if (layers.furniture.state !== 'ready') return;
    if (!surveyMode) lastOperationalViewId = chassis.getView(currentViewId)?.surveyOnly ? 'entry-ground' : currentViewId;
    surveyMode = true;
    phone.panel.hidden = true;
    media.panel.hidden = true;
    suite.panel.hidden = true;
    upper.panel.hidden = true;
    garage.panel.hidden = true;
    atc.panel.hidden = true;
    system.panel.hidden = true;
    kitchen.panel.hidden = true;
    survey.panel.hidden = false;
    selectSurveyLevel('ground');
    updateButtons();
    publishChassisState();
  }

  function closeSurvey() {
    if (!surveyMode) return;
    surveyMode = false;
    survey.panel.hidden = true;
    const restoreId = chassis.getView(lastOperationalViewId) ? lastOperationalViewId : 'entry-ground';
    applyView(restoreId, false, true);
    setStatus('Survey closed', chassis.getView(restoreId).label + ' · resident state unchanged');
    updateButtons();
    publishChassisState();
  }

  function stepSurvey(direction) {
    if (!surveyMode) return;
    const order = surveyViewOrder[surveyLevel];
    const currentIndex = order.indexOf(currentViewId);
    const base = currentIndex < 0 ? 0 : currentIndex;
    const nextIndex = (base + direction + order.length) % order.length;
    applySurveyView(order[nextIndex], true);
    updateSurveyPanel();
  }

  function applyView(id, announce, persist = !surveyMode) {
    const view = chassis.getView(id);
    if (!view) throw new Error('Unknown sanctuary view: ' + id);
    currentViewId = id;
    if (id !== E5_GROUND_MEDIA.zone) media.panel.hidden = true;
    if (!E6_PRIMARY_SUITE.zones.includes(id)) suite.panel.hidden = true;
    if (!E7_UPPER_WING.zones.includes(id)) upper.panel.hidden = true;
    if (id !== E8_TECH_BAY.zone) garage.panel.hidden = true;
    if (!E10_1_ATC_ACCESS.zones.includes(id)) atc.panel.hidden = true;
    orbit.yaw = view.yaw;
    orbit.pitch = view.pitch;
    orbit.distance = view.distance;
    orbit.fov = view.fov || chassis.manifest.camera.defaultFov;
    orbit.target.set(view.target[0], view.target[1], view.target[2]);
    if (persist && !view.surveyOnly) {
      lastOperationalViewId = id;
      const worldChanges = { mode: view.zone === 'exterior' ? 'exterior' : 'interior', currentView: id };
      if (view.zone !== 'exterior') worldChanges.lastInteriorView = id;
      commitWorld(worldChanges, 'view-changed');
    }
    updateCamera();
    publishChassisState();
    updateSurveyPanel();
    updateButtons();
    if (announce) setStatus('View: ' + view.label, 'Registered route · collision envelope active');
  }

  function resetView() {
    const view = chassis.getView(currentViewId);
    applyView(currentViewId, false);
    setStatus('View recovered', view.label + ' · registered safe anchor restored');
  }

  function fitRoom() {
    const view = chassis.getView(currentViewId);
    if (!view || !view.fitDistance) return false;
    orbit.distance = view.fitDistance;
    orbit.fov = chassis.manifest.camera.fitFov;
    fitRoomUses += 1;
    updateCamera();
    setStatus(view.zone === 'exterior' ? 'Exterior framed' : 'Room framed', view.label + ' · expanded distance ' + orbit.distance.toFixed(1) + ' · reset remains available');
    publishChassisState();
    return true;
  }

  function nextSpace() {
    const currentView = chassis.getView(currentViewId);
    const order = currentView?.zone === 'exterior' ? exteriorViewOrder : interiorViewOrder;
    const currentIndex = order.indexOf(currentViewId);
    const nextId = order[(currentIndex + 1 + order.length) % order.length];
    const route = chassis.shortestRoute(currentViewId, nextId);
    if (!route) {
      fail('No registered route from ' + currentViewId + ' to ' + nextId + '.');
      return;
    }
    applyView(nextId, true);
  }

  function enterProperty() {
    if (layers.interior.state === 'ready' && layers.furniture.state === 'ready') {
      applyView('entry-ground', true);
      return;
    }
    enqueue(['interior', 'furniture']);
  }

  function updateCamera() {
    const camera = app.root.findByName('Camera');
    const view = chassis.getView(currentViewId);
    orbit.distance = pc.math.clamp(orbit.distance, view.minDistance, view.maxDistance);
    orbit.fov = pc.math.clamp(orbit.fov, chassis.manifest.camera.minFov, chassis.manifest.camera.maxFov);
    if (camera.camera) camera.camera.fov = orbit.fov;
    const yaw = orbit.yaw * Math.PI / 180;
    const pitch = orbit.pitch * Math.PI / 180;
    const candidate = {
      x: orbit.target.x + orbit.distance * Math.sin(yaw) * Math.cos(pitch),
      y: orbit.target.y - orbit.distance * Math.sin(pitch),
      z: orbit.target.z + orbit.distance * Math.cos(yaw) * Math.cos(pitch)
    };
    const safe = chassis.constrainPoint(candidate, view.zone);
    actualCameraDistance = Math.hypot(safe.x - orbit.target.x, safe.y - orbit.target.y, safe.z - orbit.target.z);
    camera.setPosition(safe.x, safe.y, safe.z);
    camera.lookAt(orbit.target);
    requestRender();
    publishPreflightState();
  }

  function installNavigation() {
    const pointers = new Map();
    let dragId = null, x = 0, y = 0, pinch = 0;

    function pointerDistance() {
      if (pointers.size < 2) return 0;
      const points = Array.from(pointers.values());
      return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
    }

    canvas.addEventListener('pointerdown', e => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        dragId = e.pointerId;
        x = e.clientX;
        y = e.clientY;
      } else if (pointers.size === 2) {
        dragId = null;
        pinch = pointerDistance();
      }
      canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    canvas.addEventListener('pointermove', e => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size >= 2) {
        const next = pointerDistance();
        if (pinch && next > 0) orbit.distance *= pinch / next;
        pinch = next;
        updateCamera();
        e.preventDefault();
        return;
      }
      if (dragId !== e.pointerId) return;
      const view = chassis.getView(currentViewId);
      const dx = e.clientX - x;
      const dy = e.clientY - y;
      if (surveyMode) {
        const yaw = orbit.yaw * Math.PI / 180;
        const scale = Math.max(0.006, orbit.distance * 0.0022);
        const candidate = {
          x: orbit.target.x - dx * scale * Math.cos(yaw) + dy * scale * Math.sin(yaw),
          y: surveyLevel === 'ground' ? 1.45 : 5.45,
          z: orbit.target.z + dx * scale * Math.sin(yaw) + dy * scale * Math.cos(yaw)
        };
        const bounded = chassis.constrainPoint(candidate, surveyLevel);
        orbit.target.set(bounded.x, candidate.y, bounded.z);
      } else {
        orbit.yaw -= dx * 0.28;
        orbit.pitch = pc.math.clamp(orbit.pitch - dy * 0.22, view.zone === 'exterior' ? -75 : -20, view.zone === 'exterior' ? 25 : 12);
      }
      x = e.clientX;
      y = e.clientY;
      updateCamera();
      e.preventDefault();
    });
    const releasePointer = e => {
      pointers.delete(e.pointerId);
      pinch = 0;
      if (pointers.size === 1) {
        const [id, point] = pointers.entries().next().value;
        dragId = id;
        x = point.x;
        y = point.y;
      } else if (pointers.size === 0) {
        dragId = null;
      }
      e.preventDefault();
    };
    canvas.addEventListener('pointerup', releasePointer);
    canvas.addEventListener('pointercancel', releasePointer);
    canvas.addEventListener('wheel', e => { e.preventDefault(); orbit.distance += e.deltaY * 0.015; updateCamera(); }, { passive: false });
  }

  function initialize() {
    if (!window.pc) throw new Error('Local PlayCanvas Engine did not load.');
    if (!chassis) throw new Error('Local sanctuary chassis did not load.');
    if (!core) throw new Error('Local Intelligence Core did not load.');
    if (!pilot) throw new Error('Local pilot-resident contract did not load.');
    if (!autonomy) throw new Error('Local autonomous-life contract did not load.');
    if (!arbiter) throw new Error('Local deterministic intent arbiter did not load.');
    const chassisErrors = chassis.validate();
    if (chassisErrors.length) throw new Error('Sanctuary chassis invalid: ' + chassisErrors.join(' '));
    app = new pc.Application(canvas, {
      graphicsDeviceOptions: { antialias: true, alpha: false, preserveDrawingBuffer: false }
    });
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_FIXED, Math.max(1, innerWidth), Math.max(1, innerHeight));
    app.autoRender = false;
    app.scene.ambientLight = new pc.Color(0.22, 0.25, 0.28);

    initializeCoreState();
    publishE2State(false);
    publishE3State(false);
    publishKitchenEquipmentState(false);
    publishE4State(false);
    publishE5State(false);
    publishE6State(false);
    publishE7State(false);
    publishE8State(false);
    publishE9ExteriorState(false);

    root = new pc.Entity('Living Observatory - Staged Property');
    root.setLocalScale(MANIFEST.worldScale, MANIFEST.worldScale, MANIFEST.worldScale);
    app.root.addChild(root);

    const camera = new pc.Entity('Camera');
    camera.addComponent('camera', { clearColor: new pc.Color(0.035, 0.065, 0.08), farClip: 5000, fov: 50 });
    app.root.addChild(camera);
    const light = new pc.Entity('Sun');
    light.addComponent('light', { type: 'directional', color: new pc.Color(1, 0.96, 0.88), intensity: 1.4, castShadows: false });
    light.setEulerAngles(45, 35, 0);
    app.root.addChild(light);

    registerLayers();
    installNavigation();
    bindTap(controls.enter, enterProperty);
    bindTap(controls.space, activateSpaceControl);
    bindTap(controls.decor, () => {
      if (!coreState.worldState.decorEnabled) commitWorld({ decorEnabled: true }, 'decor-requested');
      enqueue(['decor']);
    });
    bindTap(controls.phone, () => {
      media.panel.hidden = true;
      suite.panel.hidden = true;
      upper.panel.hidden = true;
      garage.panel.hidden = true;
      atc.panel.hidden = true;
      system.panel.hidden = true;
      kitchen.panel.hidden = true;
      updatePhone();
      phone.panel.hidden = false;
    });
    bindTap(controls.media, openMediaControls);
    bindTap(controls.suite, openSuiteControls);
    bindTap(controls.upper, openUpperControls);
    bindTap(controls.garage, openGarageControls);
    bindTap(controls.atc, openATCControls);
    bindTap(controls.survey, activateSurveyControl);
    bindTap(controls.system, commissionHouseAndOpenStatus);
    bindTap(controls.kitchen, openKitchenStatus);
    bindTap(controls.fit, fitRoom);
    bindTap(survey.ground, () => selectSurveyLevel('ground'));
    bindTap(survey.upper, () => selectSurveyLevel('upper'));
    bindTap(survey.previous, () => stepSurvey(-1));
    bindTap(survey.next, () => stepSurvey(1));
    bindTap(survey.close, closeSurvey);
    bindTap(system.close, () => { system.panel.hidden = true; });
    bindTap(kitchen.close, () => { kitchen.panel.hidden = true; });
    bindTap(phone.close, () => { phone.panel.hidden = true; });
    bindTap(phone.call, callResident);
    bindTap(phone.autonomy, startAutonomousLife);
    bindTap(phone.pause, pauseAutonomousLife);
    bindTap(phone.stop, () => stopAutomation('owner-phone'));
    bindTap(media.off, () => applyOwnerEnvironment('media', 'off', setMediaMode));
    bindTap(media.ambient, () => applyOwnerEnvironment('media', 'ambient', setMediaMode));
    bindTap(media.cinema, () => applyOwnerEnvironment('media', 'cinema', setMediaMode));
    bindTap(media.close, () => { media.panel.hidden = true; });
    bindTap(suite.rest, () => applyOwnerEnvironment('suite', 'rest', setSuiteScene));
    bindTap(suite.sunrise, () => applyOwnerEnvironment('suite', 'sunrise', setSuiteScene));
    bindTap(suite.spa, () => applyOwnerEnvironment('suite', 'spa', setSuiteScene));
    bindTap(suite.terrace, () => applyOwnerEnvironment('suite', 'terrace', setSuiteScene));
    bindTap(suite.close, () => { suite.panel.hidden = true; });
    bindTap(upper.focus, () => applyOwnerEnvironment('upper', 'focus', setUpperMode));
    bindTap(upper.read, () => applyOwnerEnvironment('upper', 'read', setUpperMode));
    bindTap(upper.guest, () => applyOwnerEnvironment('upper', 'guest', setUpperMode));
    bindTap(upper.night, () => applyOwnerEnvironment('upper', 'night', setUpperMode));
    bindTap(upper.close, () => { upper.panel.hidden = true; });
    bindTap(garage.arrival, () => applyOwnerEnvironment('garage', 'arrival', setGarageMode));
    bindTap(garage.charge, () => applyOwnerEnvironment('garage', 'charge', setGarageMode));
    bindTap(garage.display, () => applyOwnerEnvironment('garage', 'display', setGarageMode));
    bindTap(garage.service, () => applyOwnerEnvironment('garage', 'service', setGarageMode));
    bindTap(garage.close, () => { garage.panel.hidden = true; });
    bindTap(atc.check, checkATCStatus);
    bindTap(atc.emailTest, () => runATCEmailTransportTest('owner-control'));
    bindTap(atc.cue, issueATCFaxDing);
    bindTap(atc.call, callAveryFromATC);
    bindTap(atc.close, () => { atc.panel.hidden = true; });
    bindTap(controls.exit, exitProperty);
    bindTap(controls.reset, resetView);
    window.addEventListener('resize', () => { app.resizeCanvas(); requestRender(); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutomation('page-hidden', false);
    });
    window.addEventListener('pagehide', () => { stopAutomation('pagehide', false); });
    canvas.addEventListener('webglcontextlost', e => {
      e.preventDefault();
      stopAutomation('webgl-context-lost', false);
      setStatus('Graphics paused', 'WebGL context lost; automation stopped safely while waiting for recovery');
    });
    canvas.addEventListener('webglcontextrestored', () => { setStatus('Graphics restored'); requestRender(); });

    app.start();
    app.on('update', dt => { recordPerformanceSample(dt); updateResident(dt); updateAutonomy(dt); updateATCAccess(dt); });
    applyView('exterior-overview', false);
    enqueue(['exterior']);
  }

  try { initialize(); } catch (error) { fail(error.message || String(error)); }
}());
