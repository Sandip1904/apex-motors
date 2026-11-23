import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GitCompare, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { useBuildStore } from '../store/useBuildStore';
import { useCarStore } from '../store/useCarStore';
import { useUIStore } from '../store/useUIStore';
import { calculateConfigurationPricing } from '../utils/pricing';
import { PAINT_COLORS } from '../data/vehicleCatalog';
import { findOption } from '../utils/pricing';

export default function ComparePage() {
  const navigate = useNavigate();
  const builds = useBuildStore((s) => s.builds);
  const compareIds = useBuildStore((s) => s.compareIds);
  const toggleCompareId = useBuildStore((s) => s.toggleCompareId);
  const applyConfiguration = useCarStore((s) => s.applyConfiguration);
  const addToast = useUIStore((s) => s.addToast);

  const selectedBuilds = useMemo(() => {
    const matched = builds.filter((b) => compareIds.includes(b.id));
    return matched.length > 0 ? matched : builds.slice(0, 2);
  }, [builds, compareIds]);

  const pricings = useMemo(
    () => selectedBuilds.map((b) => ({ build: b, pricing: calculateConfigurationPricing(b) })),
    [selectedBuilds]
  );

  const handleLoad = (build) => {
    applyConfiguration(build, build.name);
    addToast(`Loaded "${build.name}" into configurator.`, 'success');
    navigate('/configure');
  };

  if (builds.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="apex-panel rounded-3xl p-10">
          <GitCompare className="mx-auto mb-4 h-12 w-12 text-apex-steel" />
          <h1 className="font-display text-2xl font-bold text-white">
            Save at Least Two Builds to Compare
          </h1>
          <p className="mt-2 text-sm text-apex-silver">
            Create and save two or more APEX R-01 specifications to compare paint, aero, wheels, cabin trim, and itemized INR pricing side by side.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/configure" className="apex-btn-accent">
              <SlidersHorizontal className="h-4 w-4" />
              Configure a Build
            </Link>
            <Link to="/my-builds" className="apex-btn-ghost">
              View My Builds
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rowKeys = pricings[0]?.pricing.itemized || [];

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="apex-label text-apex-crimson">Side-by-Side Specification Audit</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-white">Compare Configurations</h1>
        <p className="mt-1 text-sm text-apex-silver">
          Select up to 3 saved builds below to compare options and pricing differences.
        </p>
      </div>

      {/* Build Selection Pills */}
      <div className="flex flex-wrap gap-2">
        {builds.map((b) => {
          const active = selectedBuilds.some((sb) => sb.id === b.id);
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => toggleCompareId(b.id)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors ${
                active
                  ? 'border-apex-crimson bg-apex-crimson/15 text-white'
                  : 'border-white/10 bg-apex-carbon text-apex-silver hover:border-white/25'
              }`}
            >
              {b.name}
            </button>
          );
        })}
      </div>

      {/* Responsive Comparison Table */}
      <div className="apex-panel overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-apex-obsidian/70">
              <th className="p-4 text-xs font-semibold uppercase tracking-widest text-apex-titanium">
                Specification
              </th>
              {pricings.map(({ build, pricing }) => {
                const paintOpt = findOption(PAINT_COLORS, build.paint);
                const swatch = build.paint === 'custom' ? build.customPaintHex : paintOpt.hex;
                return (
                  <th key={build.id} className="p-4 align-top">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-6 w-6 rounded-full border border-white/25"
                        style={{ backgroundColor: swatch }}
                      />
                      <span className="font-display text-base font-bold text-white">
                        {build.name}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-lg font-bold text-apex-crimson">
                      {pricing.formattedTotalPrice}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleLoad(build)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-apex-silver hover:text-white"
                    >
                      Restore in 3D
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rowKeys.map((meta, rowIndex) => {
              const values = pricings.map((p) => p.pricing.itemized[rowIndex]?.optionName || '—');
              const allSame = values.every((v) => v === values[0]);
              return (
                <tr
                  key={meta.key}
                  className={`border-b border-white/5 ${
                    !allSame ? 'bg-apex-crimson/[0.04]' : ''
                  }`}
                >
                  <td className="p-3.5 text-xs font-medium text-apex-titanium">
                    {meta.label}
                    {!allSame && (
                      <span className="ml-2 rounded bg-apex-crimson/20 px-1.5 py-0.5 text-[9px] uppercase text-apex-crimson">
                        Diff
                      </span>
                    )}
                  </td>
                  {pricings.map(({ build, pricing }) => {
                    const item = pricing.itemized[rowIndex];
                    return (
                      <td key={build.id} className="p-3.5 text-xs">
                        <p className="font-medium text-apex-platinum">{item?.optionName}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-apex-titanium">
                          {item?.formattedPrice}
                        </p>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
