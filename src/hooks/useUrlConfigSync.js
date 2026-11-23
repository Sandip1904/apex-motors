import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { decodeConfigFromUrlParam } from '../utils/shareUrl';
import { useCarStore } from '../store/useCarStore';
import { useUIStore } from '../store/useUIStore';

/**
 * Decodes and applies a shared `?config=` query parameter once per URL string.
 */
export function useUrlConfigSync() {
  const location = useLocation();
  const applyConfiguration = useCarStore((s) => s.applyConfiguration);
  const addToast = useUIStore((s) => s.addToast);
  const lastProcessedRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encoded = params.get('config');
    if (!encoded || encoded === lastProcessedRef.current) return;
    lastProcessedRef.current = encoded;

    const result = decodeConfigFromUrlParam(encoded);
    if (result.ok) {
      applyConfiguration(result.config, 'Shared APEX R-01 Build');
      addToast('Shared configuration loaded into the 3D showroom.', 'success');
    } else {
      addToast(result.error || 'Could not load shared configuration.', 'error');
    }
  }, [location.search, applyConfiguration, addToast]);
}
