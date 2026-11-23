export default function LoadingScreen({ label = 'Loading APEX R-01 Atelier...' }) {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 bg-apex-obsidian px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-apex-crimson" />
      <p className="apex-label">{label}</p>
    </div>
  );
}
