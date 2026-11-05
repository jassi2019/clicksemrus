"use client";
import { useState } from "react";
import type { Settings } from "@/lib/posts";

type Setter = (k: keyof Settings, v: unknown) => void;

function Field({ k, label, hint, type = "text", s, set }: { k: keyof Settings; label: string; hint?: string; type?: string; s: Settings; set: Setter }) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
      <input type={type} className="input mt-1" value={String(s[k] ?? "")} onChange={(e) => set(k, e.target.value)} />
    </label>
  );
}

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [s, setS] = useState<Settings>(initial);
  const [msg, setMsg] = useState("");
  const set: Setter = (k, v) => setS((x) => ({ ...x, [k]: v }));
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(s) });
    setMsg(res.ok ? "Saved. Changes appear on the site within a minute." : "Error saving");
  }
  return (
    <form onSubmit={save} className="space-y-6">
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold">Tracking</h2>
        <Field s={s} set={set} k="gaId" label="Google Analytics 4 Measurement ID" hint="G-XXXXXXXXXX. First-party analytics on the dashboard work even without this." />
        <Field s={s} set={set} k="metaPixel" label="Meta Pixel ID" hint="Numeric pixel ID for Facebook / Instagram ads." />
      </div>
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold">Contact details</h2>
        <Field s={s} set={set} k="phone" label="Phone (display)" />
        <Field s={s} set={set} k="whatsapp" label="WhatsApp number" hint="Digits only with country code, e.g. 919876543210" />
        <Field s={s} set={set} k="email" label="Email" type="email" />
        <Field s={s} set={set} k="address" label="Address" />
        <Field s={s} set={set} k="announcement" label="Top announcement bar" hint="Leave empty to hide. Example: Diwali offer: 20% off on first month." />
      </div>
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold">Trending engine</h2>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={s.autoPublishTrends !== false} onChange={(e) => set("autoPublishTrends", e.target.checked)} />
          Auto-publish 3 trending-topic posts daily (runs at 8:00 AM IST)
        </label>
        <Field s={s} set={set} k="trendGeo" label="Country code for Google Trends" hint="IN for India, US, GB, AE..." />
      </div>
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold">Homepage</h2>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={s.showStatsNote === true} onChange={(e) => set("showStatsNote", e.target.checked)} />
          Show the stats source note under the homepage numbers (&quot;Numbers from client dashboards, Jan to Oct 2026&quot;)
        </label>
      </div>
      <button className="btn btn-primary">Save settings</button>
      {msg && <p className="text-sm text-lime">{msg}</p>}
    </form>
  );
}
