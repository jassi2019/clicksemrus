import { initials } from "@/lib/authors";

/** Initials-based avatar (no photos). Reuses the Reviews/BlogCard avatar pattern. */
export default function AuthorAvatar({ name, size = 40, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-grid place-items-center rounded-full bg-brand text-white font-bold shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials(name)}
    </span>
  );
}
