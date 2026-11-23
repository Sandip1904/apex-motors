import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, Layers, Cpu } from 'lucide-react';
import CarCanvas from '../components/three/CarCanvas';
import ViewportBar from '../components/configurator/ViewportBar';
import { useFullscreen } from '../hooks/useFullscreen';
import { useUIStore } from '../store/useUIStore';
import { useCarStore } from '../store/useCarStore';
import { calculateConfigurationPricing } from '../utils/pricing';
import { VEHICLE_INFO } from '../data/vehicleCatalog';

export default function ShowroomPage() {
  const stageRef = useRef(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(stageRef);
  const quality = useUIStore((s) => s.performanceQuality);
  const setPerformanceQuality = useUIStore((s) => s.setPerformanceQuality);
  const getConfigSnapshot = useCarStore((s) => s.getConfigSnapshot);
  const activeBuildName = useCarStore((s) => s.activeBuildName);

  const pricing = calculateConfigurationPricing(getConfigSnapshot());

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="apex-label">360° Interactive Studio</p>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {VEHICLE_INFO.name} — {activeBuildName}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-white/10 bg-apex-carbon px-3.5 py-2 text-right">
            <p className="text-[10px] uppercase tracking-widest text-apex-titanium">Demo Estimate</p>
            <p className="font-mono text-sm font-bold text-white">{pricing.formattedTotalPrice}</p>
          </div>

          <button
            type="button"
            onClick={() => setPerformanceQuality(quality === 'high' ? 'balanced' : 'high')}
            className="apex-btn-ghost text-xs"
            title="Toggle 3D rendering quality"
          >
            <Cpu className="h-3.5 w-3.5" />
            Quality: {quality === 'high' ? 'High' : 'Balanced'}
          </button>

          <Link to="/configure" className="apex-btn-accent text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Customize
          </Link>
          <Link to="/interior" className="apex-btn-ghost text-xs">
            <Layers className="h-3.5 w-3.5" />
            Interior
          </Link>
        </div>
      </div>

      <div ref={stageRef} className="space-y-3 bg-apex-obsidian">
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-showroom">
          <CarCanvas className={isFullscreen ? 'h-[calc(100vh-140px)] w-full' : 'h-[58vh] min-h-[420px] w-full'} />
        </div>
        <ViewportBar onToggleFullscreen={toggleFullscreen} isFullscreen={isFullscreen} />
      </div>
    </div>
  );
}
