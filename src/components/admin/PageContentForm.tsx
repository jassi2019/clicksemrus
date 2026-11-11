"use client";
import { useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import type { Block, ContentValues } from "@/lib/pageContent";

type Values = Record<string, string>;

const toText = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join("\n") : v ?? "");

function initial(blocks: Block[], overrides: ContentValues): Values {
  const out: Values = {};
  for (const b of blocks) out[b.key] = toText(overrides[b.key] ?? b.default);
  return out;
}

export default function PageContentForm({ page, path, blocks, overrides }: { page: string; path: string; blocks: Block[]; overrides: ContentValues }) {
  const [values, setValues] = useState<Values>(() => initial(blocks, overrides));
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");

  const set = (key: string, v: string) => setValues((cur) => ({ ...cur, [key]: v }));
  const isDefault = (b: Block) => values[b.key].trim() === toText(b.default).trim();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setMsg("");
    try {
      const res = await fetch("/api/admin/pages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ page, values }) });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !j.ok) throw new Error(j.error || "Save failed");
      setState("saved");
      setMsg("Saved. The page has been revalidated; reload the preview to see it.");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      {blocks.map((b) => {
        const multi = b.kind !== "text";
        const changed = !isDefault(b);
        return (
          <div key={b.key} className={`card p-4 sm:p-5 !transform-none ${changed ? "border-brand/50" : ""}`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <label htmlFor={`f-${b.key}`} className="text-sm font-medium">
                {b.label}
                {changed && <span className="badge bg-brand text-white ml-2 align-middle">edited</span>}
              </label>
              <button type="button" onClick={() => set(b.key, toText(b.default))} disabled={!changed} className="text-xs text-muted hover:text-fg disabled:opacity-40 inline-flex items-center gap-1 shrink-0">
                <RotateCcw size={12} /> Reset to default
              </button>
            </div>
            {b.hint && <p className="text-xs text-muted mb-2">{b.hint}</p>}
            {b.kind === "list" && <p className="text-xs text-muted mb-2">One item per line.</p>}
            {multi ? (
              <textarea id={`f-${b.key}`} className={`input font-mono text-sm ${b.kind === "markdown" ? "min-h-56" : b.kind === "list" ? "min-h-28" : "min-h-20"}`} value={values[b.key]} onChange={(e) => set(b.key, e.target.value)} />
            ) : (
              <input id={`f-${b.key}`} className="input" value={values[b.key]} onChange={(e) => set(b.key, e.target.value)} maxLength={300} />
            )}
          </div>
        );
      })}
      <div className="flex items-center gap-3 flex-wrap sticky bottom-0 bg-bg-2/95 backdrop-blur py-3">
        <button className="btn btn-primary" disabled={state === "saving"}>
          {state === "saving" ? <Loader2 className="animate-spin" size={18} /> : "Save"}
        </button>
        <a href={path} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-sm">Preview page</a>
        {msg && <p className={`text-sm ${state === "error" ? "text-accent" : "text-lime"}`}>{msg}</p>}
      </div>
    </form>
  );
}
