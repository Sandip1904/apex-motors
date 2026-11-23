import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { NAV_LINKS } from '../../data/brandData';
import { VEHICLE_INFO } from '../../data/vehicleCatalog';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-apex-obsidian">
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <BrandLogo />
            <p className="max-w-xs text-xs leading-relaxed text-apex-titanium">
              {VEHICLE_INFO.tagline} An original interactive 3D hypercar commissioning experience built for modern browsers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="py-1 text-apex-silver transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-2 text-xs text-apex-titanium md:text-right">
            <p className="font-semibold uppercase tracking-widest text-apex-silver">
              Demonstration Notice
            </p>
            <p className="leading-relaxed">
              All vehicle pricing (INR) and performance figures are illustrative demonstration values for the conceptual APEX R-01.
            </p>
            <p className="pt-2 font-mono text-[11px] text-apex-steel">
              © {new Date().getFullYear()} {VEHICLE_INFO.brand}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
