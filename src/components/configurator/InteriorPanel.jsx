import { Check, Sparkles } from 'lucide-react';
import {
  SEAT_COLOR_OPTIONS,
  LEATHER_MATERIAL_OPTIONS,
  DASHBOARD_OPTIONS,
  STEERING_WHEEL_OPTIONS,
  CARBON_TRIM_OPTIONS,
  STITCHING_OPTIONS,
  AMBIENT_LIGHTING_OPTIONS,
  INTERIOR_PRESETS,
} from '../../data/vehicleCatalog';
import { useCarStore } from '../../store/useCarStore';
import { formatINR } from '../../utils/pricing';

function InteriorOptionRow({ selected, title, swatchHex, price, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
        selected
          ? 'border-apex-crimson bg-apex-crimson/10 text-white'
          : 'border-white/10 bg-white/[0.02] text-apex-silver hover:border-white/25 hover:bg-white/[0.05]'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {swatchHex && (
          <span
            className="h-5 w-5 shrink-0 rounded-full border border-white/25"
            style={{ backgroundColor: swatchHex }}
          />
        )}
        <span className="truncate text-sm font-medium text-apex-platinum">{title}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="font-mono text-xs text-apex-silver">
          {price > 0 ? `+${formatINR(price)}` : 'Incl.'}
        </span>
        {selected && <Check className="h-4 w-4 text-apex-crimson" />}
      </div>
    </button>
  );
}

export default function InteriorPanel() {
  const interior = useCarStore((s) => s.interior);
  const setInteriorOption = useCarStore((s) => s.setInteriorOption);
  const applyInteriorPreset = useCarStore((s) => s.applyInteriorPreset);

  return (
    <div className="space-y-6 overflow-y-auto p-4">
      {/* Curated Interior Presets */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-apex-crimson" />
          <span className="apex-label">Curated Cabin Presets</span>
        </div>
        <div className="space-y-2">
          {INTERIOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyInteriorPreset(preset.id)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:border-apex-crimson/60 hover:bg-white/[0.06]"
            >
              <p className="text-sm font-semibold text-white">{preset.name}</p>
              <p className="mt-0.5 text-xs text-apex-titanium">{preset.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Seat Color */}
      <section>
        <span className="apex-label mb-3 block">Seat Hide Color</span>
        <div className="space-y-2">
          {SEAT_COLOR_OPTIONS.map((opt) => (
            <InteriorOptionRow
              key={opt.id}
              selected={interior.seatColor === opt.id}
              title={opt.name}
              swatchHex={opt.hex}
              price={opt.price}
              onClick={() => setInteriorOption('seatColor', opt.id)}
            />
          ))}
        </div>
      </section>

      {/* Leather Material */}
      <section>
        <span className="apex-label mb-3 block">Upholstery Material</span>
        <div className="space-y-2">
          {LEATHER_MATERIAL_OPTIONS.map((opt) => (
            <InteriorOptionRow
              key={opt.id}
              selected={interior.leatherMaterial === opt.id}
              title={opt.name}
              price={opt.price}
              onClick={() => setInteriorOption('leatherMaterial', opt.id)}
            />
          ))}
        </div>
      </section>

      {/* Dashboard */}
      <section>
        <span className="apex-label mb-3 block">Dashboard Trim</span>
        <div className="space-y-2">
          {DASHBOARD_OPTIONS.map((opt) => (
            <InteriorOptionRow
              key={opt.id}
              selected={interior.dashboard === opt.id}
              title={opt.name}
              swatchHex={opt.hex}
              price={opt.price}
              onClick={() => setInteriorOption('dashboard', opt.id)}
            />
          ))}
        </div>
      </section>

      {/* Steering Wheel */}
      <section>
        <span className="apex-label mb-3 block">Steering Wheel</span>
        <div className="space-y-2">
          {STEERING_WHEEL_OPTIONS.map((opt) => (
            <InteriorOptionRow
              key={opt.id}
              selected={interior.steeringWheel === opt.id}
              title={opt.name}
              swatchHex={opt.hex}
              price={opt.price}
              onClick={() => setInteriorOption('steeringWheel', opt.id)}
            />
          ))}
        </div>
      </section>

      {/* Carbon-Fiber Trim */}
      <section>
        <span className="apex-label mb-3 block">Carbon-Fiber & Metallic Trim</span>
        <div className="space-y-2">
          {CARBON_TRIM_OPTIONS.map((opt) => (
            <InteriorOptionRow
              key={opt.id}
              selected={interior.carbonTrim === opt.id}
              title={opt.name}
              swatchHex={opt.hex}
              price={opt.price}
              onClick={() => setInteriorOption('carbonTrim', opt.id)}
            />
          ))}
        </div>
      </section>

      {/* Stitching */}
      <section>
        <span className="apex-label mb-3 block">Contrast Stitching</span>
        <div className="space-y-2">
          {STITCHING_OPTIONS.map((opt) => (
            <InteriorOptionRow
              key={opt.id}
              selected={interior.stitching === opt.id}
              title={opt.name}
              swatchHex={opt.hex}
              price={opt.price}
              onClick={() => setInteriorOption('stitching', opt.id)}
            />
          ))}
        </div>
      </section>

      {/* Ambient Lighting */}
      <section>
        <span className="apex-label mb-3 block">Ambient Cabin Lighting</span>
        <div className="space-y-2">
          {AMBIENT_LIGHTING_OPTIONS.map((opt) => (
            <InteriorOptionRow
              key={opt.id}
              selected={interior.ambientLighting === opt.id}
              title={opt.name}
              swatchHex={opt.hex}
              price={opt.price}
              onClick={() => setInteriorOption('ambientLighting', opt.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
