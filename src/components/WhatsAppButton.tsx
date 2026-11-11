"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "./Tracker";
import { usePathname } from "next/navigation";

const TEXT = "Hi ClickSemrus! I want to grow my business online. Can we talk?";

export function WhatsAppIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.004 3C8.84 3 3.02 8.82 3.02 15.98c0 2.83.9 5.45 2.43 7.6L3 29l5.6-2.38a12.9 12.9 0 0 0 7.4 2.3c7.16 0 12.98-5.82 12.98-12.98S23.16 3 16.004 3Zm0 23.7a10.7 10.7 0 0 1-5.46-1.5l-.39-.23-3.32 1.41.93-3.44-.25-.4a10.7 10.7 0 1 1 8.49 4.16Zm5.87-8.02c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1 1.26-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67s1.15 3.1 1.31 3.31c.16.21 2.26 3.45 5.47 4.84.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

/** Cute assistant robot (inline SVG, no image request). */
function AgentAvatar({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="rb-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef0ff" />
          <stop offset="1" stopColor="#d9dcf5" />
        </linearGradient>
        <linearGradient id="rb-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e4e6f2" />
        </linearGradient>
        <linearGradient id="rb-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2a44" />
          <stop offset="1" stopColor="#0b0b14" />
        </linearGradient>
        <radialGradient id="rb-eye" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".45" stopColor="#8be9ff" />
          <stop offset="1" stopColor="#1fb6ff" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#rb-bg)" />
      <g className="rb-bob">
        {/* antenna */}
        <rect x="30.6" y="8" width="2.8" height="7" rx="1.4" fill="#c9ccdd" />
        <circle cx="32" cy="7.5" r="3" fill="#f5a800" />
        <circle cx="31" cy="6.6" r="1" fill="#fff" opacity=".8" />
        {/* ears */}
        <rect x="9" y="24" width="5" height="12" rx="2.5" fill="#d7dae8" />
        <rect x="50" y="24" width="5" height="12" rx="2.5" fill="#d7dae8" />
        {/* head */}
        <rect x="13" y="14" width="38" height="32" rx="15" fill="url(#rb-body)" stroke="#c9ccdd" strokeWidth="1" />
        {/* visor */}
        <rect x="18" y="20" width="28" height="18" rx="9" fill="url(#rb-visor)" />
        <path d="M21 24c3-2.5 19-2.5 22 0" stroke="#ffffff" strokeOpacity=".18" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* eyes */}
        <ellipse cx="26.5" cy="29" rx="3.2" ry="3.8" fill="url(#rb-eye)" />
        <ellipse cx="37.5" cy="29" rx="3.2" ry="3.8" fill="url(#rb-eye)" />
        <circle cx="25.6" cy="27.8" r="1" fill="#fff" />
        <circle cx="36.6" cy="27.8" r="1" fill="#fff" />
        {/* smile */}
        <path d="M28 34.5c2 1.6 6 1.6 8 0" stroke="#8be9ff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        {/* chin / body */}
        <path d="M20 46c3 5 21 5 24 0v6a12 12 0 0 1-24 0z" fill="url(#rb-body)" stroke="#c9ccdd" strokeWidth="1" />
        <rect x="27" y="48" width="10" height="3" rx="1.5" fill="#f5a800" />
        {/* cheeks */}
        <circle cx="19.5" cy="35" r="1.6" fill="#ffb5c2" opacity=".8" />
        <circle cx="44.5" cy="35" r="1.6" fill="#ffb5c2" opacity=".8" />
      </g>
    </svg>
  );
}

export default function WhatsAppButton({ number }: { number: string }) {
  const path = usePathname();
  const [bubble, setBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      let seen = false;
      try { seen = Boolean(sessionStorage.getItem("wa-bubble-dismissed")); } catch {}
      if (seen) setDismissed(true); else setBubble(true);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  if (path?.startsWith("/admin")) return null;
  const href = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(TEXT)}`;
  const showBubble = bubble && !dismissed;

  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem("wa-bubble-dismissed", "1"); } catch {}
  };

  return (
    <div className="fixed bottom-20 md:bottom-5 right-4 md:right-5 z-40 flex flex-col items-end gap-3">
      {showBubble && (
        <div className="wa-bubble hidden sm:block relative w-[260px] rounded-2xl rounded-br-md bg-white text-[#0b0b14] p-4 pr-9 shadow-[0_18px_44px_-16px_rgba(11,11,20,.45)] border border-black/5">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="absolute top-2 right-2 grid place-items-center w-6 h-6 rounded-full text-[#5c5f70] hover:bg-black/5"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#25D366]" />
            </span>
            <span className="text-xs font-bold tracking-wide text-[#5c5f70]">Semi · ClickSemrus Assistant · Online</span>
          </div>
          <p className="text-sm leading-snug">Hi 👋 I’m Semi. Want more leads or sales? Chat with our team on WhatsApp, we reply in minutes.</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click")}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-semibold px-4 py-2 hover:brightness-95"
          >
            <WhatsAppIcon size={16} /> Start chat
          </a>
        </div>
      )}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("whatsapp_click")}
        aria-label="Chat with us on WhatsApp"
        className="wa-float relative block w-12 h-12 md:w-16 md:h-16 rounded-full shadow-[0_14px_34px_-10px_rgba(37,211,102,.75)] ring-4 ring-white hover:scale-105 transition"
      >
        <AgentAvatar size={64} />
        <span className="absolute -bottom-1 -right-1 grid place-items-center w-7 h-7 rounded-full bg-[#25D366] text-white ring-2 ring-white">
          <WhatsAppIcon size={16} />
        </span>
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#25D366] ring-2 ring-white" />
      </a>
    </div>
  );
}
