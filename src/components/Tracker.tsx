"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** First-party page-view tracker. Sends a beacon to /api/track on every route change. */
export default function Tracker() {
  const path = usePathname();
  useEffect(() => {
    if (!path || path.startsWith("/admin")) return;
    try {
      const url = new URL(window.location.href);
      const utm = ["utm_source", "utm_medium", "utm_campaign"].map((k) => url.searchParams.get(k)).filter(Boolean).join("/");
      const ref = document.referrer ? new URL(document.referrer).hostname : "";
      const device = window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";
      const body = JSON.stringify({ path, ref: ref === location.hostname ? "" : ref, utm, device });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      else fetch("/api/track", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
    } catch {}
  }, [path]);
  return null;
}

export function trackEvent(name: string) {
  try {
    fetch("/api/track", { method: "POST", body: JSON.stringify({ event: name }), headers: { "content-type": "application/json" }, keepalive: true });
    const w = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
    w.gtag?.("event", name);
    w.fbq?.("trackCustom", name);
  } catch {}
}
