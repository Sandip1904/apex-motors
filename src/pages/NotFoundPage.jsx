import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-apex-crimson">
        Error 404
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
        Route Off-Track
      </h1>
      <p className="mt-3 max-w-md text-sm text-apex-silver">
        The APEX MOTORS showroom bay you requested does not exist. Return to the main atelier or launch the 3D configurator.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="apex-btn-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Link to="/configure" className="apex-btn-ghost">
          <Compass className="h-4 w-4" />
          Open Configurator
        </Link>
      </div>
    </div>
  );
}
