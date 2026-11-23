import { useEffect, useRef, useState } from 'react';
import { Power, Volume2, VolumeX, Gauge, Zap, Info } from 'lucide-react';
import { DEMO_PERFORMANCE_SPECS } from '../data/vehicleCatalog';
import RpmGauge from '../components/dashboard/RpmGauge';
import Speedometer from '../components/dashboard/Speedometer';
import { engineAudio } from '../utils/audioSynth';
import { useCarStore } from '../store/useCarStore';

const GEAR_SPEED_THRESHOLDS = [0, 72, 128, 182, 236, 288, 336, 378, 408];

export default function PerformancePage() {
  const engineRunning = useCarStore((s) => s.animations.engineRunning);
  const setAnimation = useCarStore((s) => s.setAnimation);

  const [muted, setMuted] = useState(false);
  const [accelerating, setAccelerating] = useState(false);
  const [rpm, setRpm] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState('N');
  const rafRef = useRef(null);
  const stateRef = useRef({ rpm: 0, speed: 0 });

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      engineAudio.stopEngine();
    };
  }, []);

  // Physics-inspired simulation loop for demonstration gauges
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      let curSpeed = stateRef.current.speed;
      let curRpm = stateRef.current.rpm;

      if (!engineRunning) {
        curSpeed = Math.max(0, curSpeed - 95 * dt);
        curRpm = Math.max(0, curRpm - 3800 * dt);
        setGear('N');
      } else if (accelerating) {
        // Rapid hypercar acceleration curve
        const accelRate = curSpeed < 100 ? 48 : curSpeed < 220 ? 34 : 20;
        curSpeed = Math.min(DEMO_PERFORMANCE_SPECS.topSpeed, curSpeed + accelRate * dt);
        let activeGear = 1;
        for (let g = 1; g <= 8; g++) {
          if (curSpeed >= GEAR_SPEED_THRESHOLDS[g - 1]) activeGear = g;
        }
        const low = GEAR_SPEED_THRESHOLDS[activeGear - 1];
        const high = GEAR_SPEED_THRESHOLDS[activeGear];
        const progress = Math.max(0, Math.min(1, (curSpeed - low) / Math.max(1, high - low)));
        const targetRpm = 3800 + progress * (DEMO_PERFORMANCE_SPECS.redlineRpm - 3900);
        curRpm += (targetRpm - curRpm) * Math.min(1, dt * 10);
        setGear(String(activeGear));
      } else {
        // Coasting back down to idle
        curSpeed = Math.max(0, curSpeed - 52 * dt);
        const idleTarget =
          curSpeed > 2 ? 2200 + (curSpeed / DEMO_PERFORMANCE_SPECS.topSpeed) * 4200 : DEMO_PERFORMANCE_SPECS.idleRpm;
        curRpm += (idleTarget - curRpm) * Math.min(1, dt * 5);
        if (curSpeed <= 2) {
          setGear('N');
        } else {
          let activeGear = 1;
          for (let g = 1; g <= 8; g++) {
            if (curSpeed >= GEAR_SPEED_THRESHOLDS[g - 1]) activeGear = g;
          }
          setGear(String(activeGear));
        }
      }

      stateRef.current = { rpm: curRpm, speed: curSpeed };
      setRpm(curRpm);
      setSpeed(curSpeed);
      if (engineRunning) {
        engineAudio.updateRpm(curRpm);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [engineRunning, accelerating]);

  const handleEngineToggle = () => {
    const next = !engineRunning;
    setAnimation('engineRunning', next);
    if (next) {
      engineAudio.setMuted(muted);
      engineAudio.startEngine(DEMO_PERFORMANCE_SPECS.idleRpm);
    } else {
      setAccelerating(false);
      engineAudio.stopEngine();
    }
  };

  const handleMuteToggle = () => {
    const next = !muted;
    setMuted(next);
    engineAudio.setMuted(next);
  };

  const specRows = [
    { label: 'Engine Architecture', value: DEMO_PERFORMANCE_SPECS.engineType },
    { label: 'Peak Horsepower', value: `${DEMO_PERFORMANCE_SPECS.horsepower} ${DEMO_PERFORMANCE_SPECS.horsepowerUnit}` },
    { label: 'Peak Torque', value: `${DEMO_PERFORMANCE_SPECS.torque} ${DEMO_PERFORMANCE_SPECS.torqueUnit}` },
    { label: 'Top Speed', value: `${DEMO_PERFORMANCE_SPECS.topSpeed} ${DEMO_PERFORMANCE_SPECS.topSpeedUnit}` },
    { label: '0–100 km/h / 0–200 km/h', value: `${DEMO_PERFORMANCE_SPECS.acceleration0to100} s / ${DEMO_PERFORMANCE_SPECS.acceleration0to200} s` },
    { label: 'Transmission', value: DEMO_PERFORMANCE_SPECS.transmission },
    { label: 'Drive System', value: DEMO_PERFORMANCE_SPECS.driveType },
    { label: 'Dry Weight', value: `${DEMO_PERFORMANCE_SPECS.dryWeight} ${DEMO_PERFORMANCE_SPECS.weightUnit}` },
    { label: 'Power-to-Weight Ratio', value: DEMO_PERFORMANCE_SPECS.powerToWeight },
    { label: 'Peak Downforce', value: DEMO_PERFORMANCE_SPECS.downforce },
    { label: 'Braking (100–0 km/h)', value: DEMO_PERFORMANCE_SPECS.braking100to0 },
  ];

  const accelProgress = Math.min(100, (speed / DEMO_PERFORMANCE_SPECS.topSpeed) * 100);

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header & Disclaimer */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="apex-label text-apex-crimson">Powertrain & Telemetry Simulation</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
            APEX R-01 Performance Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleEngineToggle}
            className={engineRunning ? 'apex-btn-accent' : 'apex-btn-primary'}
          >
            <Power className="h-4 w-4" />
            {engineRunning ? 'Stop Engine' : 'Start V12 Hybrid'}
          </button>

          <button
            type="button"
            disabled={!engineRunning}
            onMouseDown={() => setAccelerating(true)}
            onMouseUp={() => setAccelerating(false)}
            onMouseLeave={() => setAccelerating(false)}
            onTouchStart={() => setAccelerating(true)}
            onTouchEnd={() => setAccelerating(false)}
            className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-40 ${
              accelerating
                ? 'border-apex-crimson bg-apex-crimson text-white shadow-lg shadow-apex-crimson/30'
                : 'border-white/20 bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <Zap className="h-4 w-4" />
            Hold to Accelerate
          </button>

          <button
            type="button"
            onClick={handleMuteToggle}
            className="apex-btn-ghost"
            aria-label={muted ? 'Unmute engine sound' : 'Mute engine sound'}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {muted ? 'Muted' : 'Sound On'}
          </button>
        </div>
      </div>

      {/* Mandatory Demonstration Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p>{DEMO_PERFORMANCE_SPECS.disclaimer}</p>
      </div>

      {/* Gauges + Acceleration Visualizer */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RpmGauge rpm={rpm} maxRpm={DEMO_PERFORMANCE_SPECS.redlineRpm} gear={gear} running={engineRunning} />
        <Speedometer speed={speed} maxSpeed={DEMO_PERFORMANCE_SPECS.topSpeed} />

        <div className="apex-card flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="apex-label">Acceleration Visualization</span>
              <Gauge className="h-4 w-4 text-apex-crimson" />
            </div>
            <p className="mt-2 text-xs text-apex-silver">
              Start the engine and press &amp; hold <strong className="text-white">Hold to Accelerate</strong> to cycle through the simulated 8-speed dual-clutch gears.
            </p>
          </div>

          <div className="my-6 space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-apex-titanium">Velocity Envelope</span>
                <span className="font-mono text-white">{Math.round(accelProgress)}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-apex-platinum via-apex-amber to-apex-crimson transition-all duration-100"
                  style={{ width: `${accelProgress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-white/10 bg-apex-obsidian p-3">
                <p className="text-[10px] uppercase text-apex-titanium">0–100</p>
                <p className="mt-1 font-mono text-sm font-bold text-white">
                  {DEMO_PERFORMANCE_SPECS.acceleration0to100}s
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-apex-obsidian p-3">
                <p className="text-[10px] uppercase text-apex-titanium">0–200</p>
                <p className="mt-1 font-mono text-sm font-bold text-white">
                  {DEMO_PERFORMANCE_SPECS.acceleration0to200}s
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-apex-obsidian p-3">
                <p className="text-[10px] uppercase text-apex-titanium">Gear</p>
                <p className="mt-1 font-mono text-sm font-bold text-apex-crimson">{gear}</p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-apex-titanium">
            Audio synthesized locally via Web Audio API (no external sound server required).
          </p>
        </div>
      </div>

      {/* Full Technical Specification Grid */}
      <section className="apex-panel rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-white">
          Technical Specifications (Demonstration)
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {specRows.map((row) => (
            <div
              key={row.label}
              className="rounded-xl border border-white/10 bg-apex-obsidian/70 p-4"
            >
              <p className="apex-label">{row.label}</p>
              <p className="mt-1.5 text-sm font-semibold text-white">{row.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
