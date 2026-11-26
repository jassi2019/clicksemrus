"use client";
import { useEffect } from "react";

/**
 * Adds `at-footer` to <html> while the site footer is on screen, so the floating growth-score tab and the
 * chat bubble step aside instead of covering footer links (see globals.css).
 */
export default function FooterWatch() {
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => document.documentElement.classList.toggle("at-footer", e.isIntersecting), { threshold: 0.05 });
    io.observe(footer);
    return () => { io.disconnect(); document.documentElement.classList.remove("at-footer"); };
  }, []);
  return null;
}
