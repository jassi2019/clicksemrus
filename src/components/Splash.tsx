"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SHOW_MS = 520;
const OUT_MS = 800; // total on-screen time, including the slide-out

/** Intro splash: once per browser session, 800ms total, skipped under prefers-reduced-motion. */
export default function Splash() {
  const path = usePathname();
  const [state, setState] = useState<"hidden" | "show" | "out">("hidden");
  useEffect(() => {
    if (path?.startsWith("/admin")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return; // no intro on phones: it reads as the hero flashing
    try {
      if (sessionStorage.getItem("cs_splash")) return;
      sessionStorage.setItem("cs_splash", "1");
    } catch {
      return;
    }
    const t0 = setTimeout(() => {
      setState("show");
      document.documentElement.style.overflow = "hidden";
    }, 0);
    const t1 = setTimeout(() => setState("out"), SHOW_MS);
    const t2 = setTimeout(() => {
      setState("hidden");
      document.documentElement.style.overflow = "";
    }, OUT_MS);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.style.overflow = "";
    };
  }, [path]);
  if (state === "hidden") return null;
  return (
    <div className={`splash ${state === "out" ? "out" : ""}`} aria-hidden="true">
      <div className="text-center">
        <div className="overflow-hidden">
          <p className="font-display text-4xl md:text-6xl font-extrabold splash-word">Click<span className="text-[#8b84ff]">Semrus</span></p>
        </div>
        <div className="overflow-hidden mt-3">
          <p className="text-white/60 text-sm tracking-[.3em] uppercase splash-word" style={{ animationDelay: ".1s" }}>Clicks → Customers</p>
        </div>
        <div className="splash-bar mx-auto mt-8"><i /></div>
      </div>
    </div>
  );
}
