import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, DoorOpen } from 'lucide-react';
import CarCanvas from '../components/three/CarCanvas';
import InteriorPanel from '../components/configurator/InteriorPanel';
import SummaryPanel from '../components/configurator/SummaryPanel';
import ViewportBar from '../components/configurator/ViewportBar';
import { useUIStore } from '../store/useUIStore';
import { useCarStore } from '../store/useCarStore';
import { useFullscreen } from '../hooks/useFullscreen';

export default function InteriorPage() {
  const stageRef = useRef(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(stageRef);
  const setCameraPreset = useUIStore((s) => s.setCameraPreset);
  const toggleAnimation = useCarStore((s) => s.toggleAnimation);
  const toggleLight = useCarStore((s) => s.toggleLight);
  const driverDoor = useCarStore((s) => s.animations.driverDoor);
  const interiorLight = useCarStore((s) => s.lighting.interiorLight);

  // Switch automatically into interior camera framing on entry
  useEffect(() => {
    setCameraPreset('interior');
  }, [setCameraPreset]);

  return (
    <div className="mx-auto max-w-[1680px] px-4 py-5 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="apex-label text-apex-crimson">Bespoke Cockpit Studio</p>
          <h1 className="font-display text-2xl font-bold text-white">
            APEX R-01 Interior Configurator
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toggleAnimation('driverDoor')}
            className="apex-btn-ghost text-xs"
          >
            <DoorOpen className="h-3.5 w-3.5" />
            {driverDoor ? 'Close Door' : 'Open Door for View'}
          </button>
          <button
            type="button"
            onClick={() => toggleLight('interiorLight')}
            className="apex-btn-ghost text-xs"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            Cabin Light: {interiorLight ? 'On' : 'Off'}
          </button>
          <Link to="/configure" className="apex-btn-primary text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            Full Configurator
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <aside className="apex-panel max-h-[680px] overflow-y-auto rounded-2xl lg:col-span-3">
          <InteriorPanel />
        </aside>

        <section ref={stageRef} className="flex flex-col gap-3 bg-apex-obsidian lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-showroom">
            <CarCanvas
              className={
                isFullscreen
                  ? 'h-[calc(100vh-140px)] w-full'
                  : 'h-[380px] w-full sm:h-[460px] lg:h-[540px]'
              }
            />
          </div>
          <ViewportBar onToggleFullscreen={toggleFullscreen} isFullscreen={isFullscreen} />
        </section>

        <aside className="apex-panel max-h-[680px] overflow-y-auto rounded-2xl lg:col-span-3">
          <SummaryPanel />
        </aside>
      </div>
    </div>
  );
}
