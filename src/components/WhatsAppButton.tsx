"use client";
import { MessageCircle } from "lucide-react";
import { trackEvent } from "./Tracker";
import { usePathname } from "next/navigation";

export default function WhatsAppButton({ number }: { number: string }) {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  const href = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent("Hi ClickSemrus! I want to grow my business online. Can we talk?")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click")}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-3 pr-4 py-3 font-semibold shadow-[0_10px_30px_-8px_rgba(37,211,102,.8)] hover:scale-105 transition"
    >
      <MessageCircle size={22} />
      <span className="hidden sm:inline text-sm">WhatsApp Us</span>
    </a>
  );
}
