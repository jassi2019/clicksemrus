export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand via-[#5b3cff] to-brand-2 shadow-[0_8px_24px_-8px_rgba(124,92,255,.9)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 4l12 7.5-5.2 1.6L9.5 18 5 4z" fill="white" />
          <circle cx="17.5" cy="17.5" r="2.5" fill="#a3ff6b" />
        </svg>
      </span>
      <span className="font-display font-bold text-lg tracking-tight">
        Click<span className="gradient-text">Semrus</span>
      </span>
    </span>
  );
}
