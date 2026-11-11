"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VID_COOKIE = "cs_vid";

/** Read the first-party visitor id cookie (empty string when absent or on the server). */
export function getVid(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${VID_COOKIE}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

/** Return the visitor id, creating the 1-year `cs_vid` cookie when missing. */
export function ensureVid(): string {
  let vid = getVid();
  if (!vid) {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    vid = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${VID_COOKIE}=${vid}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  }
  return vid;
}

/** First-party page-view tracker. Sends a beacon to /api/track on every route change, with the visitor session id. */
export default function Tracker() {
  const path = usePathname();
  useEffect(() => {
    if (!path || path.startsWith("/admin")) return;
    try {
      const url = new URL(window.location.href);
      const q = (k: string) => url.searchParams.get(k) || "";
      const utm_source = q("utm_source"), utm_medium = q("utm_medium"), utm_campaign = q("utm_campaign");
      const utm = [utm_source, utm_medium, utm_campaign].filter(Boolean).join("/");
      const ref = document.referrer ? new URL(document.referrer).hostname : "";
      const referrer = ref === location.hostname ? "" : ref;
      const device = window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";
      const body = JSON.stringify({ vid: ensureVid(), path, ref: referrer, referrer, utm, utm_source, utm_medium, utm_campaign, device, sw: window.screen?.width || window.innerWidth, lang: navigator.language || "" });
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
