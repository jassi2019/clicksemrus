"use client";
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

export default function WhatsAppButton({ number }: { number: string }) {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  const href = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(TEXT)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click")}
      aria-label="Chat with us on WhatsApp"
      className="wa-float fixed bottom-20 md:bottom-5 right-4 md:right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-3 pr-4 py-3 font-semibold shadow-[0_10px_30px_-8px_rgba(37,211,102,.8)] hover:scale-105 transition"
    >
      <WhatsAppIcon size={26} />
      <span className="hidden sm:inline text-sm">Chat with us</span>
    </a>
  );
}
