import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  const dismissToast = useUIStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
            ? AlertCircle
            : Info;
        const accent =
          toast.type === 'success'
            ? 'border-emerald-500/40 text-emerald-300'
            : toast.type === 'error'
            ? 'border-apex-crimson/50 text-red-300'
            : 'border-white/15 text-apex-platinum';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border bg-apex-carbon/95 px-4 py-3 text-sm shadow-showroom backdrop-blur-xl ${accent}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 shrink-0" />
              <span className="text-apex-platinum">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded p-1 text-apex-titanium hover:bg-white/10 hover:text-white"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
