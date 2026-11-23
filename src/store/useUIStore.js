import { create } from 'zustand';

let toastCounter = 0;

export const useUIStore = create((set) => ({
  activeSidebar: 'exterior', // 'exterior' | 'wheels' | 'aero' | 'glass' | 'interior'
  cameraPreset: 'cinematic',
  cameraResetTrigger: 0,
  autoRotate: false,
  isFullscreen: false,
  mobilePanelOpen: false,
  performanceQuality: 'high', // 'high' | 'balanced'
  saveModalOpen: false,
  confirmDialog: null, // { title, message, confirmLabel, onConfirm, danger }
  toasts: [],
  canvasScreenshotGetter: null,

  setActiveSidebar: (activeSidebar) => set({ activeSidebar }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset, autoRotate: false }),
  triggerCameraReset: () =>
    set((state) => ({
      cameraPreset: 'cinematic',
      autoRotate: false,
      cameraResetTrigger: state.cameraResetTrigger + 1,
    })),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  setAutoRotate: (autoRotate) => set({ autoRotate: Boolean(autoRotate) }),
  setIsFullscreen: (isFullscreen) => set({ isFullscreen: Boolean(isFullscreen) }),
  setMobilePanelOpen: (mobilePanelOpen) => set({ mobilePanelOpen: Boolean(mobilePanelOpen) }),
  setPerformanceQuality: (performanceQuality) => set({ performanceQuality }),
  setSaveModalOpen: (saveModalOpen) => set({ saveModalOpen: Boolean(saveModalOpen) }),
  openConfirmDialog: (dialog) => set({ confirmDialog: dialog }),
  closeConfirmDialog: () => set({ confirmDialog: null }),
  registerScreenshotGetter: (fn) => set({ canvasScreenshotGetter: fn }),

  addToast: (message, type = 'info') => {
    const id = ++toastCounter;
    set((state) => ({
      toasts: [...state.toasts.slice(-3), { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4200);
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
