"use client";
import { usePathname } from "next/navigation";

/** Renders children everywhere except under /admin (the admin panel has its own chrome). */
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  return <>{children}</>;
}
