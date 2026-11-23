// Brand identity, editorial copy, navigation metadata, and technology highlights for APEX MOTORS.

export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/showroom', label: 'Showroom' },
  { path: '/configure', label: 'Configure' },
  { path: '/interior', label: 'Interior' },
  { path: '/performance', label: 'Performance' },
  { path: '/my-builds', label: 'My Builds' },
  { path: '/compare', label: 'Compare' },
  { path: '/about', label: 'About' },
];

export const HERO_STATS = [
  { label: 'Combined Output (Demo)', value: '1,480 PS', detail: 'V12 Twin-Turbo + Tri-Motor' },
  { label: '0–100 km/h (Demo)', value: '2.1 s', detail: 'Torque-Vectoring e-AWD' },
  { label: 'Top Speed (Demo)', value: '408 km/h', detail: 'Active Low-Drag Mode' },
  { label: 'Dry Weight (Demo)', value: '1,310 kg', detail: 'Monocoque Carbon Tub' },
];

export const TECHNOLOGY_HIGHLIGHTS = [
  {
    id: 'monocoque',
    tag: 'CHASSIS',
    title: 'Autoclave Carbon Monocoque',
    description:
      'A single-piece pre-preg carbon-titanium survival cell engineered for extreme torsional rigidity and featherweight mass distribution.',
    metric: '52,000 Nm/deg',
  },
  {
    id: 'active-aero',
    tag: 'AERODYNAMICS',
    title: 'Active Venturi Ground Effect',
    description:
      'Electronically actuated front flaps and hydraulic rear wing dynamically balance drag reduction on straights with cornering downforce.',
    metric: '920 kg Downforce',
  },
  {
    id: 'hybrid-drive',
    tag: 'POWERTRAIN',
    title: 'Axial-Flux Hybrid Architecture',
    description:
      'Three ultra-compact axial-flux electric motors eliminate turbo lag and enable millisecond torque vectoring across the front axle.',
    metric: '9,200 RPM Redline',
  },
  {
    id: 'cockpit',
    tag: 'HUMAN-MACHINE',
    title: 'Driver-Centric Telemetry Cockpit',
    description:
      'Tactile milled titanium switchgear, bespoke Nappa or Alcantara trim, and sculpted carbon bucket seating tailored to every owner.',
    metric: '100% Bespoke',
  },
];

export const BRAND_STORY = {
  founded: '2021',
  headquarters: 'Apex Engineering Atelier — Concept Studio',
  philosophy:
    'APEX MOTORS was conceived with a singular design mandate: strip away visual noise until only aerodynamic intent, mechanical honesty, and tactile craft remain.',
  mission:
    'Every APEX R-01 commission is configured down to its weave finish, caliper anodization, and stitching thread—turning an engineering instrument into a personal signature.',
  pillars: [
    {
      title: 'Form Follows Airflow',
      detail: 'Every intake, splitter plane, and venturi tunnel serves cooling or downforce with zero decorative clutter.',
    },
    {
      title: 'Material Integrity',
      detail: 'Exposed 2x2 twill carbon, forged composites, Grade-5 titanium, and hand-stitched hides define every surface.',
    },
    {
      title: 'Bespoke Commissioning',
      detail: 'Real-time 3D commissioning lets clients inspect finishes, lighting, and interior pairings from every angle.',
    },
  ],
};
