// Centralized APEX R-01 vehicle catalog, option definitions, camera presets, and demo specifications.
// All prices are illustrative demonstration values in INR (₹) and configurable here.

export const VEHICLE_INFO = {
  id: 'apex-r01',
  brand: 'APEX MOTORS',
  name: 'APEX R-01',
  tagline: 'Sculpted by Aerodynamics. Driven by Obsession.',
  modelYear: 2026,
  currency: 'INR',
  basePrice: 35000000, // ₹3,50,00,000
  glbAssetPath: '/models/apex-r01.glb',
  audioAssetPath: '/sounds/engine-start.mp3',
  schemaVersion: 1,
};

export const PAINT_COLORS = [
  { id: 'racing-red', name: 'Racing Red', hex: '#c8102e', price: 0, tier: 'Standard' },
  { id: 'metallic-orange', name: 'Metallic Orange', hex: '#e85d04', price: 350000, tier: 'Metallic' },
  { id: 'midnight-black', name: 'Midnight Black', hex: '#101216', price: 0, tier: 'Standard' },
  { id: 'pearl-white', name: 'Pearl White', hex: '#edeff2', price: 250000, tier: 'Pearl' },
  { id: 'titanium-silver', name: 'Titanium Silver', hex: '#9ea6b2', price: 200000, tier: 'Metallic' },
  { id: 'electric-blue', name: 'Electric Blue', hex: '#0066ff', price: 400000, tier: 'Metallic' },
  { id: 'racing-green', name: 'Racing Green', hex: '#0d4a2b', price: 350000, tier: 'Heritage' },
  { id: 'champagne-gold', name: 'Champagne Gold', hex: '#c7a970', price: 450000, tier: 'Bespoke' },
  { id: 'graphite-grey', name: 'Graphite Grey', hex: '#3e444e', price: 150000, tier: 'Standard' },
  { id: 'deep-purple', name: 'Deep Purple', hex: '#3c1361', price: 500000, tier: 'Bespoke' },
  { id: 'sunset-yellow', name: 'Sunset Yellow', hex: '#f4b400', price: 380000, tier: 'Track' },
  { id: 'arctic-blue', name: 'Arctic Blue', hex: '#6fb3d2', price: 320000, tier: 'Metallic' },
  { id: 'bronze', name: 'Bronze', hex: '#7a5230', price: 420000, tier: 'Bespoke' },
  { id: 'matte-black', name: 'Matte Black', hex: '#181a1f', price: 550000, tier: 'Stealth', defaultFinish: 'matte' },
  { id: 'emerald-carbon', name: 'Emerald Carbon', hex: '#0b5d46', price: 650000, tier: 'Bespoke' },
  { id: 'custom', name: 'Custom Color', hex: '#d92638', price: 850000, tier: 'Atelier' },
];

export const PAINT_FINISHES = [
  {
    id: 'gloss',
    name: 'Gloss',
    price: 0,
    roughness: 0.14,
    metalness: 0.35,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    description: 'Deep wet-look multi-stage lacquer',
  },
  {
    id: 'metallic',
    name: 'Metallic',
    price: 250000,
    roughness: 0.18,
    metalness: 0.85,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    description: 'Micro-flake aluminum depth under clearcoat',
  },
  {
    id: 'satin',
    name: 'Satin',
    price: 420000,
    roughness: 0.36,
    metalness: 0.55,
    clearcoat: 0.3,
    clearcoatRoughness: 0.35,
    description: 'Silky low-sheen architectural finish',
  },
  {
    id: 'matte',
    name: 'Matte',
    price: 500000,
    roughness: 0.68,
    metalness: 0.2,
    clearcoat: 0.05,
    clearcoatRoughness: 0.7,
    description: 'Stealth flat non-reflective clearcoat',
  },
];

export const WHEEL_OPTIONS = [
  { id: 'aero-5', name: 'Apex Aero 5-Spoke', size: '20" / 21"', spokes: 5, style: 'blade', price: 0 },
  { id: 'forged-y10', name: 'Forged Y-Spoke 10', size: '20" / 21"', spokes: 10, style: 'y-spoke', price: 450000 },
  { id: 'carbon-turbine', name: 'Carbon Turbine', size: '20" / 21"', spokes: 12, style: 'turbine', price: 950000 },
  { id: 'monoblock-7', name: 'Center-Lock Monoblock 7', size: '21" / 22"', spokes: 7, style: 'monoblock', price: 680000 },
  { id: 'mesh-gt', name: 'Track Mesh GT', size: '20" / 21"', spokes: 14, style: 'mesh', price: 540000 },
  { id: 'magnesium-aero', name: 'Magnesium Aero Disc', size: '21" / 22"', spokes: 6, style: 'disc', price: 1150000 },
];

export const WHEEL_FINISHES = [
  { id: 'machined-silver', name: 'Machined Silver', hex: '#cfd5de', roughness: 0.22, metalness: 0.92, price: 0 },
  { id: 'satin-black', name: 'Satin Black', hex: '#1a1d22', roughness: 0.38, metalness: 0.65, price: 120000 },
  { id: 'gunmetal', name: 'Titanium Gunmetal', hex: '#4b525e', roughness: 0.28, metalness: 0.85, price: 150000 },
  { id: 'satin-bronze', name: 'Satin Bronze', hex: '#8b6b43', roughness: 0.32, metalness: 0.88, price: 220000 },
  { id: 'champagne-alloy', name: 'Champagne Alloy', hex: '#c7b082', roughness: 0.25, metalness: 0.9, price: 240000 },
];

export const BRAKE_CALIPERS = [
  { id: 'crimson', name: 'Apex Crimson', hex: '#d92638', price: 0 },
  { id: 'carbon-black', name: 'Anodized Black', hex: '#1d2026', price: 65000 },
  { id: 'racing-yellow', name: 'Carbon-Ceramic Yellow', hex: '#eab308', price: 95000 },
  { id: 'acid-green', name: 'Hybrid Acid Green', hex: '#65a30d', price: 110000 },
  { id: 'electric-blue', name: 'Cobalt Blue', hex: '#2563eb', price: 95000 },
  { id: 'silver', name: 'Raw Billet Silver', hex: '#cbd5e1', price: 75000 },
];

export const SPOILER_OPTIONS = [
  { id: 'active-flush', name: 'Active Flush Wing', price: 0, description: 'Speed-sensitive hydraulic rear aero wing' },
  { id: 'carbon-swan', name: 'Carbon Swan-Neck GT Wing', price: 650000, description: 'Fixed high-downforce motorsport wing' },
  { id: 'track-twin', name: 'Dual-Element Track Wing', price: 920000, description: 'DRS-inspired twin-plane carbon assembly' },
  { id: 'ducktail', name: 'Integrated Carbon Ducktail', price: 320000, description: 'Minimalist extended rear decklip' },
];

export const SIDE_MIRROR_OPTIONS = [
  { id: 'body-color', name: 'Body-Colored Aero Mirrors', price: 0, materialType: 'body' },
  { id: 'exposed-carbon', name: 'Exposed Gloss Carbon', price: 240000, materialType: 'carbon' },
  { id: 'matte-carbon', name: 'Stealth Matte Carbon', price: 280000, materialType: 'matte-carbon' },
  { id: 'camera-pods', name: 'Digital Aero Camera Pods', price: 450000, materialType: 'camera' },
];

export const BODY_KIT_OPTIONS = [
  { id: 'standard', name: 'R-01 Standard Aero', price: 0, description: 'Balanced street & high-speed stability' },
  { id: 'carbon-pack', name: 'Exposed Carbon Aero Pack', price: 1200000, description: 'Carbon sills, intakes, and aero blades' },
  { id: 'track-rs', name: 'R-01 Track RS Widebody', price: 2150000, description: 'Flared fenders, dive planes, and track skirts' },
];

export const FRONT_SPLITTER_OPTIONS = [
  { id: 'standard', name: 'Composite Front Lip', price: 0 },
  { id: 'extended-carbon', name: 'Extended Carbon Splitter', price: 360000 },
  { id: 'track-canards', name: 'Track Splitter + Aero Canards', price: 540000 },
];

export const REAR_DIFFUSER_OPTIONS = [
  { id: 'standard', name: 'Quad-Channel Diffuser', price: 0 },
  { id: 'carbon-venturi', name: 'Carbon Venturi Tunnel Diffuser', price: 440000 },
  { id: 'race-finned', name: 'Motorsport Deep-Fin Diffuser', price: 620000 },
];

export const WINDOW_TINT_OPTIONS = [
  { id: 'clear', name: 'Factory Clear Acoustic', opacity: 0.34, color: '#a5b4c4', price: 0 },
  { id: 'smoke', name: 'Light Smoke (35%)', opacity: 0.56, color: '#2b323d', price: 85000 },
  { id: 'privacy', name: 'Privacy Dark (15%)', opacity: 0.78, color: '#0f1318', price: 135000 },
  { id: 'limo', name: 'Stealth Limo (5%)', opacity: 0.9, color: '#07090c', price: 175000 },
];

export const HEADLIGHT_STYLE_OPTIONS = [
  { id: 'matrix-white', name: 'Matrix LED — Pure White', color: '#f0f7ff', accent: '#ffffff', price: 0 },
  { id: 'laser-ice', name: 'Apex Laser — Ice Blue DRL', color: '#bae6fd', accent: '#38bdf8', price: 290000 },
  { id: 'gt-amber', name: 'Endurance GT — Amber DRL', color: '#fde68a', accent: '#f59e0b', price: 340000 },
];

// Interior Options
export const SEAT_COLOR_OPTIONS = [
  { id: 'obsidian-black', name: 'Obsidian Black', hex: '#14161a', price: 0 },
  { id: 'saddle-tan', name: 'Cognac Saddle Tan', hex: '#7c4a26', price: 280000 },
  { id: 'crimson-red', name: 'Track Crimson', hex: '#8b1623', price: 320000 },
  { id: 'chalk-ivory', name: 'Chalk Ivory', hex: '#d4d0c8', price: 360000 },
  { id: 'slate-grey', name: 'Titanium Slate', hex: '#3f4550', price: 180000 },
];

export const LEATHER_MATERIAL_OPTIONS = [
  { id: 'nappa', name: 'Full-Grain Nappa Leather', roughness: 0.55, metalness: 0.05, price: 0 },
  { id: 'alcantara', name: 'Race Alcantara Suede', roughness: 0.88, metalness: 0.02, price: 320000 },
  { id: 'semi-aniline', name: 'Bespoke Semi-Aniline', roughness: 0.42, metalness: 0.08, price: 480000 },
];

export const DASHBOARD_OPTIONS = [
  { id: 'leather-carbon', name: 'Stitched Leather & Carbon', hex: '#181b21', price: 0 },
  { id: 'full-alcantara', name: 'Anti-Glare Full Alcantara', hex: '#1f2228', price: 260000 },
  { id: 'exposed-weave', name: 'Exposed Forged Carbon', hex: '#262930', price: 440000 },
];

export const STEERING_WHEEL_OPTIONS = [
  { id: 'sport-leather', name: 'Flat-Bottom Sport Leather', hex: '#16181d', price: 0 },
  { id: 'carbon-led', name: 'Carbon Shift-LED Race Wheel', hex: '#252932', price: 340000 },
  { id: 'alcantara-gt', name: 'Alcantara GT Motorsport', hex: '#202227', price: 220000 },
];

export const CARBON_TRIM_OPTIONS = [
  { id: 'satin-twill', name: 'Satin 2x2 Twill Carbon', hex: '#252830', roughness: 0.35, price: 0 },
  { id: 'gloss-twill', name: 'High-Gloss Twill Carbon', hex: '#1e2128', roughness: 0.14, price: 280000 },
  { id: 'forged-carbon', name: 'Forged Composite Carbon', hex: '#2e323a', roughness: 0.25, price: 420000 },
  { id: 'brushed-titanium', name: 'Brushed Grade-5 Titanium', hex: '#8c94a0', roughness: 0.28, price: 380000 },
];

export const STITCHING_OPTIONS = [
  { id: 'crimson', name: 'Apex Crimson', hex: '#d92638', price: 0 },
  { id: 'silver', name: 'Contrast Silver', hex: '#cbd5e1', price: 65000 },
  { id: 'amber-gold', name: 'Champagne Gold', hex: '#d49a3a', price: 95000 },
  { id: 'electric-blue', name: 'Electric Blue', hex: '#3b82f6', price: 85000 },
  { id: 'stealth-black', name: 'Tone-on-Tone Black', hex: '#2a2e36', price: 45000 },
];

export const AMBIENT_LIGHTING_OPTIONS = [
  { id: 'crimson-pulse', name: 'Crimson Pulse', hex: '#ef4444', price: 0 },
  { id: 'ice-cyan', name: 'Arctic Cyan', hex: '#38bdf8', price: 90000 },
  { id: 'warm-amber', name: 'Showroom Amber', hex: '#f59e0b', price: 90000 },
  { id: 'violet-night', name: 'Ultraviolet', hex: '#a855f7', price: 110000 },
  { id: 'pure-white', name: 'Pure Studio White', hex: '#f8fafc', price: 60000 },
];

export const INTERIOR_PRESETS = [
  {
    id: 'track-stealth',
    name: 'Track Stealth',
    description: 'Alcantara cockpit with crimson stitching & satin twill',
    values: {
      seatColor: 'obsidian-black',
      leatherMaterial: 'alcantara',
      dashboard: 'full-alcantara',
      steeringWheel: 'carbon-led',
      carbonTrim: 'satin-twill',
      stitching: 'crimson',
      ambientLighting: 'crimson-pulse',
    },
  },
  {
    id: 'grand-tourer',
    name: 'Grand Tourer',
    description: 'Cognac saddle leather with champagne accents & warm glow',
    values: {
      seatColor: 'saddle-tan',
      leatherMaterial: 'semi-aniline',
      dashboard: 'leather-carbon',
      steeringWheel: 'sport-leather',
      carbonTrim: 'gloss-twill',
      stitching: 'amber-gold',
      ambientLighting: 'warm-amber',
    },
  },
  {
    id: 'atelier-ivory',
    name: 'Atelier Ivory',
    description: 'Chalk ivory hides paired with brushed titanium & cyan light',
    values: {
      seatColor: 'chalk-ivory',
      leatherMaterial: 'semi-aniline',
      dashboard: 'exposed-weave',
      steeringWheel: 'carbon-led',
      carbonTrim: 'brushed-titanium',
      stitching: 'silver',
      ambientLighting: 'ice-cyan',
    },
  },
];

export const CAMERA_PRESETS = {
  cinematic: {
    id: 'cinematic',
    label: 'Cinematic',
    position: [4.7, 1.85, 4.9],
    target: [0, 0.55, 0],
    fov: 38,
  },
  front: {
    id: 'front',
    label: 'Front',
    position: [0, 1.25, 5.6],
    target: [0, 0.55, 0.4],
    fov: 36,
  },
  rear: {
    id: 'rear',
    label: 'Rear',
    position: [0, 1.35, -5.6],
    target: [0, 0.6, -0.4],
    fov: 36,
  },
  left: {
    id: 'left',
    label: 'Left',
    position: [-5.8, 1.3, 0],
    target: [0, 0.55, 0],
    fov: 36,
  },
  right: {
    id: 'right',
    label: 'Right',
    position: [5.8, 1.3, 0],
    target: [0, 0.55, 0],
    fov: 36,
  },
  top: {
    id: 'top',
    label: 'Top',
    position: [0.01, 6.8, 0.4],
    target: [0, 0.4, 0],
    fov: 40,
  },
  interior: {
    id: 'interior',
    label: 'Interior',
    position: [0.38, 1.12, -0.25],
    target: [0.0, 0.85, 1.1],
    fov: 54,
  },
};

// Clearly labeled as demonstration specifications (not real-world verified telemetry).
export const DEMO_PERFORMANCE_SPECS = {
  disclaimer:
    'Demonstration specifications for the conceptual APEX R-01 hypercar. Simulated gauges do not represent live vehicle telemetry.',
  engineType: '6.5L Twin-Turbo V12 + Axial-Flux Tri-Motor Hybrid',
  horsepower: 1480,
  horsepowerUnit: 'PS (1,460 hp)',
  torque: 1320,
  torqueUnit: 'Nm',
  topSpeed: 408,
  topSpeedUnit: 'km/h (electronically limited)',
  acceleration0to100: 2.1,
  acceleration0to200: 5.4,
  transmission: '8-Speed Seamless Dual-Clutch (DCT)',
  driveType: 'Torque-Vectoring All-Wheel Drive (e-AWD)',
  dryWeight: 1310,
  weightUnit: 'kg',
  powerToWeight: '1,130 PS / tonne',
  redlineRpm: 9200,
  idleRpm: 950,
  maxGear: 8,
  downforce: '920 kg @ 280 km/h',
  braking100to0: '27.4 m (Carbon-Ceramic)',
};

export const DEFAULT_CONFIG = {
  vehicleId: VEHICLE_INFO.id,
  paint: 'racing-red',
  customPaintHex: '#d92638',
  paintFinish: 'metallic',
  wheels: 'aero-5',
  wheelFinish: 'machined-silver',
  brakeCalipers: 'crimson',
  spoiler: 'active-flush',
  sideMirrors: 'exposed-carbon',
  bodyKit: 'standard',
  frontSplitter: 'standard',
  rearDiffuser: 'standard',
  windowTint: 'smoke',
  headlightStyle: 'matrix-white',
  interior: {
    seatColor: 'obsidian-black',
    leatherMaterial: 'nappa',
    dashboard: 'leather-carbon',
    steeringWheel: 'sport-leather',
    carbonTrim: 'satin-twill',
    stitching: 'crimson',
    ambientLighting: 'crimson-pulse',
  },
  lighting: {
    headlights: true,
    taillights: true,
    indicators: false,
    interiorLight: true,
  },
};

export const OPTION_CATALOG_MAP = {
  paint: PAINT_COLORS,
  paintFinish: PAINT_FINISHES,
  wheels: WHEEL_OPTIONS,
  wheelFinish: WHEEL_FINISHES,
  brakeCalipers: BRAKE_CALIPERS,
  spoiler: SPOILER_OPTIONS,
  sideMirrors: SIDE_MIRROR_OPTIONS,
  bodyKit: BODY_KIT_OPTIONS,
  frontSplitter: FRONT_SPLITTER_OPTIONS,
  rearDiffuser: REAR_DIFFUSER_OPTIONS,
  windowTint: WINDOW_TINT_OPTIONS,
  headlightStyle: HEADLIGHT_STYLE_OPTIONS,
  'interior.seatColor': SEAT_COLOR_OPTIONS,
  'interior.leatherMaterial': LEATHER_MATERIAL_OPTIONS,
  'interior.dashboard': DASHBOARD_OPTIONS,
  'interior.steeringWheel': STEERING_WHEEL_OPTIONS,
  'interior.carbonTrim': CARBON_TRIM_OPTIONS,
  'interior.stitching': STITCHING_OPTIONS,
  'interior.ambientLighting': AMBIENT_LIGHTING_OPTIONS,
};
