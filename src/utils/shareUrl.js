import { validateAndSanitizeConfig } from './configSchema';

const MAX_ENCODED_LENGTH = 1400;

/**
 * Encodes a validated vehicle configuration into a compact, URL-safe base64 string.
 */
export function encodeConfigToUrlParam(config) {
  const { config: safe } = validateAndSanitizeConfig(config);
  const compact = {
    v: 1,
    p: safe.paint,
    ch: safe.paint === 'custom' ? safe.customPaintHex : undefined,
    pf: safe.paintFinish,
    w: safe.wheels,
    wf: safe.wheelFinish,
    bc: safe.brakeCalipers,
    sp: safe.spoiler,
    sm: safe.sideMirrors,
    bk: safe.bodyKit,
    fs: safe.frontSplitter,
    rd: safe.rearDiffuser,
    wt: safe.windowTint,
    hl: safe.headlightStyle,
    in: {
      sc: safe.interior.seatColor,
      lm: safe.interior.leatherMaterial,
      db: safe.interior.dashboard,
      sw: safe.interior.steeringWheel,
      ct: safe.interior.carbonTrim,
      st: safe.interior.stitching,
      al: safe.interior.ambientLighting,
    },
    lt: {
      h: safe.lighting.headlights ? 1 : 0,
      t: safe.lighting.taillights ? 1 : 0,
      i: safe.lighting.indicators ? 1 : 0,
      il: safe.lighting.interiorLight ? 1 : 0,
    },
  };

  const json = JSON.stringify(compact);
  const base64 = btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  if (base64.length > MAX_ENCODED_LENGTH) {
    throw new Error('Encoded configuration exceeds safe URL length.');
  }
  return base64;
}

export function buildShareableUrl(config, targetPath = '/configure') {
  const encoded = encodeConfigToUrlParam(config);
  const url = new URL(window.location.origin + targetPath);
  url.searchParams.set('config', encoded);
  return url.toString();
}

export function decodeConfigFromUrlParam(param) {
  if (!param || typeof param !== 'string' || param.length > MAX_ENCODED_LENGTH) {
    return { ok: false, error: 'Shared configuration parameter is missing or too long.' };
  }
  try {
    const padded = param.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((param.length + 3) % 4);
    const json = decodeURIComponent(escape(atob(padded)));
    const raw = JSON.parse(json);

    const expanded = {
      paint: raw.p,
      customPaintHex: raw.ch,
      paintFinish: raw.pf,
      wheels: raw.w,
      wheelFinish: raw.wf,
      brakeCalipers: raw.bc,
      spoiler: raw.sp,
      sideMirrors: raw.sm,
      bodyKit: raw.bk,
      frontSplitter: raw.fs,
      rearDiffuser: raw.rd,
      windowTint: raw.wt,
      headlightStyle: raw.hl,
      interior: raw.in
        ? {
            seatColor: raw.in.sc,
            leatherMaterial: raw.in.lm,
            dashboard: raw.in.db,
            steeringWheel: raw.in.sw,
            carbonTrim: raw.in.ct,
            stitching: raw.in.st,
            ambientLighting: raw.in.al,
          }
        : undefined,
      lighting: raw.lt
        ? {
            headlights: Boolean(raw.lt.h),
            taillights: Boolean(raw.lt.t),
            indicators: Boolean(raw.lt.i),
            interiorLight: Boolean(raw.lt.il),
          }
        : undefined,
    };

    const { valid, config, warnings } = validateAndSanitizeConfig(expanded);
    if (!valid) return { ok: false, error: 'Shared configuration could not be validated.' };
    return { ok: true, config, warnings };
  } catch {
    return { ok: false, error: 'Shared configuration link is corrupted or unsupported.' };
  }
}

export async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to textarea fallback
    }
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}
