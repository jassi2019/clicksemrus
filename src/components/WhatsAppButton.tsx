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

/** Friendly support-agent avatar (inline SVG, no image request). */
function AgentAvatar({ size = 56 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="wa-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6d63f0" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#wa-bg)" />
      {/* body */}
      <path d="M12 58c2-11 10-16 20-16s18 5 20 16" fill="#fff" />
      {/* collar */}
      <path d="M26 42l6 7 6-7" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* neck */}
      <rect x="27" y="34" width="10" height="8" rx="3" fill="#f3c6a5" />
      {/* face */}
      <circle cx="32" cy="25" r="12" fill="#f8d2b3" />
      {/* hair */}
      <path d="M20 24c0-9 6-13 12-13s12 4 12 13c-2-3-5-5-12-5s-10 2-12 5z" fill="#1f1b3a" />
      {/* headset band + mic */}
      <path d="M19 26a13 13 0 0 1 26 0" fill="none" stroke="#1f1b3a" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="17" y="24" width="4" height="7" rx="2" fill="#1f1b3a" />
      <rect x="43" y="24" width="4" height="7" rx="2" fill="#1f1b3a" />
      <path d="M45 31c0 5-4 7-8 7" fill="none" stroke="#1f1b3a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36.5" cy="38" r="1.8" fill="#1f1b3a" />
      {/* eyes + smile */}
      <circle cx="27.5" cy="26" r="1.5" fill="#1f1b3a" />
      <circle cx="36.5" cy="26" r="1.5" fill="#1f1b3a" />
      <path d="M28 30.5c2 2 6 2 8 0" fill="none" stroke="#1f1b3a" strokeWidth="1.6" strokeLinecap="round" />
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
        <div className="wa-bubble relative w-[260px] rounded-2xl rounded-br-md bg-white text-[#0b0b14] p-4 pr-9 shadow-[0_18px_44px_-16px_rgba(11,11,20,.45)] border border-black/5">
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
            <span className="text-xs font-bold tracking-wide text-[#5c5f70]">ClickSemrus Support · Online</span>
          </div>
          <p className="text-sm leading-snug">Hi 👋 Need help growing your business? Chat with us on WhatsApp, we reply in minutes.</p>
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
        className="wa-float relative block w-14 h-14 md:w-16 md:h-16 rounded-full shadow-[0_14px_34px_-10px_rgba(37,211,102,.75)] ring-4 ring-white hover:scale-105 transition"
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
