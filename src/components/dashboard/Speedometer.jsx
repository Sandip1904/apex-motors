export default function Speedometer({ speed = 0, maxSpeed = 408 }) {
  const ratio = Math.max(0, Math.min(1, speed / maxSpeed));
  const radius = 86;
  const circumference = Math.PI * 1.5 * radius;
  const dashOffset = circumference * (1 - ratio);

  return (
    <div className="apex-card flex flex-col items-center justify-center p-6">
      <div className="relative h-52 w-52">
        <svg viewBox="0 0 220 220" className="h-full w-full -rotate-[225deg]">
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="12"
            strokeDasharray={`${circumference} ${Math.PI * 2 * radius}`}
            strokeLinecap="round"
          />
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="#e8ecf2"
            strokeWidth="12"
            strokeDasharray={`${circumference} ${Math.PI * 2 * radius}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-150"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="apex-label">SPEED (SIM)</span>
          <span className="mt-1 font-mono text-4xl font-bold text-white">
            {Math.round(speed)}
          </span>
          <span className="mt-1 text-xs font-medium text-apex-titanium">km/h</span>
        </div>
      </div>
      <p className="mt-1 font-mono text-[11px] text-apex-titanium">
        V-Max: {maxSpeed} km/h (Demo)
      </p>
    </div>
  );
}
