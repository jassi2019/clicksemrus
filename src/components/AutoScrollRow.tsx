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
    // The rAF loop only runs while the row is on screen (it used to tick every frame forever), pauses
    // while the page itself is scrolling, and keeps a float position because scrollLeft rounds sub-pixel
    // steps away on some phones (the row then stuttered or did not move).
    let dir = 1, raf = 0, running = false, last = 0, pos = el.scrollLeft;
    let holdUntil = performance.now() + 1200, userUntil = 0, pageUntil = 0;
    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(100, now - last); last = now;
      const max = el.scrollWidth - el.clientWidth;
      if (max > 8 && now > holdUntil && now > userUntil && now > pageUntil && !pausedRef.current && !document.hidden) {
        if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft; // the visitor swiped it
        pos = Math.max(0, Math.min(max, pos + (dir * speed * dt) / 1000));
        el.scrollLeft = pos;
        if (dir === 1 && pos >= max - 1) { dir = -1; holdUntil = now + 1400; }
        else if (dir === -1 && pos <= 1) { dir = 1; holdUntil = now + 1400; }
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(tick); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.05 });
    io.observe(el);
    const onPageScroll = () => { pageUntil = performance.now() + 350; };
    window.addEventListener("scroll", onPageScroll, { passive: true });
    const user = (ms: number) => () => { userUntil = performance.now() + ms; };
    // touchstart pauses for a while, not forever: when a page swipe starts on the row the browser often sends
    // touchcancel instead of touchend, which used to leave the row frozen for good on phones.
    const onTouchStart = user(6000), onTouchEnd = user(2500), onWheel = user(2500), onEnter = user(1e9), onLeave = user(1200);
    el.addEventListener("touchstart", onTouchStart, { passive: true }); el.addEventListener("touchend", onTouchEnd); el.addEventListener("touchcancel", onTouchEnd);
    el.addEventListener("wheel", onWheel, { passive: true }); el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave);
    return () => {
      stop(); io.disconnect(); window.removeEventListener("scroll", onPageScroll);
      el.removeEventListener("touchstart", onTouchStart); el.removeEventListener("touchend", onTouchEnd); el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("wheel", onWheel); el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave);
    };
  }, [speed, mobileOnly]);

  return <div ref={ref} className={`auto-row ${className}`}>{children}</div>;
}
