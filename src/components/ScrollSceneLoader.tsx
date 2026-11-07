"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMediaQuery, useReducedMotion } from "@/lib/useMediaQuery";
import HeroStatic from "./HeroStatic";

const ScrollScene = dynamic(() => import("./ScrollScene"), { ssr: false, loading: () => <HeroStatic /> });

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };

/**
 * Renders the three.js hero only on desktop (min-width: 768px), without reduced-motion,
 * and only after the browser is idle. Everyone else gets the static hero.
 */
export default function ScrollSceneLoader() {
  const desktop = useMediaQuery("(min-width: 768px)");
  const reduced = useReducedMotion();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const w = window as IdleWindow;
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setIdle(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!desktop || reduced || !idle) return <HeroStatic />;
  return <ScrollScene />;
}
