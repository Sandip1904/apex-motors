import { useEffect, useState } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Functional runtime error guard (strictly no React class components).
 * Captures uncaught runtime & promise errors and renders a clean recovery UI.
 */
export default function ErrorBoundary({ children }) {
  const [runtimeError, setRuntimeError] = useState(null);

  useEffect(() => {
    const onError = (event) => {
      if (event?.error) {
        setRuntimeError(event.error.message || 'An unexpected application error occurred.');
      }
    };
    const onRejection = (event) => {
      if (event?.reason) {
        setRuntimeError(
          typeof event.reason === 'string'
            ? event.reason
            : event.reason?.message || 'An unexpected asynchronous error occurred.'
        );
      }
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  if (runtimeError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-apex-obsidian px-6 text-center">
        <div className="apex-panel max-w-md rounded-2xl p-8">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-apex-crimson" />
          <h2 className="font-display text-xl font-bold text-white">Something Went Wrong</h2>
          <p className="mt-2 text-sm text-apex-silver">{runtimeError}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setRuntimeError(null)}
              className="apex-btn-accent"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="apex-btn-ghost"
            >
              Reload Studio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
