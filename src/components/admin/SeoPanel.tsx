"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, Send, Search, PenLine, CheckCircle2, XCircle } from "lucide-react";
import type { GscSnapshot, Opportunity } from "@/lib/gsc";
import type { IndexLogEntry } from "@/lib/indexing";

type Config = { google: boolean; indexnow: boolean; ai: boolean; covers?: string };

const KIND: Record<Opportunity["kind"], { label: string; cls: string }> = {
  uncovered: { label: "No dedicated page", cls: "bg-sun/15 text-[#92400e]" },
  striking: { label: "Striking distance", cls: "bg-brand/10 text-brand" },
  rising: { label: "Rising", cls: "bg-lime/15 text-[#166534]" },
};

function Status({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${ok ? "bg-lime/15 text-[#166534]" : "bg-surface-2 text-muted"}`}>
      {ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />} {label}
    </span>
  );
}

export default function SeoPanel({ snapshot, log, config }: { snapshot: GscSnapshot | null; log: IndexLogEntry[]; config: Config }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const [inspect, setInspect] = useState<string>("");

  async function call(body: Record<string, unknown>, key: string) {
    setBusy(key);
    try {
      const res = await fetch("/api/admin/seo", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const j = await res.json();
      const line = j.ok
        ? j.slug ? `Published /blog/${j.slug} and pinged search engines.`
        : j.indexed ? `Pinged ${j.indexed.length} URL(s): Google ${j.indexed[0]?.google}, IndexNow ${j.indexed[0]?.indexnow}.`
        : j.snapshot ? `Search Console refreshed: ${j.snapshot.opportunities.length} opportunities, ${j.snapshot.totalClicks} clicks / ${j.snapshot.totalImpressions} impressions in 28 days.`
        : typeof j.done === "number" ? `Covers: ${j.done} generated, ${j.skipped} kept (${j.provider})${j.lastError ? ` · last error: ${j.lastError.message}` : ""}.`
        : j.sitemap ? `Sitemap submitted to Search Console (${j.sitemap}).`
        : j.result ? `${j.result.verdict} · ${j.result.coverage} · last crawl ${j.result.lastCrawl || "n/a"}`
        : "Done."
        : `Error: ${j.error || res.status}`;
      if (body.action === "inspect") setInspect(line); else setMsg((m) => [`${new Date().toLocaleTimeString()} ${line}`, ...m]);
    } finally {
      setBusy(null);
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-4 flex flex-wrap items-center gap-2">
        <Status ok={config.google} label="Google service account (Indexing API + Search Console)" />
        <Status ok={config.indexnow} label="IndexNow (Bing/Yandex)" />
        <Status ok={config.ai} label="AI writer (Gemini / Groq / Claude)" />
        {!config.google && <p className="text-xs text-muted w-full">Add GOOGLE_SERVICE_ACCOUNT_JSON in Vercel and make that service account an Owner in Search Console to enable keyword data and instant indexing.</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => call({ action: "refresh" }, "refresh")} disabled={!!busy} className="btn btn-primary text-sm">{busy === "refresh" ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />} Refresh Search Console data</button>
        <button onClick={() => call({ action: "sitemap" }, "sitemap")} disabled={!!busy} className="btn btn-ghost text-sm">{busy === "sitemap" ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} Submit sitemap to Google</button>
        <button onClick={() => call({ action: "covers" }, "covers")} disabled={!!busy} className="btn btn-ghost text-sm">{busy === "covers" ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />} Regenerate blog covers{config.covers ? ` (${config.covers})` : ""}</button>
        <button onClick={() => call({ action: "indexAll" }, "all")} disabled={!!busy} className="btn btn-ghost text-sm">{busy === "all" ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} Ping all blog URLs</button>
      </div>

      <div className="card p-4 grid sm:grid-cols-[1fr_auto_auto] gap-2 items-center">
        <input className="input" placeholder="https://clicksemrus.vercel.app/blog/your-post" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button onClick={() => url && call({ action: "index", urls: [url] }, "index")} disabled={!!busy || !url} className="btn btn-accent text-sm">{busy === "index" ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} Request indexing</button>
        <button onClick={() => url && call({ action: "inspect", url }, "inspect")} disabled={!!busy || !url} className="btn btn-ghost text-sm">{busy === "inspect" ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />} Check index status</button>
        {inspect && <p className="text-xs text-muted sm:col-span-3">{inspect}</p>}
      </div>

      {msg.length > 0 && <div className="card p-3 text-xs text-muted space-y-1">{msg.map((l, i) => <p key={i}>{l}</p>)}</div>}

      <section>
        <div className="flex items-end justify-between gap-3 flex-wrap mb-3">
          <div>
            <h2 className="font-display text-xl font-bold">Keyword opportunities</h2>
            <p className="text-xs text-muted">{snapshot ? `Last 28 days · ${snapshot.totalClicks} clicks · ${snapshot.totalImpressions} impressions · refreshed ${new Date(snapshot.at).toLocaleString()}` : "No Search Console data yet."}</p>
          </div>
        </div>
        <div className="card overflow-x-auto">
          <table className="table">
            <thead><tr><th>Query</th><th>Type</th><th>Impr.</th><th>Clicks</th><th>Pos.</th><th>7d impr.</th><th>Lands on</th><th></th></tr></thead>
            <tbody>
              {(snapshot?.opportunities || []).slice(0, 60).map((o) => (
                <tr key={o.query}>
                  <td className="font-medium">{o.query}</td>
                  <td><span className={`badge ${KIND[o.kind].cls}`}>{KIND[o.kind].label}</span></td>
                  <td>{o.impressions}</td>
                  <td>{o.clicks}</td>
                  <td>{o.position.toFixed(1)}</td>
                  <td>{o.recentImpressions}</td>
                  <td className="text-xs text-muted max-w-[220px] truncate">{o.page.replace(/^https?:\/\/[^/]+/, "")}</td>
                  <td className="text-right"><button onClick={() => call({ action: "write", query: o.query }, o.query)} disabled={!!busy} className="btn btn-ghost text-xs !py-1.5">{busy === o.query ? <Loader2 className="animate-spin" size={14} /> : <><PenLine size={13} /> Write article</>}</button></td>
                </tr>
              ))}
              {!snapshot?.opportunities?.length && <tr><td colSpan={8} className="text-muted">Connect Search Console (service account) and click Refresh to see which queries deserve a dedicated article.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {snapshot?.topQueries?.length ? (
        <section>
          <h2 className="font-display text-xl font-bold mb-3">Top queries (28 days)</h2>
          <div className="card overflow-x-auto">
            <table className="table">
              <thead><tr><th>Query</th><th>Clicks</th><th>Impr.</th><th>CTR</th><th>Pos.</th><th>Page</th></tr></thead>
              <tbody>
                {snapshot.topQueries.map((q) => (
                  <tr key={q.query + q.page}><td className="font-medium">{q.query}</td><td>{q.clicks}</td><td>{q.impressions}</td><td>{(q.ctr * 100).toFixed(1)}%</td><td>{q.position.toFixed(1)}</td><td className="text-xs text-muted max-w-[220px] truncate">{q.page.replace(/^https?:\/\/[^/]+/, "")}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="font-display text-xl font-bold mb-3">Indexing log</h2>
        <div className="card overflow-x-auto">
          <table className="table">
            <thead><tr><th>When</th><th>URL</th><th>Google</th><th>IndexNow</th></tr></thead>
            <tbody>
              {log.map((e, i) => (
                <tr key={i}><td className="text-xs text-muted whitespace-nowrap">{new Date(e.at).toLocaleString()}</td><td className="text-xs break-all">{e.url}</td><td className={`text-xs ${e.google === "ok" ? "text-[#166534]" : "text-muted"}`}>{e.google}</td><td className={`text-xs ${e.indexnow === "ok" ? "text-[#166534]" : "text-muted"}`}>{e.indexnow}</td></tr>
              ))}
              {log.length === 0 && <tr><td colSpan={4} className="text-muted">No pings yet. Every new post will appear here automatically.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
