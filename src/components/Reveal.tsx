"use client";
import { useEffect, useRef } from "react";

export type RevealVariant = "up" | "right" | "zoom";

const VARIANT_CLASS: Record<RevealVariant, string> = { up: "", right: "reveal-right", zoom: "reveal-zoom" };

export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${VARIANT_CLASS[variant]} ${className}`} data-reveal={variant} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
