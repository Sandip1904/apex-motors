export default function BrandLogo({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        width="28"
        height="28"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="64" height="64" rx="12" fill="#12151c" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        <path d="M32 10L54 50H43.5L32 28.5L20.5 50H10L32 10Z" fill="#e8ecf2" />
        <path d="M24 44H40L44 50H20L24 44Z" fill="#d92638" />
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-sm font-bold tracking-[0.22em] text-white">
            APEX MOTORS
          </span>
          <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.26em] text-apex-titanium">
            R-01 ATELIER
          </span>
        </span>
      )}
    </span>
  );
}
