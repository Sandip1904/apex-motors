import { useState } from 'react';
import { Palette, Disc, Wind, Sparkles, Check } from 'lucide-react';
import {
  PAINT_COLORS,
  PAINT_FINISHES,
  WHEEL_OPTIONS,
  WHEEL_FINISHES,
  BRAKE_CALIPERS,
  SPOILER_OPTIONS,
  SIDE_MIRROR_OPTIONS,
  BODY_KIT_OPTIONS,
  FRONT_SPLITTER_OPTIONS,
  REAR_DIFFUSER_OPTIONS,
  WINDOW_TINT_OPTIONS,
  HEADLIGHT_STYLE_OPTIONS,
} from '../../data/vehicleCatalog';
import { useCarStore } from '../../store/useCarStore';
import { formatINR } from '../../utils/pricing';

const TABS = [
  { id: 'paint', label: 'Paint', icon: Palette },
  { id: 'wheels', label: 'Wheels', icon: Disc },
  { id: 'aero', label: 'Aero', icon: Wind },
  { id: 'glass', label: 'Lights & Glass', icon: Sparkles },
];

function OptionButton({ selected, title, subtitle, price, onClick, swatchHex }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
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
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-apex-platinum">{title}</p>
          {subtitle && <p className="truncate text-xs text-apex-titanium">{subtitle}</p>}
        </div>
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

export default function ExteriorPanel() {
  const [activeTab, setActiveTab] = useState('paint');

  const paint = useCarStore((s) => s.paint);
  const customPaintHex = useCarStore((s) => s.customPaintHex);
  const paintFinish = useCarStore((s) => s.paintFinish);
  const wheels = useCarStore((s) => s.wheels);
  const wheelFinish = useCarStore((s) => s.wheelFinish);
  const brakeCalipers = useCarStore((s) => s.brakeCalipers);
  const spoiler = useCarStore((s) => s.spoiler);
  const sideMirrors = useCarStore((s) => s.sideMirrors);
  const bodyKit = useCarStore((s) => s.bodyKit);
  const frontSplitter = useCarStore((s) => s.frontSplitter);
  const rearDiffuser = useCarStore((s) => s.rearDiffuser);
  const windowTint = useCarStore((s) => s.windowTint);
  const headlightStyle = useCarStore((s) => s.headlightStyle);

  const setPaint = useCarStore((s) => s.setPaint);
  const setCustomPaintHex = useCarStore((s) => s.setCustomPaintHex);
  const setPaintFinish = useCarStore((s) => s.setPaintFinish);
  const setWheels = useCarStore((s) => s.setWheels);
  const setWheelFinish = useCarStore((s) => s.setWheelFinish);
  const setBrakeCalipers = useCarStore((s) => s.setBrakeCalipers);
  const setSpoiler = useCarStore((s) => s.setSpoiler);
  const setSideMirrors = useCarStore((s) => s.setSideMirrors);
  const setBodyKit = useCarStore((s) => s.setBodyKit);
  const setFrontSplitter = useCarStore((s) => s.setFrontSplitter);
  const setRearDiffuser = useCarStore((s) => s.setRearDiffuser);
  const setWindowTint = useCarStore((s) => s.setWindowTint);
  const setHeadlightStyle = useCarStore((s) => s.setHeadlightStyle);

  return (
    <div className="flex h-full flex-col">
      {/* Category Tabs */}
      <div className="grid grid-cols-4 gap-1 border-b border-white/10 p-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-medium transition-colors ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-apex-titanium hover:bg-white/5 hover:text-apex-platinum'
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-apex-crimson' : ''}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Option Body */}
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {activeTab === 'paint' && (
          <>
            <section>
              <div className="mb-3 flex items-center justify-between">
                <span className="apex-label">Exterior Paint ({PAINT_COLORS.length})</span>
                <span className="text-xs text-apex-silver">
                  {PAINT_COLORS.find((p) => p.id === paint)?.name}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {PAINT_COLORS.map((color) => {
                  const isSelected = paint === color.id;
                  const displayHex = color.id === 'custom' ? customPaintHex : color.hex;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setPaint(color.id)}
                      title={`${color.name} (${color.price > 0 ? `+${formatINR(color.price)}` : 'Included'})`}
                      aria-label={`Select paint ${color.name}`}
                      className={`group flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all ${
                        isSelected
                          ? 'border-apex-crimson bg-apex-crimson/10'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                      }`}
                    >
                      <span
                        className="relative h-8 w-8 rounded-full border border-white/25 shadow-inner"
                        style={{ backgroundColor: displayHex }}
                      >
                        {isSelected && (
                          <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                        )}
                      </span>
                      <span className="w-full truncate text-center text-[10px] text-apex-silver">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {paint === 'custom' && (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-apex-crimson/40 bg-apex-crimson/5 p-3">
                  <div>
                    <p className="text-xs font-semibold text-white">Atelier Custom Paint Hex</p>
                    <p className="font-mono text-xs text-apex-silver">{customPaintHex.toUpperCase()}</p>
                  </div>
                  <input
                    type="color"
                    value={customPaintHex}
                    onChange={(e) => setCustomPaintHex(e.target.value)}
                    aria-label="Pick custom exterior paint color"
                    className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
                  />
                </div>
              )}
            </section>

            <section>
              <span className="apex-label mb-3 block">Paint Finish</span>
              <div className="space-y-2">
                {PAINT_FINISHES.map((fin) => (
                  <OptionButton
                    key={fin.id}
                    selected={paintFinish === fin.id}
                    title={fin.name}
                    subtitle={fin.description}
                    price={fin.price}
                    onClick={() => setPaintFinish(fin.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'wheels' && (
          <>
            <section>
              <span className="apex-label mb-3 block">Wheel Configuration ({WHEEL_OPTIONS.length})</span>
              <div className="space-y-2">
                {WHEEL_OPTIONS.map((w) => (
                  <OptionButton
                    key={w.id}
                    selected={wheels === w.id}
                    title={w.name}
                    subtitle={`${w.size} · ${w.spokes}-Spoke`}
                    price={w.price}
                    onClick={() => setWheels(w.id)}
                  />
                ))}
              </div>
            </section>

            <section>
              <span className="apex-label mb-3 block">Wheel Finish</span>
              <div className="space-y-2">
                {WHEEL_FINISHES.map((wf) => (
                  <OptionButton
                    key={wf.id}
                    selected={wheelFinish === wf.id}
                    title={wf.name}
                    swatchHex={wf.hex}
                    price={wf.price}
                    onClick={() => setWheelFinish(wf.id)}
                  />
                ))}
              </div>
            </section>

            <section>
              <span className="apex-label mb-3 block">Brake Calipers</span>
              <div className="space-y-2">
                {BRAKE_CALIPERS.map((bc) => (
                  <OptionButton
                    key={bc.id}
                    selected={brakeCalipers === bc.id}
                    title={bc.name}
                    swatchHex={bc.hex}
                    price={bc.price}
                    onClick={() => setBrakeCalipers(bc.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'aero' && (
          <>
            <section>
              <span className="apex-label mb-3 block">Body Kit</span>
              <div className="space-y-2">
                {BODY_KIT_OPTIONS.map((bk) => (
                  <OptionButton
                    key={bk.id}
                    selected={bodyKit === bk.id}
                    title={bk.name}
                    subtitle={bk.description}
                    price={bk.price}
                    onClick={() => setBodyKit(bk.id)}
                  />
                ))}
              </div>
            </section>

            <section>
              <span className="apex-label mb-3 block">Rear Spoiler</span>
              <div className="space-y-2">
                {SPOILER_OPTIONS.map((sp) => (
                  <OptionButton
                    key={sp.id}
                    selected={spoiler === sp.id}
                    title={sp.name}
                    subtitle={sp.description}
                    price={sp.price}
                    onClick={() => setSpoiler(sp.id)}
                  />
                ))}
              </div>
            </section>

            <section>
              <span className="apex-label mb-3 block">Front Splitter</span>
              <div className="space-y-2">
                {FRONT_SPLITTER_OPTIONS.map((fs) => (
                  <OptionButton
                    key={fs.id}
                    selected={frontSplitter === fs.id}
                    title={fs.name}
                    price={fs.price}
                    onClick={() => setFrontSplitter(fs.id)}
                  />
                ))}
              </div>
            </section>

            <section>
              <span className="apex-label mb-3 block">Rear Diffuser</span>
              <div className="space-y-2">
                {REAR_DIFFUSER_OPTIONS.map((rd) => (
                  <OptionButton
                    key={rd.id}
                    selected={rearDiffuser === rd.id}
                    title={rd.name}
                    price={rd.price}
                    onClick={() => setRearDiffuser(rd.id)}
                  />
                ))}
              </div>
            </section>

            <section>
              <span className="apex-label mb-3 block">Side Mirrors</span>
              <div className="space-y-2">
                {SIDE_MIRROR_OPTIONS.map((sm) => (
                  <OptionButton
                    key={sm.id}
                    selected={sideMirrors === sm.id}
                    title={sm.name}
                    price={sm.price}
                    onClick={() => setSideMirrors(sm.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'glass' && (
          <>
            <section>
              <span className="apex-label mb-3 block">Window Tint</span>
              <div className="space-y-2">
                {WINDOW_TINT_OPTIONS.map((wt) => (
                  <OptionButton
                    key={wt.id}
                    selected={windowTint === wt.id}
                    title={wt.name}
                    swatchHex={wt.color}
                    price={wt.price}
                    onClick={() => setWindowTint(wt.id)}
                  />
                ))}
              </div>
            </section>

            <section>
              <span className="apex-label mb-3 block">Headlight Signature</span>
              <div className="space-y-2">
                {HEADLIGHT_STYLE_OPTIONS.map((hl) => (
                  <OptionButton
                    key={hl.id}
                    selected={headlightStyle === hl.id}
                    title={hl.name}
                    swatchHex={hl.accent}
                    price={hl.price}
                    onClick={() => setHeadlightStyle(hl.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
