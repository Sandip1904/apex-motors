import { X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export default function ConfirmDialog() {
  const dialog = useUIStore((s) => s.confirmDialog);
  const close = useUIStore((s) => s.closeConfirmDialog);

  if (!dialog) return null;

  const handleConfirm = () => {
    if (typeof dialog.onConfirm === 'function') {
      dialog.onConfirm();
    }
    close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="apex-panel w-full max-w-md rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 id="confirm-dialog-title" className="font-display text-lg font-semibold text-white">
            {dialog.title}
          </h2>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-1 text-apex-silver hover:bg-white/10 hover:text-white"
            aria-label="Close confirmation dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-apex-silver">{dialog.message}</p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button type="button" onClick={close} className="apex-btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={dialog.danger ? 'apex-btn-accent' : 'apex-btn-primary'}
          >
            {dialog.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
