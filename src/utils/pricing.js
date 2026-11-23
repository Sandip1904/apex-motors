import {
  VEHICLE_INFO,
  PAINT_COLORS,
  PAINT_FINISHES,
  WHEEL_OPTIONS,
  WHEEL_FINISHES,
  BRAKE_CALIPERS,
  SPOILER_OPTIONS,
  SIDE_MIRROR_OPTIONS,
  BODY_KIT_OPTIONS,
  FRONT_SPLITTER_OPTIONS,
  REAR_DIFFUSER_OPTIONS,
  WINDOW_TINT_OPTIONS,
  HEADLIGHT_STYLE_OPTIONS,
  SEAT_COLOR_OPTIONS,
  LEATHER_MATERIAL_OPTIONS,
  DASHBOARD_OPTIONS,
  STEERING_WHEEL_OPTIONS,
  CARBON_TRIM_OPTIONS,
  STITCHING_OPTIONS,
  AMBIENT_LIGHTING_OPTIONS,
} from '../data/vehicleCatalog';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(amount) {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  return inrFormatter.format(safeAmount);
}

export function findOption(list, id) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list.find((item) => item.id === id) || list[0];
}

/**
 * Calculates itemized pricing and total price for a vehicle configuration.
 * Guarantees no duplicate charges and accurate option switching.
 */
export function calculateConfigurationPricing(config) {
  const safe = config || {};
  const interior = safe.interior || {};

  const entries = [
    {
      key: 'paint',
      category: 'Exterior',
      label: 'Paint Color',
      option: findOption(PAINT_COLORS, safe.paint),
      extraValue: safe.paint === 'custom' ? safe.customPaintHex : null,
    },
    {
      key: 'paintFinish',
      category: 'Exterior',
      label: 'Paint Finish',
      option: findOption(PAINT_FINISHES, safe.paintFinish),
    },
    {
      key: 'wheels',
      category: 'Wheels & Brakes',
      label: 'Wheel Design',
      option: findOption(WHEEL_OPTIONS, safe.wheels),
    },
    {
      key: 'wheelFinish',
      category: 'Wheels & Brakes',
      label: 'Wheel Finish',
      option: findOption(WHEEL_FINISHES, safe.wheelFinish),
    },
    {
      key: 'brakeCalipers',
      category: 'Wheels & Brakes',
      label: 'Brake Calipers',
      option: findOption(BRAKE_CALIPERS, safe.brakeCalipers),
    },
    {
      key: 'bodyKit',
      category: 'Aerodynamics',
      label: 'Body Kit',
      option: findOption(BODY_KIT_OPTIONS, safe.bodyKit),
    },
    {
      key: 'spoiler',
      category: 'Aerodynamics',
      label: 'Rear Spoiler',
      option: findOption(SPOILER_OPTIONS, safe.spoiler),
    },
    {
      key: 'frontSplitter',
      category: 'Aerodynamics',
      label: 'Front Splitter',
      option: findOption(FRONT_SPLITTER_OPTIONS, safe.frontSplitter),
    },
    {
      key: 'rearDiffuser',
      category: 'Aerodynamics',
      label: 'Rear Diffuser',
      option: findOption(REAR_DIFFUSER_OPTIONS, safe.rearDiffuser),
    },
    {
      key: 'sideMirrors',
      category: 'Aerodynamics',
      label: 'Side Mirrors',
      option: findOption(SIDE_MIRROR_OPTIONS, safe.sideMirrors),
    },
    {
      key: 'windowTint',
      category: 'Glass & Lighting',
      label: 'Window Tint',
      option: findOption(WINDOW_TINT_OPTIONS, safe.windowTint),
    },
    {
      key: 'headlightStyle',
      category: 'Glass & Lighting',
      label: 'Headlight System',
      option: findOption(HEADLIGHT_STYLE_OPTIONS, safe.headlightStyle),
    },
    {
      key: 'seatColor',
      category: 'Interior',
      label: 'Seat Color',
      option: findOption(SEAT_COLOR_OPTIONS, interior.seatColor),
    },
    {
      key: 'leatherMaterial',
      category: 'Interior',
      label: 'Upholstery Material',
      option: findOption(LEATHER_MATERIAL_OPTIONS, interior.leatherMaterial),
    },
    {
      key: 'dashboard',
      category: 'Interior',
      label: 'Dashboard Trim',
      option: findOption(DASHBOARD_OPTIONS, interior.dashboard),
    },
    {
      key: 'steeringWheel',
      category: 'Interior',
      label: 'Steering Wheel',
      option: findOption(STEERING_WHEEL_OPTIONS, interior.steeringWheel),
    },
    {
      key: 'carbonTrim',
      category: 'Interior',
      label: 'Cabin Trim',
      option: findOption(CARBON_TRIM_OPTIONS, interior.carbonTrim),
    },
    {
      key: 'stitching',
      category: 'Interior',
      label: 'Contrast Stitching',
      option: findOption(STITCHING_OPTIONS, interior.stitching),
    },
    {
      key: 'ambientLighting',
      category: 'Interior',
      label: 'Ambient Lighting',
      option: findOption(AMBIENT_LIGHTING_OPTIONS, interior.ambientLighting),
    },
  ];

  // Deduplicate by key just in case, and sum option prices
  const seenKeys = new Set();
  const itemized = [];
  let optionsTotal = 0;

  for (const entry of entries) {
    if (seenKeys.has(entry.key) || !entry.option) continue;
    seenKeys.add(entry.key);
    const price = Number(entry.option.price) || 0;
    optionsTotal += price;
    itemized.push({
      key: entry.key,
      category: entry.category,
      label: entry.label,
      optionId: entry.option.id,
      optionName: entry.extraValue
        ? `${entry.option.name} (${entry.extraValue.toUpperCase()})`
        : entry.option.name,
      price,
      formattedPrice: price > 0 ? `+${formatINR(price)}` : 'Included',
    });
  }

  const basePrice = VEHICLE_INFO.basePrice;
  const totalPrice = basePrice + optionsTotal;

  return {
    basePrice,
    optionsTotal,
    totalPrice,
    formattedBasePrice: formatINR(basePrice),
    formattedOptionsTotal: formatINR(optionsTotal),
    formattedTotalPrice: formatINR(totalPrice),
    itemized,
    paidUpgrades: itemized.filter((i) => i.price > 0),
  };
}
