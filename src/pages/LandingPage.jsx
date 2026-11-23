import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Gauge, Layers, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import CarCanvas from '../components/three/CarCanvas';
import { HERO_STATS, TECHNOLOGY_HIGHLIGHTS, BRAND_STORY } from '../data/brandData';
import { VEHICLE_INFO, DEMO_PERFORMANCE_SPECS } from '../data/vehicleCatalog';
import { formatINR } from '../utils/pricing';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function LandingPage() {
  const reducedMotion = useReducedMotion();

  const fadeUp = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: 'easeOut' },
      };

  return (
    <div className="bg-apex-obsidian text-apex-platinum">
      {/* Full-Screen Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-studio-radial">
        <div className="mx-auto grid max-w-[1600px] items-center gap-8 px-4 py-10 sm:px-6 lg:min-h-[86vh] lg:grid-cols-12 lg:px-8">
          <motion.div
            className="z-10 space-y-6 lg:col-span-5"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-apex-silver">
              <span className="h-2 w-2 rounded-full bg-apex-crimson" />
              {VEHICLE_INFO.modelYear} Bespoke Commission
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-6xl">
              {VEHICLE_INFO.name}
              <span className="block bg-gradient-to-r from-apex-platinum via-apex-silver to-apex-titanium bg-clip-text text-transparent">
                Hypercar Atelier
              </span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-apex-silver">
              {VEHICLE_INFO.tagline} Commission every exterior finish, aerodynamic wing, forged wheel, and hand-stitched cabin surface in real-time 3D.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/configure" className="apex-btn-accent px-6 py-3">
                <SlidersHorizontal className="h-4 w-4" />
                Explore Configuration
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/showroom" className="apex-btn-ghost px-6 py-3">
                <Compass className="h-4 w-4" />
                Enter 3D Showroom
              </Link>
            </div>

            <div className="pt-4 text-xs text-apex-titanium">
              Starting from{' '}
              <span className="font-mono text-sm font-semibold text-white">
                {formatINR(VEHICLE_INFO.basePrice)}
              </span>{' '}
              (Illustrative demo base price)
            </div>
          </motion.div>

          {/* Interactive 3D Hero Viewport */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-showroom">
              <CarCanvas className="h-[360px] w-full sm:h-[460px] lg:h-[540px]" />
            </div>
            <p className="mt-2.5 text-center text-xs text-apex-titanium">
              Drag to orbit 360° · Scroll or pinch to zoom · Live Three.js showroom preview
            </p>
          </div>
        </div>
      </section>

      {/* Vehicle Specification Cards */}
      <section className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_STATS.map((stat) => (
            <motion.div key={stat.label} {...fadeUp} className="apex-card p-6">
              <p className="apex-label">{stat.label}</p>
              <p className="mt-3 font-display text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-apex-silver">{stat.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Exterior & Interior Showcase Split */}
      <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            {...fadeUp}
            className="apex-card flex flex-col justify-between p-8 sm:p-10"
          >
            <div>
              <span className="apex-label text-apex-crimson">01 / Exterior Atelier</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-white">
                16 Bespoke Finishes & Active Carbon Aero
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-apex-silver">
                Pair gloss, metallic, satin, or stealth matte lacquers with six wheel architectures, forged carbon body kits, swan-neck spoilers, and laser headlight signatures.
              </p>
            </div>
            <div className="mt-8">
              <Link to="/configure" className="apex-btn-primary">
                Customize Exterior
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="apex-card flex flex-col justify-between p-8 sm:p-10"
          >
            <div>
              <span className="apex-label text-apex-crimson">02 / Cockpit Craft</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-white">
                Driver-Focused Monocoque Interior
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-apex-silver">
                Step inside with dedicated interior camera framing. Tailor full-grain Nappa or race Alcantara seats, exposed twill carbon, contrast stitching, and ambient cabin lighting.
              </p>
            </div>
            <div className="mt-8">
              <Link to="/interior" className="apex-btn-ghost">
                <Layers className="h-4 w-4" />
                Explore Interior Studio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Performance Highlight Band */}
      <section className="border-y border-white/10 bg-apex-carbon/70 py-16">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="apex-label text-apex-crimson">03 / Powertrain & Telemetry</span>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                {DEMO_PERFORMANCE_SPECS.engineType}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-apex-silver">
                Experience the interactive RPM tachometer, speedometer, gear indicator, and synthesized engine acoustics on the Performance Dashboard.
              </p>
            </div>
            <Link to="/performance" className="apex-btn-accent shrink-0">
              <Gauge className="h-4 w-4" />
              Open Performance Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Highlights */}
      <section className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="apex-label">04 / Engineering</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">
            Technology Highlights
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TECHNOLOGY_HIGHLIGHTS.map((item) => (
            <motion.div key={item.id} {...fadeUp} className="apex-card flex flex-col justify-between p-6">
              <div>
                <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-apex-crimson">
                  {item.tag}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-apex-silver">{item.description}</p>
              </div>
              <p className="mt-5 border-t border-white/10 pt-3 font-mono text-xs font-semibold text-apex-platinum">
                {item.metric}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="mx-auto max-w-[1600px] px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="apex-panel rounded-3xl p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="apex-label text-apex-crimson">05 / Our Philosophy</span>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">
                Built Without Compromise
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-apex-silver">
                {BRAND_STORY.philosophy}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-apex-titanium">
                {BRAND_STORY.mission}
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:col-span-5 lg:items-end">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-apex-silver">
                <ShieldCheck className="h-4 w-4 text-apex-crimson" />
                Save builds, compare specs & export PDFs locally
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/about" className="apex-btn-ghost">
                  Read Brand Story
                </Link>
                <Link to="/configure" className="apex-btn-primary">
                  Start Your Build
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
