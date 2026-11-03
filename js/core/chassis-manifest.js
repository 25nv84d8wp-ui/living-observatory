/* global window */
(function (global) {
  'use strict';

  const manifest = {
    version: '11.2-atc-fax-ding-email-orientation',
    propertyBounds: { min: [-2.42, -0.32, -3.22], max: [43.50, 8.94, 35.00] },
    camera: {
      defaultFov: 50,
      fitFov: 62,
      minFov: 45,
      maxFov: 68
    },
    zones: {
      exterior: { min: [-18, -1, -18], max: [38, 20, 45] },
      ground: { min: [-1.35, 1.05, 0.55], max: [17.85, 2.8, 22.55] },
      upper: { min: [-1.25, 4.95, 0.55], max: [17.85, 6.8, 22.55] },
      atc: { min: [17.20, 0.90, 13.20], max: [43.20, 3.80, 34.80] },
      groundSurvey: { min: [-4, 0.6, -3], max: [21, 18, 27] },
      upperSurvey: { min: [-4, 4.2, -3], max: [21, 21, 27] }
    },
    navigation: {
      operational: ['entry-ground', 'living-ground', 'dining-ground', 'media-ground', 'garage-ground', 'atc-access-ground', 'atc-ground', 'atc-workshop-ground', 'atc-annex-ground', 'atc-teleporter-ground', 'atc-tme-ground', 'landing-upper', 'lounge-upper', 'workspace-upper', 'office-upper', 'shared-bath-upper', 'bedroom-upper', 'dressing-upper', 'primary-bath-upper', 'terrace-upper'],
      exterior: ['exterior-overview', 'exterior-arrival', 'exterior-waterfront', 'exterior-fire-court', 'exterior-night-garden'],
      survey: {
        ground: ['survey-ground', 'kitchen-ground', 'culinary-support-ground', 'living-ground', 'dining-ground', 'entry-ground', 'media-ground', 'bath-service-ground', 'garage-ground', 'atc-access-ground', 'atc-ground', 'atc-workshop-ground', 'atc-annex-ground', 'atc-teleporter-ground', 'atc-tme-ground'],
        upper: ['survey-upper', 'landing-upper', 'lounge-upper', 'workspace-upper', 'office-upper', 'shared-bath-upper', 'bedroom-upper', 'dressing-upper', 'primary-bath-upper', 'terrace-upper']
      }
    },
    roomRegistry: {
      ground: [
        'Entry and stair — confirmed',
        'Chef kitchen zone — confirmed; future full redesign',
        'Culinary support / flex zone — confirmed as a separate review destination',
        'Living zone — E4 furnished and registered',
        'Dining zone — E4 furnished and registered',
        'Media room — E5 complete and owner-controlled',
        'Garage technology bay — E8 complete with one expandable luxury vehicle shell',
        'ATC enclosed access passage and controlled revolving entry — retained reversible construction',
        'Advanced Technology Center — expanded provisional restoration with five registered functional zones',
        'Bath/service zone — material evidence confirmed; exact function remains visibly marked provisional'
      ],
      upper: [
        'Landing and circulation — confirmed',
        'Upper observatory lounge — E7 complete and owner-controlled',
        'Upper study / creative workspace — E7 complete and owner-controlled',
        'Guest suite — E7 complete; no second resident introduced',
        'Upper shared bath — E7 complete and operational',
        'Primary bedroom — E6 complete and scene-controlled',
        'Primary dressing gallery — E6 complete and operational',
        'Primary spa bath — E6 complete and operational',
        'Private terrace — E6 complete and scene-controlled'
      ]
    },
    views: [
      { id: 'exterior-overview', label: 'Exterior Overview', zone: 'exterior', residentAccessible: false, target: [8.1, 2.8, 11.5], yaw: 35, pitch: -18, distance: 31, minDistance: 14, maxDistance: 42, fitDistance: 36 },
      { id: 'exterior-arrival', label: 'Exterior Arrival Court', zone: 'exterior', residentAccessible: false, target: [7.8, 0.7, -1.6], yaw: 178, pitch: -8, distance: 14, minDistance: 6, maxDistance: 22, fitDistance: 18 },
      { id: 'exterior-waterfront', label: 'Exterior Coastal Water Terrace', zone: 'exterior', residentAccessible: false, target: [-0.7, 0.35, 12.0], yaw: 265, pitch: -7, distance: 14, minDistance: 6, maxDistance: 24, fitDistance: 19 },
      { id: 'exterior-fire-court', label: 'Exterior Fire Court', zone: 'exterior', residentAccessible: false, target: [21.0, 0.55, 10.5], yaw: 88, pitch: -6, distance: 10, minDistance: 5, maxDistance: 18, fitDistance: 14 },
      { id: 'exterior-night-garden', label: 'Exterior Night Garden', zone: 'exterior', residentAccessible: false, target: [8.2, 0.45, 29.0], yaw: 2, pitch: -6, distance: 13, minDistance: 6, maxDistance: 22, fitDistance: 17 },
      { id: 'survey-ground', label: 'Ground-Level Interior Start', zone: 'ground', level: 'ground', surveyOnly: true, residentAccessible: false, target: [5.6, 1.55, 13.75], yaw: 178, pitch: -2, distance: 2.3, minDistance: 1.5, maxDistance: 12, fitDistance: 9.5 },
      { id: 'survey-upper', label: 'Upper-Level Interior Start', zone: 'upper', level: 'upper', surveyOnly: true, residentAccessible: false, target: [8.4, 5.45, 10.2], yaw: 25, pitch: -3, distance: 2.6, minDistance: 1.6, maxDistance: 12, fitDistance: 9.5 },
      { id: 'entry-ground', label: 'Ground Entry and Stair', zone: 'ground', level: 'ground', target: [5.6, 1.55, 13.75], yaw: 178, pitch: -2, distance: 2.1, minDistance: 1.5, maxDistance: 10, fitDistance: 7.5 },
      { id: 'kitchen-ground', label: 'Ground Chef Kitchen Zone', zone: 'ground', level: 'ground', surveyOnly: true, residentAccessible: false, target: [2.2, 1.45, 3.2], yaw: 35, pitch: -5, distance: 2.6, minDistance: 1.6, maxDistance: 11, fitDistance: 8.5 },
      { id: 'culinary-support-ground', label: 'Ground Culinary Support / Flex Zone', zone: 'ground', level: 'ground', surveyOnly: true, residentAccessible: false, target: [1.6, 1.45, 6.1], yaw: 35, pitch: -4, distance: 2.5, minDistance: 1.6, maxDistance: 10, fitDistance: 7.5 },
      { id: 'living-ground', label: 'Ground Living', zone: 'ground', level: 'ground', target: [9.1, 1.45, 4.0], yaw: 32, pitch: -3, distance: 2.4, minDistance: 1.6, maxDistance: 12, fitDistance: 9 },
      { id: 'dining-ground', label: 'Ground Dining', zone: 'ground', level: 'ground', target: [13.5, 1.45, 3.2], yaw: 215, pitch: -4, distance: 2.7, minDistance: 1.7, maxDistance: 11, fitDistance: 8 },
      { id: 'media-ground', label: 'Ground Media Room', zone: 'ground', level: 'ground', target: [1.25, 1.5, 12.3], yaw: 88, pitch: -3, distance: 2.2, minDistance: 1.5, maxDistance: 9, fitDistance: 7 },
      { id: 'bath-service-ground', label: 'Ground Bath / Service Review Zone', zone: 'ground', level: 'ground', surveyOnly: true, residentAccessible: false, provisional: true, target: [5.0, 1.45, 8.5], yaw: 90, pitch: -4, distance: 2.4, minDistance: 1.5, maxDistance: 8, fitDistance: 5.8 },
      { id: 'garage-ground', label: 'Garage Technology Bay', zone: 'ground', level: 'ground', canonicalRoomId: 'garage-technology-bay-ground', target: [14.1, 1.45, 21.4], yaw: 180, pitch: -5, distance: 3.6, minDistance: 1.8, maxDistance: 11, fitDistance: 8 },
      { id: 'atc-access-ground', label: 'ATC Enclosed Access Passage', zone: 'atc', level: 'ground', canonicalRoomId: 'atc-access-passage-ground', target: [18.75, 1.45, 23.40], yaw: 90, pitch: -3, distance: 2.8, minDistance: 1.6, maxDistance: 8, fitDistance: 6 },
      { id: 'atc-ground', label: 'ATC Professional Work Area', zone: 'atc', level: 'ground', canonicalRoomId: 'advanced-technology-center', provisional: true, target: [29.0, 1.45, 22.40], yaw: 90, pitch: -5, distance: 7.2, minDistance: 2.0, maxDistance: 18, fitDistance: 13.5 },
      { id: 'atc-workshop-ground', label: 'ATC Bridge Diagnostic Workshop', zone: 'atc', level: 'ground', canonicalRoomId: 'atc-bridge-diagnostic-workshop', provisional: true, target: [25.0, 1.35, 17.20], yaw: 40, pitch: -5, distance: 5.6, minDistance: 2.0, maxDistance: 14, fitDistance: 10.5 },
      { id: 'atc-annex-ground', label: 'ATC Research Operations Annex', zone: 'atc', level: 'ground', canonicalRoomId: 'atc-research-operations-annex', provisional: true, target: [36.7, 1.40, 25.3], yaw: 220, pitch: -5, distance: 6.2, minDistance: 2.0, maxDistance: 15, fitDistance: 11.5 },
      { id: 'atc-teleporter-ground', label: 'ATC Protected Teleporter Area', zone: 'atc', level: 'ground', canonicalRoomId: 'atc-teleporter-custody-zone', provisional: true, target: [25.0, 1.35, 30.2], yaw: 15, pitch: -6, distance: 5.0, minDistance: 2.0, maxDistance: 13, fitDistance: 9.5 },
      { id: 'atc-tme-ground', label: 'ATC Sealed TME-00 Enclosure', zone: 'atc', level: 'ground', canonicalRoomId: 'tme-00-sealed-observation-enclosure', provisional: true, target: [38.5, 1.40, 30.5], yaw: 205, pitch: -5, distance: 5.0, minDistance: 2.0, maxDistance: 13, fitDistance: 9.5 },
      { id: 'landing-upper', label: 'Upper Landing', zone: 'upper', level: 'upper', target: [8.4, 5.45, 10.2], yaw: 25, pitch: -3, distance: 2.4, minDistance: 1.6, maxDistance: 10, fitDistance: 7 },
      { id: 'office-upper', label: 'Upper Guest Suite', zone: 'upper', level: 'upper', canonicalRoomId: 'guest-suite-upper', target: [14.2, 5.45, 3.0], yaw: 145, pitch: -3, distance: 2.2, minDistance: 1.5, maxDistance: 9, fitDistance: 6.8 },
      { id: 'workspace-upper', label: 'Upper Observatory Study', zone: 'upper', level: 'upper', canonicalRoomId: 'observatory-study-upper', target: [5.2, 5.45, 2.8], yaw: 145, pitch: -3, distance: 2.4, minDistance: 1.5, maxDistance: 10, fitDistance: 7 },
      { id: 'lounge-upper', label: 'Upper Observatory Lounge', zone: 'upper', level: 'upper', canonicalRoomId: 'observatory-lounge-upper', target: [0.2, 5.45, 12.8], yaw: 30, pitch: -4, distance: 2.6, minDistance: 1.6, maxDistance: 11, fitDistance: 8 },
      { id: 'shared-bath-upper', label: 'Upper Shared Bath', zone: 'upper', level: 'upper', canonicalRoomId: 'shared-bath-upper', target: [6.8, 5.45, 6.2], yaw: 40, pitch: -4, distance: 2.4, minDistance: 1.5, maxDistance: 8, fitDistance: 5.8 },
      { id: 'bedroom-upper', label: 'Primary Bedroom Retreat', zone: 'upper', level: 'upper', canonicalRoomId: 'primary-bedroom-upper', target: [16.1, 5.45, 14.1], yaw: 215, pitch: -3, distance: 2.3, minDistance: 1.5, maxDistance: 10, fitDistance: 7.5 },
      { id: 'dressing-upper', label: 'Primary Dressing Gallery', zone: 'upper', level: 'upper', canonicalRoomId: 'primary-dressing-upper', target: [16.0, 5.45, 11.2], yaw: 180, pitch: -4, distance: 2.4, minDistance: 1.5, maxDistance: 8.5, fitDistance: 6 },
      { id: 'primary-bath-upper', label: 'Primary Spa Bath', zone: 'upper', level: 'upper', canonicalRoomId: 'primary-bath-upper', target: [12.4, 5.45, 8.0], yaw: 195, pitch: -4, distance: 2.6, minDistance: 1.6, maxDistance: 9, fitDistance: 6.5 },
      { id: 'terrace-upper', label: 'Private Coastal Terrace', zone: 'upper', level: 'upper', canonicalRoomId: 'primary-terrace-upper', target: [14.8, 5.35, 20.3], yaw: 195, pitch: -5, distance: 2.5, minDistance: 1.7, maxDistance: 12, fitDistance: 8.5 }
    ],
    portals: [
      { id: 'exterior-overview-arrival', from: 'exterior-overview', to: 'exterior-arrival' },
      { id: 'exterior-overview-waterfront', from: 'exterior-overview', to: 'exterior-waterfront' },
      { id: 'exterior-overview-fire-court', from: 'exterior-overview', to: 'exterior-fire-court' },
      { id: 'exterior-overview-night-garden', from: 'exterior-overview', to: 'exterior-night-garden' },
      { id: 'front-entry', from: 'exterior-arrival', to: 'entry-ground', entity: 'SM_ext_door02' },
      { id: 'fire-court-terrace', from: 'exterior-fire-court', to: 'terrace-upper' },
      { id: 'survey-ground-entry', from: 'survey-ground', to: 'entry-ground' },
      { id: 'survey-upper-landing', from: 'survey-upper', to: 'landing-upper' },
      { id: 'entry-kitchen', from: 'entry-ground', to: 'kitchen-ground' },
      { id: 'kitchen-culinary-support', from: 'kitchen-ground', to: 'culinary-support-ground' },
      { id: 'entry-living', from: 'entry-ground', to: 'living-ground' },
      { id: 'living-dining', from: 'living-ground', to: 'dining-ground' },
      { id: 'entry-media', from: 'entry-ground', to: 'media-ground', entity: 'SM_int_door01' },
      { id: 'entry-bath-service', from: 'entry-ground', to: 'bath-service-ground' },
      { id: 'entry-garage', from: 'entry-ground', to: 'garage-ground', entity: 'SM_garage_door01' },
      { id: 'garage-atc-access-passage', from: 'garage-ground', to: 'atc-access-ground', entity: 'TLO_ATC_Service_Passage' },
      { id: 'atc-revolving-entry', from: 'atc-access-ground', to: 'atc-ground', entity: 'TLO_ATC_Controlled_Revolving_Entry' },
      { id: 'atc-work-area-workshop', from: 'atc-ground', to: 'atc-workshop-ground' },
      { id: 'atc-work-area-annex', from: 'atc-ground', to: 'atc-annex-ground' },
      { id: 'atc-workshop-teleporter', from: 'atc-workshop-ground', to: 'atc-teleporter-ground' },
      { id: 'atc-annex-tme', from: 'atc-annex-ground', to: 'atc-tme-ground' },
      { id: 'atc-teleporter-tme', from: 'atc-teleporter-ground', to: 'atc-tme-ground' },
      { id: 'living-stairs', from: 'living-ground', to: 'landing-upper' },
      { id: 'landing-office', from: 'landing-upper', to: 'office-upper' },
      { id: 'landing-workspace', from: 'landing-upper', to: 'workspace-upper' },
      { id: 'landing-lounge', from: 'landing-upper', to: 'lounge-upper' },
      { id: 'landing-shared-bath', from: 'landing-upper', to: 'shared-bath-upper' },
      { id: 'lounge-workspace', from: 'lounge-upper', to: 'workspace-upper' },
      { id: 'workspace-guest-suite', from: 'workspace-upper', to: 'office-upper' },
      { id: 'guest-suite-shared-bath', from: 'office-upper', to: 'shared-bath-upper' },
      { id: 'landing-bedroom', from: 'landing-upper', to: 'bedroom-upper' },
      { id: 'bedroom-dressing', from: 'bedroom-upper', to: 'dressing-upper' },
      { id: 'dressing-primary-bath', from: 'dressing-upper', to: 'primary-bath-upper' },
      { id: 'primary-bath-terrace', from: 'primary-bath-upper', to: 'terrace-upper' },
      { id: 'landing-terrace', from: 'landing-upper', to: 'terrace-upper', entity: 'SM_ext_door02.002' }
    ]
  };

  const interactionRules = [
    ['portal', /door|garage/i],
    ['sleep', /bed/i],
    ['sit', /sofa|chair|stool|ottoman/i],
    ['surface', /table|desk/i],
    ['media', /television|tvunit|monitor/i],
    ['storage', /cabinet|cupboard|drawer|shelf|bookshelf/i],
    ['light', /lamp|ceilinglight/i],
    ['groom', /mirror|vanity|wardrobe|closet/i],
    ['bathe', /tub|shower|rainfall/i],
    ['outdoor', /fire|water|planter/i],
    ['decor', /plant|bush|vase|bowl|picture|walldecor|rug|curtain/i]
  ];

  const viewMap = Object.fromEntries(manifest.views.map(view => [view.id, view]));

  function neighbors(id) {
    const result = [];
    manifest.portals.forEach(portal => {
      if (portal.from === id) result.push(portal.to);
      if (portal.to === id) result.push(portal.from);
    });
    return result;
  }

  function shortestRoute(from, to) {
    if (!viewMap[from] || !viewMap[to]) return null;
    const queue = [[from]];
    const visited = new Set([from]);
    while (queue.length) {
      const route = queue.shift();
      const last = route[route.length - 1];
      if (last === to) return route;
      neighbors(last).forEach(next => {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(route.concat(next));
        }
      });
    }
    return null;
  }

  function constrainPoint(point, zoneId) {
    const zone = manifest.zones[zoneId];
    if (!zone) throw new Error('Unknown chassis zone: ' + zoneId);
    return {
      x: Math.max(zone.min[0], Math.min(zone.max[0], point.x)),
      y: Math.max(zone.min[1], Math.min(zone.max[1], point.y)),
      z: Math.max(zone.min[2], Math.min(zone.max[2], point.z))
    };
  }

  function classifyEntity(name) {
    for (const [kind, pattern] of interactionRules) {
      if (pattern.test(name || '')) return kind;
    }
    return null;
  }

  function resolveInteriorEntry(currentId, rememberedId) {
    const current = viewMap[currentId];
    if (!current || current.zone !== 'exterior') return currentId;
    const remembered = viewMap[rememberedId];
    return remembered && remembered.zone !== 'exterior' && !remembered.surveyOnly ? rememberedId : 'entry-ground';
  }

  function validate() {
    const errors = [];
    manifest.views.forEach(view => {
      if (!manifest.zones[view.zone]) errors.push('View ' + view.id + ' has no zone.');
      if (view.minDistance > view.maxDistance) errors.push('View ' + view.id + ' has invalid distance limits.');
    });
    manifest.portals.forEach(portal => {
      if (!viewMap[portal.from] || !viewMap[portal.to]) errors.push('Portal ' + portal.id + ' has an invalid endpoint.');
    });
    manifest.views.forEach(view => {
      if (!shortestRoute('exterior-overview', view.id)) errors.push('View ' + view.id + ' is unreachable.');
    });
    const orders = [manifest.navigation.operational, manifest.navigation.exterior, manifest.navigation.survey.ground, manifest.navigation.survey.upper];
    orders.forEach((order, index) => {
      if (new Set(order).size !== order.length) errors.push('Navigation order ' + index + ' contains duplicates.');
      order.forEach(id => {
        if (!viewMap[id]) errors.push('Navigation order ' + index + ' references unknown view ' + id + '.');
      });
    });
    manifest.views.filter(view => view.fitDistance != null).forEach(view => {
      if (!(view.fitDistance > view.distance && view.fitDistance <= view.maxDistance)) errors.push('View ' + view.id + ' has invalid fit distance.');
    });
    return errors;
  }

  global.LivingObservatoryChassis = Object.freeze({
    manifest,
    getView(id) { return viewMap[id] || null; },
    shortestRoute,
    constrainPoint,
    classifyEntity,
    resolveInteriorEntry,
    validate
  });
}(window));
