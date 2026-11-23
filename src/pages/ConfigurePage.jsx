import { useRef, useState } from 'react';
import { SlidersHorizontal, Receipt, Layers } from 'lucide-react';
import CarCanvas from '../components/three/CarCanvas';
import ExteriorPanel from '../components/configurator/ExteriorPanel';
import InteriorPanel from '../components/configurator/InteriorPanel';
import SummaryPanel from '../components/configurator/SummaryPanel';
import ViewportBar from '../components/configurator/ViewportBar';
import { useFullscreen } from '../hooks/useFullscreen';
import { useUIStore } from '../store/useUIStore';

export default function ConfigurePage() {
  const stageRef = useRef(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(stageRef);
  const [leftMode, setLeftMode] = useState('exterior'); // 'exterior' | 'interior'
  const [mobileSheet, setMobileSheet] = useState('customize'); // 'customize' | 'summary'
  const setCameraPreset = useUIStore((s) => s.setCameraPreset);

  const handleModeSwitch = (mode) => {
    setLeftMode(mode);
    setCameraPreset(mode === 'interior' ? 'interior' : 'cinematic');
  };

  return (
    <div className="mx-auto max-w-[1680px] px-3 py-4 sm:px-4 lg:px-6">
      {/* Desktop 3-Column Automotive Configurator Layout */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* LEFT PANEL (Desktop): Categories & Selectors */}
        <aside className="apex-panel hidden h-[calc(100vh-104px)] flex-col overflow-hidden rounded-2xl lg:col-span-3 lg:flex">
          <div className="grid grid-cols-2 gap-1 border-b border-white/10 p-2">
            <button
              type="button"
              onClick={() => handleModeSwitch('exterior')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors ${
                leftMode === 'exterior'
                  ? 'bg-apex-crimson text-white'
                  : 'bg-white/5 text-apex-silver hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Exterior
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('interior')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors ${
                leftMode === 'interior'
                  ? 'bg-apex-crimson text-white'
                  : 'bg-white/5 text-apex-silver hover:bg-white/10'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Interior
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            {leftMode === 'exterior' ? <ExteriorPanel /> : <InteriorPanel />}
          </div>
        </aside>

        {/* CENTER: Large 3D Canvas + Bottom Viewport Bar */}
        <section
          ref={stageRef}
          className="flex flex-col gap-3 bg-apex-obsidian lg:col-span-6"
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-showroom">
            <CarCanvas
              className={
                isFullscreen
                  ? 'h-[calc(100vh-140px)] w-full'
                  : 'h-[360px] w-full sm:h-[440px] lg:h-[calc(100vh-230px)] lg:min-h-[440px]'
              }
            />
          </div>
          <ViewportBar onToggleFullscreen={toggleFullscreen} isFullscreen={isFullscreen} />
        </section>

        {/* RIGHT PANEL (Desktop): Live Price & Configuration Summary */}
        <aside className="apex-panel hidden h-[calc(100vh-104px)] flex-col overflow-hidden rounded-2xl lg:col-span-3 lg:flex">
          <SummaryPanel />
        </aside>
      </div>

      {/* MOBILE / TABLET COLLAPSIBLE PANEL */}
      <div className="mt-4 lg:hidden">
        <div className="mb-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setMobileSheet('customize');
              handleModeSwitch('exterior');
            }}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold ${
              mobileSheet === 'customize' && leftMode === 'exterior'
                ? 'border-apex-crimson bg-apex-crimson text-white'
                : 'border-white/10 bg-apex-carbon text-apex-silver'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Exterior
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileSheet('customize');
              handleModeSwitch('interior');
            }}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold ${
              mobileSheet === 'customize' && leftMode === 'interior'
                ? 'border-apex-crimson bg-apex-crimson text-white'
                : 'border-white/10 bg-apex-carbon text-apex-silver'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Interior
          </button>
          <button
            type="button"
            onClick={() => setMobileSheet('summary')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold ${
              mobileSheet === 'summary'
                ? 'border-apex-crimson bg-apex-crimson text-white'
                : 'border-white/10 bg-apex-carbon text-apex-silver'
            }`}
          >
            <Receipt className="h-3.5 w-3.5" />
            Summary
          </button>
        </div>

        <div className="apex-panel max-h-[540px] overflow-y-auto rounded-2xl">
          {mobileSheet === 'summary' ? (
            <SummaryPanel />
          ) : leftMode === 'exterior' ? (
            <ExteriorPanel />
          ) : (
            <InteriorPanel />
          )}
        </div>
      </div>
    </div>
  );
}
