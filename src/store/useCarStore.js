import { create } from 'zustand';
import { DEFAULT_CONFIG, PAINT_COLORS, INTERIOR_PRESETS } from '../data/vehicleCatalog';
import { validateAndSanitizeConfig } from '../utils/configSchema';

const INITIAL_ANIMATIONS = {
  driverDoor: false,
  passengerDoor: false,
  hood: false,
  engineCover: false,
  engineRunning: false,
};

export const useCarStore = create((set, get) => ({
  // Vehicle configuration
  ...structuredClone(DEFAULT_CONFIG),
  activeBuildName: 'APEX R-01 Commission',

  // Vehicle animations & runtime status
  animations: { ...INITIAL_ANIMATIONS },
  modelSource: 'procedural', // 'glb' | 'procedural'
  modelLoadError: null,

  // Exterior setters
  setPaint: (paintId) => {
    const paint = PAINT_COLORS.find((p) => p.id === paintId);
    if (!paint) return;
    set((state) => ({
      paint: paint.id,
      paintFinish: paint.defaultFinish || state.paintFinish,
    }));
  },
  setCustomPaintHex: (hex) => {
    if (typeof hex !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    set({ paint: 'custom', customPaintHex: hex.toLowerCase() });
  },
  setPaintFinish: (paintFinish) => set({ paintFinish }),
  setWheels: (wheels) => set({ wheels }),
  setWheelFinish: (wheelFinish) => set({ wheelFinish }),
  setBrakeCalipers: (brakeCalipers) => set({ brakeCalipers }),
  setSpoiler: (spoiler) => set({ spoiler }),
  setSideMirrors: (sideMirrors) => set({ sideMirrors }),
  setBodyKit: (bodyKit) => set({ bodyKit }),
  setFrontSplitter: (frontSplitter) => set({ frontSplitter }),
  setRearDiffuser: (rearDiffuser) => set({ rearDiffuser }),
  setWindowTint: (windowTint) => set({ windowTint }),
  setHeadlightStyle: (headlightStyle) => set({ headlightStyle }),

  // Interior setters
  setInteriorOption: (key, value) =>
    set((state) => ({
      interior: { ...state.interior, [key]: value },
    })),

  applyInteriorPreset: (presetId) => {
    const preset = INTERIOR_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    set((state) => ({
      interior: { ...state.interior, ...preset.values },
    }));
  },

  // Lighting toggles
  toggleLight: (lightKey) =>
    set((state) => ({
      lighting: {
        ...state.lighting,
        [lightKey]: !state.lighting[lightKey],
      },
    })),

  setLight: (lightKey, value) =>
    set((state) => ({
      lighting: {
        ...state.lighting,
        [lightKey]: Boolean(value),
      },
    })),

  // Animation toggles
  toggleAnimation: (animKey) =>
    set((state) => ({
      animations: {
        ...state.animations,
        [animKey]: !state.animations[animKey],
      },
    })),

  setAnimation: (animKey, value) =>
    set((state) => ({
      animations: {
        ...state.animations,
        [animKey]: Boolean(value),
      },
    })),

  closeAllPanels: () =>
    set((state) => ({
      animations: {
        ...state.animations,
        driverDoor: false,
        passengerDoor: false,
        hood: false,
        engineCover: false,
      },
    })),

  setActiveBuildName: (name) => set({ activeBuildName: String(name || 'APEX R-01 Commission') }),
  setModelSource: (modelSource) => set({ modelSource }),
  setModelLoadError: (modelLoadError) => set({ modelLoadError }),

  // Restore full configuration safely
  applyConfiguration: (rawConfig, buildName = null) => {
    const { valid, config } = validateAndSanitizeConfig(rawConfig);
    if (!valid) return false;
    set((state) => ({
      ...config,
      activeBuildName: buildName ? String(buildName) : state.activeBuildName,
    }));
    return true;
  },

  // Reset to factory defaults
  resetConfiguration: () =>
    set({
      ...structuredClone(DEFAULT_CONFIG),
      activeBuildName: 'APEX R-01 Commission',
      animations: { ...INITIAL_ANIMATIONS },
    }),

  // Helper to extract pure serializable configuration snapshot
  getConfigSnapshot: () => {
    const s = get();
    return {
      vehicleId: s.vehicleId,
      paint: s.paint,
      customPaintHex: s.customPaintHex,
      paintFinish: s.paintFinish,
      wheels: s.wheels,
      wheelFinish: s.wheelFinish,
      brakeCalipers: s.brakeCalipers,
      spoiler: s.spoiler,
      sideMirrors: s.sideMirrors,
      bodyKit: s.bodyKit,
      frontSplitter: s.frontSplitter,
      rearDiffuser: s.rearDiffuser,
      windowTint: s.windowTint,
      headlightStyle: s.headlightStyle,
      interior: { ...s.interior },
      lighting: { ...s.lighting },
    };
  },
}));
