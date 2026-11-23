import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, SlidersHorizontal } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { NAV_LINKS } from '../../data/brandData';
import { useBuildStore } from '../../store/useBuildStore';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const buildsCount = useBuildStore((s) => s.builds.length);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-apex-obsidian/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={() => setMobileOpen(false)} aria-label="APEX MOTORS Home">
          <BrandLogo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary Navigation">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `relative rounded-lg px-3 py-2 text-xs font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-apex-silver hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span>{item.label}</span>
              {item.path === '/my-builds' && buildsCount > 0 && (
                <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-apex-crimson px-1 font-mono text-[10px] font-bold text-white">
                  {buildsCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/configure" className="apex-btn-accent hidden py-2 text-xs sm:inline-flex">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Configure R-01
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-apex-platinum lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <nav
          className="border-t border-white/10 bg-apex-carbon px-4 py-4 lg:hidden"
          aria-label="Mobile Navigation"
        >
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm font-medium ${
                    isActive
                      ? 'border-apex-crimson bg-apex-crimson/10 text-white'
                      : 'border-white/10 bg-white/[0.03] text-apex-silver'
                  }`
                }
              >
                <span>{item.label}</span>
                {item.path === '/my-builds' && buildsCount > 0 && (
                  <span className="rounded-full bg-apex-crimson px-1.5 py-0.5 font-mono text-[10px] text-white">
                    {buildsCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
