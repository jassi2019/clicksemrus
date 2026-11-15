"use client";
import { useEffect, useRef } from "react";

/**
 * Horizontal row that scrolls itself smoothly (ping-pong) on phones, pauses while the visitor
 * touches, scrolls or hovers it, and stays a normal grid/flex on larger screens via CSS.
 * Children are server-rendered; this only adds behaviour.
 */
export default function AutoScrollRow({ children, className = "", speed = 40, mobileOnly = true, pauseWhen = false }: { children: React.ReactNode; className?: string; speed?: number; mobileOnly?: boolean; pauseWhen?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(pauseWhen);
  useEffect(() => { pausedRef.current = pauseWhen; }, [pauseWhen]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (mobileOnly && !window.matchMedia("(max-width: 767px)").matches) return;
    let dir = 1, raf = 0, last = performance.now(), holdUntil = performance.now() + 1200, userUntil = 0, visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(el);
    const tick = (now: number) => {
      const dt = Math.min(200, now - last); last = now;
      const max = el.scrollWidth - el.clientWidth;
      if (visible && max > 8 && now > holdUntil && now > userUntil && !pausedRef.current) {
        el.scrollLeft += (dir * speed * dt) / 1000;
        if (dir === 1 && el.scrollLeft >= max - 1) { dir = -1; holdUntil = now + 1400; }
        else if (dir === -1 && el.scrollLeft <= 1) { dir = 1; holdUntil = now + 1400; }
      }
      raf = requestAnimationFrame(tick);
    };
    const user = (ms: number) => () => { userUntil = performance.now() + ms; };
    const onTouchStart = user(1e9), onTouchEnd = user(2500), onWheel = user(2500), onEnter = user(1e9), onLeave = user(1200);
    el.addEventListener("touchstart", onTouchStart, { passive: true }); el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("wheel", onWheel, { passive: true }); el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      el.removeEventListener("touchstart", onTouchStart); el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("wheel", onWheel); el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave);
    };
  }, [speed, mobileOnly]);

  return <div ref={ref} className={`auto-row ${className}`}>{children}</div>;
}
