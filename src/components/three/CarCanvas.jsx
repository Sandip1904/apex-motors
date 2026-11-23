import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';
import CarModel from './CarModel';
import CarLighting from './CarLighting';
import CarEnvironment from './CarEnvironment';
import CameraControls from './CameraControls';
import { useUIStore } from '../../store/useUIStore';
import { useCarStore } from '../../store/useCarStore';

function ScreenshotBridge() {
  const { gl, scene, camera } = useThree();
  const registerScreenshotGetter = useUIStore((s) => s.registerScreenshotGetter);

  useEffect(() => {
    registerScreenshotGetter(() => {
      try {
        gl.render(scene, camera);
        return gl.domElement.toDataURL('image/png');
      } catch {
        return null;
      }
    });
    return () => registerScreenshotGetter(null);
  }, [gl, scene, camera, registerScreenshotGetter]);

  return null;
}

function CanvasProgressOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-apex-obsidian/85 backdrop-blur-sm">
      <div className="w-56 space-y-3 text-center">
        <p className="apex-label">Initializing 3D Showroom</p>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-apex-crimson transition-all duration-300"
            style={{ width: `${Math.min(100, Math.round(progress))}%` }}
          />
        </div>
        <p className="font-mono text-xs text-apex-titanium">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

function checkWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}

export default function CarCanvas({ className = 'h-[520px] w-full', showBadge = true }) {
  const [webglOk, setWebglOk] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef(null);

  const performanceQuality = useUIStore((s) => s.performanceQuality);
  const modelSource = useCarStore((s) => s.modelSource);
  const modelLoadError = useCarStore((s) => s.modelLoadError);

  useEffect(() => {
    setWebglOk(checkWebGLAvailable());
  }, [retryCount]);

  if (!webglOk || contextLost) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-apex-carbon p-8 text-center ${className}`}
      >
        <AlertTriangle className="mb-3 h-10 w-10 text-apex-amber" />
        <h3 className="font-display text-lg font-semibold text-white">
          {contextLost ? '3D Graphics Context Interrupted' : 'WebGL Unavailable'}
        </h3>
        <p className="mt-2 max-w-md text-sm text-apex-silver">
          The interactive 3D viewport requires WebGL hardware acceleration. You can still configure options, inspect pricing, and export builds.
        </p>
        <button
          type="button"
          onClick={() => {
            setContextLost(false);
            setRetryCount((c) => c + 1);
          }}
          className="apex-btn-ghost mt-5"
        >
          <RotateCcw className="h-4 w-4" />
          Retry 3D Viewport
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-apex-obsidian ${className}`}>
      <CanvasProgressOverlay />

      {showBadge && (
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-apex-obsidian/75 px-3 py-1 text-[11px] font-medium text-apex-silver backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-apex-crimson" />
            {modelSource === 'glb' ? 'GLB Vehicle Model Active' : 'Procedural Demonstration Model'}
          </span>
          {modelLoadError && (
            <span className="rounded-full border border-amber-500/30 bg-amber-950/70 px-3 py-1 text-[11px] text-amber-200 backdrop-blur-md">
              {modelLoadError}
            </span>
          )}
        </div>
      )}

      <Canvas
        key={retryCount}
        shadows
        dpr={performanceQuality === 'high' ? [1, 2] : [1, 1.25]}
        camera={{ position: [4.7, 1.85, 4.9], fov: 38, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          const handleLost = (e) => {
            e.preventDefault();
            setContextLost(true);
          };
          canvas.addEventListener('webglcontextlost', handleLost, false);
        }}
      >
        <Suspense fallback={null}>
          <CarEnvironment />
          <CarLighting />
          <CarModel />
          <CameraControls />
          <ScreenshotBridge />
        </Suspense>
      </Canvas>
    </div>
  );
}
