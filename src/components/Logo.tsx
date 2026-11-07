import Image from "next/image";

export default function Logo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt="ClickSemrus"
        width={size}
        height={size}
        priority
        className="rounded-full shadow-[0_8px_24px_-8px_rgba(11,11,20,.6)]"
      />
      <span className="font-display font-bold text-lg tracking-tight">
        Click<span className="gradient-text">Semrus</span>
      </span>
    </span>
  );
}
