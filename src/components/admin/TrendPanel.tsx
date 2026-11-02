"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Loader2 } from "lucide-react";

type Row = { title: string; traffic: string; kind: string; category: string; sources: string[]; picture?: string };

export default function TrendPanel({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  async function gen(title?: string) {
    setBusy(title || "__all");
    const res = await fetch("/api/admin/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(title ? { title, force: true } : { limit: 3 }) });
    const j = await res.json();
    setBusy(null);
    setLog((l) => [`${new Date().toLocaleTimeString()} created: ${(j.created || []).join(", ") || "none"}${j.skipped?.length ? ` | already existed: ${j.skipped.join(", ")}` : ""}`, ...l]);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => gen()} disabled={!!busy} className="btn btn-primary text-sm">{busy === "__all" ? <Loader2 className="animate-spin" size={16} /> : <Flame size={16} />} Generate top 3 now</button>
      </div>
      {log.length > 0 && <div className="card p-3 text-xs text-muted space-y-1">{log.map((l, i) => <p key={i}>{l}</p>)}</div>}
      <div className="card overflow-x-auto">
        <table className="table">
          <thead><tr><th>Trend</th><th>Searches</th><th>Type</th><th>Sources</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.title}>
                <td className="font-medium flex items-center gap-2">
                  {r.picture && /* eslint-disable-next-line @next/next/no-img-element */ <img src={r.picture} alt="" className="w-8 h-8 rounded object-cover" />}
                  {r.title}
                </td>
                <td>{r.traffic}</td>
                <td><span className="badge bg-surface-2 text-muted">{r.kind}</span><br /><span className="text-xs text-muted">{r.category}</span></td>
                <td className="text-xs text-muted">{r.sources.join(", ")}</td>
                <td className="text-right"><button onClick={() => gen(r.title)} disabled={!!busy} className="btn btn-ghost text-xs !py-1.5">{busy === r.title ? <Loader2 className="animate-spin" size={14} /> : "Write post"}</button></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="text-muted">Could not load trends right now. Try again in a minute.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
