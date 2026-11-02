"use client";
import { useState } from "react";
import type { Settings } from "@/lib/posts";

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [s, setS] = useState<Settings>(initial);
  const [msg, setMsg] = useState("");
  const set = (k: keyof Settings, v: unknown) => setS((x) => ({ ...x, [k]: v }));
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(s) });
    setMsg(res.ok ? "Saved. Changes appear on the site within a minute." : "Error saving");
  }
  const F = ({ k, label, hint, type = "text" }: { k: keyof Settings; label: string; hint?: string; type?: string }) => (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
      <input type={type} className="input mt-1" value={String(s[k] ?? "")} onChange={(e) => set(k, e.target.value)} />
    </label>
  );
  return (
    <form onSubmit={save} className="space-y-6">
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold">Tracking</h2>
        <F k="gaId" label="Google Analytics 4 Measurement ID" hint="G-XXXXXXXXXX. First-party analytics on the dashboard work even without this." />
        <F k="metaPixel" label="Meta Pixel ID" hint="Numeric pixel ID for Facebook / Instagram ads." />
      </div>
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold">Contact details</h2>
        <F k="phone" label="Phone (display)" />
        <F k="whatsapp" label="WhatsApp number" hint="Digits only with country code, e.g. 919876543210" />
        <F k="email" label="Email" type="email" />
        <F k="address" label="Address" />
        <F k="announcement" label="Top announcement bar" hint="Leave empty to hide. Example: Diwali offer: 20% off on first month." />
      </div>
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold">Trending engine</h2>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={s.autoPublishTrends !== false} onChange={(e) => set("autoPublishTrends", e.target.checked)} />
          Auto-publish 3 trending-topic posts daily (runs at 8:00 AM IST)
        </label>
        <F k="trendGeo" label="Country code for Google Trends" hint="IN for India, US, GB, AE..." />
      </div>
      <button className="btn btn-primary">Save settings</button>
      {msg && <p className="text-sm text-lime">{msg}</p>}
    </form>
  );
}
