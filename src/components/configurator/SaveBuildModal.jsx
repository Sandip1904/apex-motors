import { useState, useEffect } from 'react';
import { X, Bookmark } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useCarStore } from '../../store/useCarStore';
import { useBuildStore } from '../../store/useBuildStore';

export default function SaveBuildModal() {
  const open = useUIStore((s) => s.saveModalOpen);
  const setOpen = useUIStore((s) => s.setSaveModalOpen);
  const addToast = useUIStore((s) => s.addToast);

  const activeBuildName = useCarStore((s) => s.activeBuildName);
  const setActiveBuildName = useCarStore((s) => s.setActiveBuildName);
  const getConfigSnapshot = useCarStore((s) => s.getConfigSnapshot);
  const saveBuild = useBuildStore((s) => s.saveBuild);

  const [name, setName] = useState(activeBuildName);

  useEffect(() => {
    if (open) setName(activeBuildName || 'APEX R-01 Commission');
  }, [open, activeBuildName]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = name.trim() || 'APEX R-01 Commission';
    const snapshot = getConfigSnapshot();
    saveBuild(clean, snapshot);
    setActiveBuildName(clean);
    setOpen(false);
    addToast(`Saved "${clean}" to My Builds.`, 'success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-build-title"
    >
      <div className="apex-panel w-full max-w-md rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 id="save-build-title" className="font-display text-lg font-semibold text-white">
            Save Configuration
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-apex-silver hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-apex-silver">
          Store your current APEX R-01 specification locally so you can restore, compare, or export it anytime.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="build-name-input" className="apex-label mb-1.5 block">
              Commission Name
            </label>
            <input
              id="build-name-input"
              type="text"
              maxLength={64}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Track RS Midnight Spec"
              className="w-full rounded-xl border border-white/15 bg-apex-obsidian px-4 py-2.5 text-sm text-white placeholder:text-apex-titanium focus:border-apex-crimson focus:outline-none"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="apex-btn-ghost">
              Cancel
            </button>
            <button type="submit" className="apex-btn-accent">
              <Bookmark className="h-4 w-4" />
              Save to Garage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
