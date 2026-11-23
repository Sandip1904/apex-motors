import { useCallback, useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';

export function useFullscreen(targetRef) {
  const isFullscreen = useUIStore((s) => s.isFullscreen);
  const setIsFullscreen = useUIStore((s) => s.setIsFullscreen);
  const addToast = useUIStore((s) => s.addToast);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [setIsFullscreen]);

  const toggleFullscreen = useCallback(async () => {
    const el = targetRef?.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else {
          addToast('Fullscreen mode is not supported by this browser.', 'error');
        }
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      addToast('Unable to toggle fullscreen mode.', 'error');
    }
  }, [targetRef, addToast]);

  return { isFullscreen, toggleFullscreen };
}
