"use client";
import { useState } from "react";
import { Copy, Check, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import type { ShareKit } from "@/lib/social";

type Row = { slug: string; title: string; publishedAt: string; kit: ShareKit | null };
const CHANNELS: { key: keyof Omit<ShareKit, "at">; label: string }[] = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "x", label: "X / Twitter" },
];

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="btn btn-ghost !py-1.5 !px-3 text-xs"
    >
      {done ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
    </button>
  );
}

export default function ShareKitPanel({ rows: initial }: { rows: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");

  async function generate(slug: string) {
    setBusy(slug); setErr("");
    const res = await fetch("/api/admin/share", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug }) });
    const j = (await res.json().catch(() => ({}))) as { ok?: boolean; kit?: ShareKit; error?: string };
    if (j.ok && j.kit) setRows((rs) => rs.map((r) => (r.slug === slug ? { ...r, kit: j.kit! } : r)));
    else setErr(j.error || "Could not generate");
    setBusy(null);
  }

  return (
    <div className="space-y-5">
      {err && <p className="text-accent text-sm">{err}</p>}
      {rows.map((r) => (
        <details key={r.slug} className="card p-5" open={rows[0]?.slug === r.slug}>
          <summary className="cursor-pointer flex items-center justify-between gap-3">
            <span className="font-semibold">{r.title}</span>
            <span className="text-xs text-muted shrink-0">{new Date(r.publishedAt).toLocaleDateString("en-IN")} {r.kit ? "· kit ready" : "· no kit yet"}</span>
          </summary>
          <div className="mt-4 flex gap-2 flex-wrap">
            <a href={`/blog/${r.slug}`} target="_blank" className="btn btn-ghost !py-1.5 !px-3 text-xs"><ExternalLink size={14} /> Open article</a>
            <button type="button" disabled={busy === r.slug} onClick={() => generate(r.slug)} className="btn btn-primary !py-1.5 !px-3 text-xs">
              {busy === r.slug ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />} {r.kit ? "Regenerate" : "Generate kit"}
            </button>
          </div>
          {r.kit && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {CHANNELS.map((c) => (
                <div key={c.key} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold">{c.label}</span>
                    <CopyBtn text={r.kit![c.key]} />
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-muted font-sans leading-relaxed">{r.kit![c.key]}</pre>
                </div>
              ))}
            </div>
          )}
        </details>
      ))}
    </div>
  );
}
