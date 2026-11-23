import {
  VEHICLE_INFO,
  DEFAULT_CONFIG,
  OPTION_CATALOG_MAP,
} from '../data/vehicleCatalog';
import { calculateConfigurationPricing } from './pricing';

export const STORAGE_KEY = 'apex_motors_saved_builds_v1';
export const CURRENT_SCHEMA_VERSION = VEHICLE_INFO.schemaVersion;

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

function pickValidId(catalogKey, value, fallback) {
  const list = OPTION_CATALOG_MAP[catalogKey];
  if (!Array.isArray(list)) return fallback;
  const matched = list.find((item) => item.id === value);
  return matched ? matched.id : fallback;
}

/**
 * Validates and sanitizes an untrusted configuration object (from JSON import, URL, or localStorage).
 * Returns { valid, config, warnings }.
 */
export function validateAndSanitizeConfig(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      valid: false,
      config: structuredClone(DEFAULT_CONFIG),
      warnings: ['Configuration payload must be a valid JSON object.'],
    };
  }

  const interiorRaw = raw.interior && typeof raw.interior === 'object' ? raw.interior : {};
  const lightingRaw = raw.lighting && typeof raw.lighting === 'object' ? raw.lighting : {};

  const paint = pickValidId('paint', raw.paint, DEFAULT_CONFIG.paint);
  if (raw.paint && raw.paint !== paint) warnings.push(`Unknown paint "${raw.paint}" replaced with default.`);

  const customPaintHex =
    typeof raw.customPaintHex === 'string' && HEX_COLOR_REGEX.test(raw.customPaintHex)
      ? raw.customPaintHex.toLowerCase()
      : DEFAULT_CONFIG.customPaintHex;

  const paintFinish = pickValidId('paintFinish', raw.paintFinish, DEFAULT_CONFIG.paintFinish);
  const wheels = pickValidId('wheels', raw.wheels, DEFAULT_CONFIG.wheels);
  const wheelFinish = pickValidId('wheelFinish', raw.wheelFinish, DEFAULT_CONFIG.wheelFinish);
  const brakeCalipers = pickValidId('brakeCalipers', raw.brakeCalipers, DEFAULT_CONFIG.brakeCalipers);
  const spoiler = pickValidId('spoiler', raw.spoiler, DEFAULT_CONFIG.spoiler);
  const sideMirrors = pickValidId('sideMirrors', raw.sideMirrors, DEFAULT_CONFIG.sideMirrors);
  const bodyKit = pickValidId('bodyKit', raw.bodyKit, DEFAULT_CONFIG.bodyKit);
  const frontSplitter = pickValidId('frontSplitter', raw.frontSplitter, DEFAULT_CONFIG.frontSplitter);
  const rearDiffuser = pickValidId('rearDiffuser', raw.rearDiffuser, DEFAULT_CONFIG.rearDiffuser);
  const windowTint = pickValidId('windowTint', raw.windowTint, DEFAULT_CONFIG.windowTint);
  const headlightStyle = pickValidId('headlightStyle', raw.headlightStyle, DEFAULT_CONFIG.headlightStyle);

  const sanitized = {
    vehicleId: VEHICLE_INFO.id,
    paint,
    customPaintHex,
    paintFinish,
    wheels,
    wheelFinish,
    brakeCalipers,
    spoiler,
    sideMirrors,
    bodyKit,
    frontSplitter,
    rearDiffuser,
    windowTint,
    headlightStyle,
    interior: {
      seatColor: pickValidId('interior.seatColor', interiorRaw.seatColor, DEFAULT_CONFIG.interior.seatColor),
      leatherMaterial: pickValidId(
        'interior.leatherMaterial',
        interiorRaw.leatherMaterial,
        DEFAULT_CONFIG.interior.leatherMaterial
      ),
      dashboard: pickValidId('interior.dashboard', interiorRaw.dashboard, DEFAULT_CONFIG.interior.dashboard),
      steeringWheel: pickValidId(
        'interior.steeringWheel',
        interiorRaw.steeringWheel,
        DEFAULT_CONFIG.interior.steeringWheel
      ),
      carbonTrim: pickValidId('interior.carbonTrim', interiorRaw.carbonTrim, DEFAULT_CONFIG.interior.carbonTrim),
      stitching: pickValidId('interior.stitching', interiorRaw.stitching, DEFAULT_CONFIG.interior.stitching),
      ambientLighting: pickValidId(
        'interior.ambientLighting',
        interiorRaw.ambientLighting,
        DEFAULT_CONFIG.interior.ambientLighting
      ),
    },
    lighting: {
      headlights:
        typeof lightingRaw.headlights === 'boolean'
          ? lightingRaw.headlights
          : DEFAULT_CONFIG.lighting.headlights,
      taillights:
        typeof lightingRaw.taillights === 'boolean'
          ? lightingRaw.taillights
          : DEFAULT_CONFIG.lighting.taillights,
      indicators:
        typeof lightingRaw.indicators === 'boolean'
          ? lightingRaw.indicators
          : DEFAULT_CONFIG.lighting.indicators,
      interiorLight:
        typeof lightingRaw.interiorLight === 'boolean'
          ? lightingRaw.interiorLight
          : DEFAULT_CONFIG.lighting.interiorLight,
    },
  };

  return { valid: true, config: sanitized, warnings };
}

export function createSavedBuildRecord(name, config, existingId = null) {
  const { config: safeConfig } = validateAndSanitizeConfig(config);
  const pricing = calculateConfigurationPricing(safeConfig);
  const now = new Date().toISOString();
  const cleanName = String(name || 'APEX R-01 Commission')
    .trim()
    .slice(0, 64) || 'APEX R-01 Commission';

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id: existingId || `build_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name: cleanName,
    vehicleId: VEHICLE_INFO.id,
    paint: safeConfig.paint,
    customPaintHex: safeConfig.customPaintHex,
    paintFinish: safeConfig.paintFinish,
    wheels: safeConfig.wheels,
    wheelFinish: safeConfig.wheelFinish,
    brakeCalipers: safeConfig.brakeCalipers,
    bodyKit: safeConfig.bodyKit,
    spoiler: safeConfig.spoiler,
    sideMirrors: safeConfig.sideMirrors,
    frontSplitter: safeConfig.frontSplitter,
    rearDiffuser: safeConfig.rearDiffuser,
    windowTint: safeConfig.windowTint,
    headlightStyle: safeConfig.headlightStyle,
    interior: safeConfig.interior,
    lighting: safeConfig.lighting,
    totalPrice: pricing.totalPrice,
    createdAt: now,
    updatedAt: now,
  };
}

export function loadBuildsFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { builds: [], recovered: false };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return { builds: [], recovered: true };
    }
    const validBuilds = [];
    for (const item of parsed) {
      if (!item || typeof item !== 'object') continue;
      const { valid, config } = validateAndSanitizeConfig(item);
      if (!valid) continue;
      const pricing = calculateConfigurationPricing(config);
      validBuilds.push({
        schemaVersion: CURRENT_SCHEMA_VERSION,
        id: typeof item.id === 'string' && item.id ? item.id : `build_${Math.random().toString(36).slice(2, 9)}`,
        name: typeof item.name === 'string' && item.name.trim() ? item.name.trim().slice(0, 64) : 'Recovered Build',
        ...config,
        totalPrice: pricing.totalPrice,
        createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString(),
      });
    }
    return { builds: validBuilds, recovered: validBuilds.length !== parsed.length };
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage quota/privacy errors
    }
    return { builds: [], recovered: true };
  }
}

export function saveBuildsToStorage(builds) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
    return true;
  } catch {
    return false;
  }
}

export function exportConfigAsJsonFile(name, config) {
  const record = createSavedBuildRecord(name, config);
  const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const slug = record.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  anchor.href = url;
  anchor.download = `${slug || 'apex-r01-build'}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function parseImportedBuildJson(jsonText) {
  if (typeof jsonText !== 'string' || jsonText.length > 100000) {
    return { ok: false, error: 'File is empty or exceeds maximum allowed size (100 KB).' };
  }
  try {
    const parsed = JSON.parse(jsonText);
    const { valid, config, warnings } = validateAndSanitizeConfig(parsed);
    if (!valid) {
      return { ok: false, error: 'JSON does not match a valid APEX R-01 configuration.' };
    }
    const name =
      typeof parsed.name === 'string' && parsed.name.trim()
        ? parsed.name.trim().slice(0, 64)
        : 'Imported APEX R-01';
    return { ok: true, name, config, warnings };
  } catch {
    return { ok: false, error: 'Invalid JSON syntax. Please select an exported APEX configuration file.' };
  }
}
