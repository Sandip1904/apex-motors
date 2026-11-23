import {
  Camera,
  RotateCw,
  RotateCcw,
  Maximize2,
  Minimize2,
  DoorOpen,
  Lightbulb,
  Power,
  Zap,
} from 'lucide-react';
import { CAMERA_PRESETS } from '../../data/vehicleCatalog';
import { useUIStore } from '../../store/useUIStore';
import { useCarStore } from '../../store/useCarStore';
import { engineAudio } from '../../utils/audioSynth';

export default function ViewportBar({ onToggleFullscreen, isFullscreen }) {
  const cameraPreset = useUIStore((s) => s.cameraPreset);
  const setCameraPreset = useUIStore((s) => s.setCameraPreset);
  const autoRotate = useUIStore((s) => s.autoRotate);
  const toggleAutoRotate = useUIStore((s) => s.toggleAutoRotate);
  const triggerCameraReset = useUIStore((s) => s.triggerCameraReset);

  const animations = useCarStore((s) => s.animations);
  const lighting = useCarStore((s) => s.lighting);
  const toggleAnimation = useCarStore((s) => s.toggleAnimation);
  const toggleLight = useCarStore((s) => s.toggleLight);

  const handleEngineToggle = () => {
    const next = !animations.engineRunning;
    toggleAnimation('engineRunning');
    if (next) {
      engineAudio.startEngine(950);
    } else {
      engineAudio.stopEngine();
    }
  };

  return (
    <div className="apex-panel flex flex-col gap-3 rounded-2xl p-3">
      {/* Row 1: Camera Presets + View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-apex-titanium">
            <Camera className="h-3.5 w-3.5" />
            Views
          </span>
          {Object.values(CAMERA_PRESETS).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setCameraPreset(preset.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                cameraPreset === preset.id
                  ? 'bg-apex-crimson text-white'
                  : 'bg-white/5 text-apex-silver hover:bg-white/10 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleAutoRotate}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              autoRotate
                ? 'bg-white text-apex-obsidian'
                : 'bg-white/5 text-apex-silver hover:bg-white/10'
            }`}
            title="Toggle 360° Auto-Rotation"
          >
            <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Auto-Spin</span>
          </button>

          <button
            type="button"
            onClick={triggerCameraReset}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-medium text-apex-silver hover:bg-white/10 hover:text-white"
            title="Reset Camera View"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-medium text-apex-silver hover:bg-white/10 hover:text-white"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Mechanical Animations & Lighting Controls */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-2.5">
        <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-apex-titanium">
          <DoorOpen className="h-3.5 w-3.5" />
          Actions
        </span>

        {[
          { key: 'driverDoor', label: 'L-Door' },
          { key: 'passengerDoor', label: 'R-Door' },
          { key: 'hood', label: 'Hood' },
          { key: 'engineCover', label: 'Engine Cover' },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => toggleAnimation(item.key)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              animations[item.key]
                ? 'bg-apex-platinum text-apex-obsidian'
                : 'bg-white/5 text-apex-silver hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}

        <span className="mx-1 hidden h-4 w-px bg-white/10 sm:inline-block" />

        {[
          { key: 'headlights', label: 'Headlights' },
          { key: 'taillights', label: 'Taillights' },
          { key: 'indicators', label: 'Indicators' },
          { key: 'interiorLight', label: 'Cabin Light' },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => toggleLight(item.key)}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              lighting[item.key]
                ? 'border border-amber-400/40 bg-amber-500/20 text-amber-200'
                : 'bg-white/5 text-apex-silver hover:bg-white/10'
            }`}
          >
            <Lightbulb className="h-3 w-3" />
            {item.label}
          </button>
        ))}

        <button
          type="button"
          onClick={handleEngineToggle}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
            animations.engineRunning
              ? 'bg-apex-crimson text-white shadow-lg shadow-apex-crimson/30'
              : 'border border-apex-crimson/50 bg-apex-crimson/10 text-apex-crimson hover:bg-apex-crimson hover:text-white'
          }`}
        >
          {animations.engineRunning ? <Zap className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
          {animations.engineRunning ? 'Stop Engine' : 'Start Engine'}
        </button>
      </div>
    </div>
  );
}
