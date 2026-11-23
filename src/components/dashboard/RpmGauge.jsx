export default function RpmGauge({ rpm = 0, maxRpm = 9200, gear = 'N', running = false }) {
  const ratio = Math.max(0, Math.min(1, rpm / maxRpm));
  const radius = 86;
  const circumference = Math.PI * 1.5 * radius;
  const dashOffset = circumference * (1 - ratio);
  const isRedline = rpm > 7800;

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
            stroke={isRedline ? '#ef4444' : '#d92638'}
            strokeWidth="12"
            strokeDasharray={`${circumference} ${Math.PI * 2 * radius}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-150"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="apex-label">RPM (SIM)</span>
          <span className="mt-1 font-mono text-3xl font-bold text-white">
            {Math.round(rpm).toLocaleString()}
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-md border border-white/15 bg-apex-obsidian px-2.5 py-0.5 font-mono text-sm font-bold text-apex-crimson">
              G:{gear}
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-widest ${
                running ? 'text-emerald-400' : 'text-apex-titanium'
              }`}
            >
              {running ? 'ONLINE' : 'OFF'}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-1 font-mono text-[11px] text-apex-titanium">
        Redline: {maxRpm.toLocaleString()} RPM
      </p>
    </div>
  );
}
