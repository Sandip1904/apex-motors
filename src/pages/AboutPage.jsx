import { Link } from 'react-router-dom';
import { ArrowRight, Compass, SlidersHorizontal } from 'lucide-react';
import { BRAND_STORY, TECHNOLOGY_HIGHLIGHTS } from '../data/brandData';
import { VEHICLE_INFO } from '../data/vehicleCatalog';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-14 px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl space-y-4">
        <p className="apex-label text-apex-crimson">About {VEHICLE_INFO.brand}</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Engineering Emotion Through Aerodynamic Clarity
        </h1>
        <p className="text-base leading-relaxed text-apex-silver">{BRAND_STORY.philosophy}</p>
        <p className="text-sm leading-relaxed text-apex-titanium">{BRAND_STORY.mission}</p>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {BRAND_STORY.pillars.map((pillar, idx) => (
          <div key={pillar.title} className="apex-card p-6">
            <span className="font-mono text-xs font-bold text-apex-crimson">0{idx + 1}</span>
            <h2 className="mt-2 font-display text-xl font-semibold text-white">{pillar.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-apex-silver">{pillar.detail}</p>
          </div>
        ))}
      </section>

      <section className="apex-panel rounded-3xl p-8 sm:p-10">
        <p className="apex-label">Architecture &amp; Craft</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-white">
          Core Engineering Highlights
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {TECHNOLOGY_HIGHLIGHTS.map((tech) => (
            <div key={tech.id} className="rounded-xl border border-white/10 bg-apex-obsidian/70 p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold tracking-widest text-apex-crimson">
                  {tech.tag}
                </span>
                <span className="font-mono text-xs text-apex-silver">{tech.metric}</span>
              </div>
              <h3 className="mt-2 font-display text-lg font-semibold text-white">{tech.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-apex-titanium">{tech.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-apex-carbon p-6">
        <div>
          <h2 className="font-display text-xl font-bold text-white">
            Ready to Commission Your APEX R-01?
          </h2>
          <p className="mt-1 text-sm text-apex-silver">
            Launch the real-time 3D configurator or inspect the hypercar in our interactive showroom.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/showroom" className="apex-btn-ghost">
            <Compass className="h-4 w-4" />
            3D Showroom
          </Link>
          <Link to="/configure" className="apex-btn-accent">
            <SlidersHorizontal className="h-4 w-4" />
            Configure Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
