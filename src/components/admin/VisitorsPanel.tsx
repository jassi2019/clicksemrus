"use client";
import { useEffect, useState } from "react";
import { Users2, Eye, Radio, UserCheck, RefreshCw } from "lucide-react";
import type { VisitorOverview } from "@/lib/visitors";

function ago(iso: string, now: number) {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

const place = (country?: string, city?: string) => [city, country && country !== "unknown" ? country : ""].filter(Boolean).join(", ") || "Unknown";
const source = (referrer?: string, utm?: string) => utm || referrer || "direct";

export default function VisitorsPanel({ initial }: { initial: VisitorOverview }) {
  const [data, setData] = useState(initial);
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/visitors", { cache: "no-store" });
      if (res.ok) {
        const j = (await res.json()) as VisitorOverview & { ok: boolean };
        if (j.ok) setData(j);
      }
    } catch {}
    setNow(Date.now());
    setBusy(false);
  }

  useEffect(() => {
    const t = setInterval(refresh, 20_000);
    const tick = setInterval(() => setNow(Date.now()), 5_000);
    return () => { clearInterval(t); clearInterval(tick); };
  }, []);

  const cards = [
    { l: "Visitors today", v: data.cards.visitorsToday, i: Users2 },
    { l: "Pageviews today", v: data.cards.pageviewsToday, i: Eye },
    { l: "Online now", v: data.cards.online, i: Radio, sub: "active in the last 5 min" },
    { l: "Leads today", v: data.cards.leadsToday, i: UserCheck },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c) => (
          <div key={c.l} className="card p-4 sm:p-5 !transform-none">
            <div className="flex items-center justify-between text-muted text-xs"><span>{c.l}</span><c.i size={16} /></div>
            <p className="font-display text-3xl font-bold mt-2">{c.v.toLocaleString("en-IN")}</p>
            {c.sub && <p className="text-xs text-muted mt-1">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="card !transform-none">
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5 pb-0">
          <h2 className="font-semibold">Live / recent activity</h2>
          <button type="button" onClick={refresh} className="text-xs text-muted inline-flex items-center gap-1 hover:text-fg" disabled={busy}>
            <RefreshCw size={12} className={busy ? "animate-spin" : ""} /> {ago(data.generatedAt, now)}
          </button>
        </div>
        <div className="overflow-x-auto p-2 sm:p-3">
          <table className="table min-w-[640px]">
            <thead><tr><th>When</th><th>Page</th><th>Location</th><th>Device</th><th>Source</th><th></th></tr></thead>
            <tbody>
              {data.activity.map((e, i) => (
                <tr key={`${e.at}-${e.vid}-${i}`}>
                  <td className="text-xs text-muted whitespace-nowrap">{ago(e.at, now)}</td>
                  <td className="text-sm max-w-[260px] truncate">{e.path}</td>
                  <td className="text-xs">{place(e.country, e.city)}</td>
                  <td className="text-xs capitalize">{e.device}</td>
                  <td className="text-xs text-muted max-w-[180px] truncate">{source(e.referrer, e.utm)}</td>
                  <td>{e.lead && <span className="badge bg-lime text-[#0b0b14]" title={e.lead}>Lead</span>}</td>
                </tr>
              ))}
              {data.activity.length === 0 && <tr><td colSpan={6} className="text-muted">No activity yet. Open the site in another tab to see it here.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card !transform-none">
        <h2 className="font-semibold p-4 sm:p-5 pb-0">Recent visitors</h2>
        <div className="overflow-x-auto p-2 sm:p-3">
          <table className="table min-w-[760px]">
            <thead><tr><th>First seen</th><th>Last seen</th><th>Pages</th><th>Last path</th><th>Source</th><th>Location</th><th>Lead</th></tr></thead>
            <tbody>
              {data.visitors.map((v) => (
                <tr key={v.vid}>
                  <td className="text-xs text-muted whitespace-nowrap">{new Date(v.firstSeen).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="text-xs whitespace-nowrap">{ago(v.lastSeen, now)}</td>
                  <td className="text-sm font-semibold">{v.pages}</td>
                  <td className="text-sm max-w-[220px] truncate">{v.lastPath}</td>
                  <td className="text-xs text-muted max-w-[160px] truncate">{source(v.referrer, v.utm)}</td>
                  <td className="text-xs">{place(v.country, v.city)}<span className="block text-muted capitalize">{v.device}</span></td>
                  <td className="text-xs">{v.leadName ? <span className="badge bg-lime text-[#0b0b14]">{v.leadName}</span> : <span className="text-muted">-</span>}</td>
                </tr>
              ))}
              {data.visitors.length === 0 && <tr><td colSpan={7} className="text-muted">No visitors recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
