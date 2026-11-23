import { create } from 'zustand';
import {
  createSavedBuildRecord,
  loadBuildsFromStorage,
  saveBuildsToStorage,
  parseImportedBuildJson,
} from '../utils/configSchema';

const initialLoad = typeof window !== 'undefined' ? loadBuildsFromStorage() : { builds: [], recovered: false };

export const useBuildStore = create((set, get) => ({
  builds: initialLoad.builds,
  storageRecovered: initialLoad.recovered,
  compareIds: initialLoad.builds.slice(0, 2).map((b) => b.id),

  saveBuild: (name, config) => {
    const record = createSavedBuildRecord(name, config);
    const updated = [record, ...get().builds];
    saveBuildsToStorage(updated);
    set({ builds: updated });
    return record;
  },

  renameBuild: (id, newName) => {
    const clean = String(newName || '').trim().slice(0, 64);
    if (!clean) return false;
    const now = new Date().toISOString();
    const updated = get().builds.map((b) =>
      b.id === id ? { ...b, name: clean, updatedAt: now } : b
    );
    saveBuildsToStorage(updated);
    set({ builds: updated });
    return true;
  },

  duplicateBuild: (id) => {
    const source = get().builds.find((b) => b.id === id);
    if (!source) return null;
    const copy = createSavedBuildRecord(`${source.name} (Copy)`, source);
    const updated = [copy, ...get().builds];
    saveBuildsToStorage(updated);
    set({ builds: updated });
    return copy;
  },

  deleteBuild: (id) => {
    const updated = get().builds.filter((b) => b.id !== id);
    saveBuildsToStorage(updated);
    set((state) => ({
      builds: updated,
      compareIds: state.compareIds.filter((cid) => cid !== id),
    }));
  },

  importBuildFromJson: (jsonText) => {
    const parsed = parseImportedBuildJson(jsonText);
    if (!parsed.ok) return parsed;
    const record = createSavedBuildRecord(parsed.name, parsed.config);
    const updated = [record, ...get().builds];
    saveBuildsToStorage(updated);
    set({ builds: updated });
    return { ok: true, build: record, warnings: parsed.warnings };
  },

  toggleCompareId: (id) =>
    set((state) => {
      if (state.compareIds.includes(id)) {
        return { compareIds: state.compareIds.filter((cid) => cid !== id) };
      }
      if (state.compareIds.length >= 3) {
        return { compareIds: [...state.compareIds.slice(1), id] };
      }
      return { compareIds: [...state.compareIds, id] };
    }),

  setCompareIds: (ids) => set({ compareIds: ids.slice(0, 3) }),
}));
