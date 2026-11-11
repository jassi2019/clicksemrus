"use client";
import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";

export default function WhatsAppTest({ disabled }: { disabled?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  async function send() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/whatsapp-test", { method: "POST" });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; provider?: string; error?: string; to?: string };
      setMsg(j.ok ? { ok: true, text: `Sent to ${j.to} via ${j.provider}. Check your WhatsApp.` } : { ok: false, text: j.error || "Failed to send" });
    } catch {
      setMsg({ ok: false, text: "Network error" });
    }
    setBusy(false);
  }
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button type="button" onClick={send} disabled={busy || disabled} className="btn btn-ghost text-sm disabled:opacity-50">
        {busy ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />} Send test WhatsApp to owner
      </button>
      {msg && <p className={`text-sm ${msg.ok ? "text-lime" : "text-accent"}`}>{msg.text}</p>}
    </div>
  );
}
