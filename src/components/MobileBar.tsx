"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Sparkles } from "lucide-react";
import { trackEvent } from "./Tracker";

/** Sticky bottom bar on mobile: Call now | Free audit. Hidden on /admin and when no real phone is configured. */
export default function MobileBar({ phone }: { phone: string }) {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  const hasPhone = Boolean(phone) && !phone.includes("00000");
  return (
    <div className="mobile-bar md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-white/95 backdrop-blur px-3 py-2 flex gap-2" role="navigation" aria-label="Quick actions">
      {hasPhone && (
        <a href={`tel:${phone.replace(/\s/g, "")}`} onClick={() => trackEvent("call_click")} className="btn btn-dark flex-1 !py-3 text-sm">
          <Phone size={16} /> Call now
        </a>
      )}
      <Link href="/contact" className="btn btn-sun flex-1 !py-3 text-sm">
        <Sparkles size={16} /> Free audit
      </Link>
    </div>
  );
}
