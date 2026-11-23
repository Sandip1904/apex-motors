# APEX MOTORS — APEX R-01 3D Hypercar Configurator

An interactive, browser-native 3D hypercar commissioning platform for the **APEX R-01**, built with **React**, **Vite**, **JavaScript (ES6+ / JSX)**, **Three.js**, **React Three Fiber**, **Drei**, **GSAP**, **Framer Motion**, **Zustand**, **Tailwind CSS**, and **jsPDF**.

---

## Project Overview

APEX MOTORS delivers a dark luxury automotive showroom and real-time 3D configurator running entirely in the browser with no backend server required:

- **Real-Time 3D Showroom & Configurator**: 360° orbit controls, smooth zoom, 7 GSAP-animated camera presets (Cinematic, Front, Rear, Left, Right, Top, Interior), auto-rotation, ground shadows, offline studio Lightformer reflections, and fullscreen mode.
- **Exterior Customization**: 16 exterior paints (including a custom hex Atelier picker), 4 paint finishes (Gloss, Metallic, Satin, Matte), 6 procedural wheel designs, 5 wheel finishes, 6 brake caliper finishes, 3 body kits, 4 spoilers, 3 front splitters, 3 rear diffusers, 4 mirror configurations, 4 window tints, and 3 headlight signatures.
- **Interior Configurator**: Dedicated interior camera studio with curated cabin presets, seat hide colors, upholstery materials, dashboard trims, steering wheels, carbon-fiber/titanium trims, contrast stitching, and ambient cabin lighting.
- **Mechanical Animations & Lighting**: Smooth GSAP-driven dihedral driver/passenger doors, hinged front hood, hinged rear engine cover revealing the V12 hybrid engine bay, toggleable headlights, taillights, blinking indicators, cabin lighting, and engine start/stop vibration + Web Audio sound synthesis.
- **Centralized INR Pricing Engine**: Live itemized breakdown starting from the illustrative base price (`₹3,50,00,000`), deduplicated upgrade charges, and instant reset.
- **Garage Persistence, Sharing & Export**: Versioned `localStorage` saved builds (save, rename, duplicate, delete, restore), side-by-side comparison (up to 3 builds with diff highlighting), validated JSON import/export, URL-encoded shareable links with clipboard fallback, and downloadable **jsPDF** summaries with live 3D canvas snapshots.

---

## Technologies

| Category | Packages |
| :--- | :--- |
| Framework & Build | `react` 18.3, `react-dom` 18.3, `vite` 5.4, `@vitejs/plugin-react` 4.3 |
| 3D Engine | `three` 0.169, `@react-three/fiber` 8.17, `@react-three/drei` 9.114 |
| Animation | `gsap` 3.12, `framer-motion` 11.11 |
| State & Routing | `zustand` 4.5, `react-router-dom` 6.26 |
| Styling & Icons | `tailwindcss` 3.4, `lucide-react` 0.451 |
| Export | `jspdf` 2.5 |

Strictly **JavaScript (ES6+) and JSX only** — zero TypeScript, zero React class components, and zero backend dependencies.

---

## Installation

Prerequisites: **Node.js 18+** and **npm 9+**.

```bash
# 1. Unzip and enter the project directory
cd apex-motors

# 2. Install dependencies
npm install
```

---

## Development Commands

```bash
# Start Vite development server (default: http://localhost:5173)
npm run dev
```

---

## Production Build

```bash
# Build optimized production bundle into dist/
npm run build

# Preview the production bundle locally
npm run preview
```

---

## Folder Structure

```text
apex-motors/
├── public/
│   ├── favicon.svg
│   ├── models/          # Place optional apex-r01.glb here
│   ├── textures/        # Optional custom textures
│   ├── images/          # Optional static marketing imagery
│   ├── sounds/          # Optional custom audio overrides
│   └── fonts/           # Optional local webfont files
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/      # Navbar, Footer, BrandLogo, ErrorBoundary, ConfirmDialog, ToastContainer, LoadingScreen
│   │   ├── configurator/# ExteriorPanel, InteriorPanel, SummaryPanel, ViewportBar, SaveBuildModal
│   │   ├── dashboard/   # RpmGauge, Speedometer
│   │   └── three/       # CarCanvas, CarModel, CarLighting, CarEnvironment, CameraControls, CarAnimations
│   ├── data/            # vehicleCatalog.js, brandData.js
│   ├── hooks/           # useUrlConfigSync.js, useReducedMotion.js, useFullscreen.js
│   ├── pages/           # LandingPage, ShowroomPage, ConfigurePage, InteriorPage, PerformancePage, MyBuildsPage, ComparePage, AboutPage, NotFoundPage
│   ├── store/           # useCarStore.js, useUIStore.js, useBuildStore.js
│   ├── styles/          # index.css
│   ├── utils/           # pricing.js, configSchema.js, shareUrl.js, pdfExport.js, audioSynth.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 3D Model Requirements & Replacing the Vehicle Model

Out of the box, APEX MOTORS renders a clearly labeled **Procedural Demonstration Model** of the APEX R-01 built from multi-part Three.js geometry so every customization control, wheel design, aero part, interior material, and mechanical pivot works immediately without requiring external assets.

### How to Replace with a Real `.glb` Model

1. Export a legally licensed, Draco- or meshopt-optimized hypercar model as **`apex-r01.glb`** (recommended target size: `< 15 MB`, oriented facing `+Z`, ground plane at `y = 0`, overall length ~4.5 units).
2. Place the file at:
   ```text
   public/models/apex-r01.glb
   ```
3. Reload the application. `CarModel.jsx` automatically detects `/models/apex-r01.glb` via a `HEAD` request, loads it with `GLTFLoader`, and switches the viewport badge to **GLB Vehicle Model Active**. If the file is missing or invalid, it falls back cleanly to the procedural demonstration model.

### Supported Mesh & Material Naming Conventions

When preparing a custom `.glb` asset, include the following keywords (case-insensitive) in mesh or material names so the centralized customization engine automatically binds materials:

| Vehicle Component | Recommended Mesh / Material Name Keywords |
| :--- | :--- |
| Exterior Painted Body | `Body`, `Paint`, `Chassis_Body` |
| Wheels / Rims | `Rim`, `Wheel` |
| Brake Calipers | `Caliper`, `BrakeCaliper` |
| Windows / Glass | `Glass`, `Window`, `Windshield` |
| Seats | `Seat`, `DriverSeat`, `PassengerSeat` |
| Dashboard | `Dashboard`, `Dash` |
| Steering Wheel | `Steering`, `SteeringWheel` |

---

## Configuration Persistence & Schema

- Saved builds are stored in `localStorage` under `apex_motors_saved_builds_v1` with `schemaVersion: 1`.
- Every loaded record, imported `.json` file, and `?config=` URL parameter passes through `validateAndSanitizeConfig()` in `src/utils/configSchema.js`.
- Unknown option IDs fall back safely to defaults, invalid hex codes are rejected, corrupted storage is recovered cleanly, and imported JSON is never executed as code.

---

## Troubleshooting

- **WebGL Context Unavailable**: Ensure hardware acceleration is enabled in your browser settings. If WebGL is unavailable, the viewport displays a fallback card with a retry action while pricing, build saving, and PDF export remain usable.
- **No Engine Sound on First Click**: Modern browsers require a direct user gesture before activating `AudioContext`. Clicking **Start Engine** / **Start V12 Hybrid** initializes audio automatically; verify the **Sound On** button is not muted.
- **Custom `.glb` Not Loading**: Confirm the file is named exactly `apex-r01.glb` inside `public/models/` and is a valid binary glTF 2.0 asset.
- **Pricing Customization**: All illustrative INR prices are centralized in `src/data/vehicleCatalog.js`.
