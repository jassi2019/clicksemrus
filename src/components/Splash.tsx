"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Intro splash: shows once per browser session, then slides away. */
export default function Splash() {
  const path = usePathname();
  const [state, setState] = useState<"hidden" | "show" | "out">("hidden");
  useEffect(() => {
    if (path?.startsWith("/admin")) return;
    try {
      if (sessionStorage.getItem("cs_splash")) return;
      sessionStorage.setItem("cs_splash", "1");
    } catch {}
    setState("show");
    document.documentElement.style.overflow = "hidden";
    const t1 = setTimeout(() => setState("out"), 1700);
    const t2 = setTimeout(() => { setState("hidden"); document.documentElement.style.overflow = ""; }, 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); document.documentElement.style.overflow = ""; };
  }, [path]);
  if (state === "hidden") return null;
  return (
    <div className={`splash ${state === "out" ? "out" : ""}`} aria-hidden="true">
      <div className="text-center">
        <div className="overflow-hidden">
          <p className="font-display text-4xl md:text-6xl font-extrabold splash-word">Click<span className="text-[#8b84ff]">Semrus</span></p>
        </div>
        <div className="overflow-hidden mt-3">
          <p className="text-white/60 text-sm tracking-[.3em] uppercase splash-word" style={{ animationDelay: ".15s" }}>Clicks → Customers</p>
        </div>
        <div className="splash-bar mx-auto mt-8"><i /></div>
      </div>
    </div>
  );
}
