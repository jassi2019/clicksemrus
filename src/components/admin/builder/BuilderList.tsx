"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, FileEdit, Loader2, Plus, Replace, Trash2 } from "lucide-react";
import { TAKEOVER_PAGES, layoutPath } from "@/lib/builder";
import type { LayoutSummary } from "@/lib/builderStore";

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);

export default function BuilderList({ layouts }: { layouts: LayoutSummary[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [takeover, setTakeover] = useState(TAKEOVER_PAGES.find((p) => !layouts.some((l) => l.slug === p.slug))?.slug ?? TAKEOVER_PAGES[0].slug);
  const [busy, setBusy] = useState<string>("");
  const [error, setError] = useState("");

  const bySlug = new Map(layouts.map((l) => [l.slug, l]));
  const custom = layouts.filter((l) => !TAKEOVER_PAGES.some((p) => p.slug === l.slug));

  async function post(body: Record<string, unknown>) {
    const res = await fetch("/api/admin/builder", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; layout?: { slug: string } };
    if (!res.ok || !j.ok || !j.layout) throw new Error(j.error || "Request failed");
    return j.layout;
  }

  async function createPage(e: React.FormEvent) {
    e.preventDefault();
    setBusy("create");
    setError("");
    try {
      const l = await post({ action: "create", title, slug: slug || slugify(title) });
      router.push(`/admin/builder/${l.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the page");
      setBusy("");
    }
  }

  async function seed() {
    setBusy("seed");
    setError("");
    try {
      const l = await post({ action: "seed", slug: takeover });
      router.push(`/admin/builder/${l.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start from the page");
      setBusy("");
    }
  }

  async function remove(s: string, published: boolean) {
    const msg = published ? `"${s}" is published. Deleting it puts the code version back live. Continue?` : `Delete the draft "${s}"?`;
    if (!confirm(msg)) return;
    setBusy(`del:${s}`);
    try {
      const res = await fetch(`/api/admin/builder?slug=${encodeURIComponent(s)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy("");
    }
  }

  const Status = ({ l }: { l?: LayoutSummary }) =>
    !l ? <span className="badge bg-surface-2 text-muted">code version</span> : l.status === "published" ? <span className="badge bg-lime text-white">published</span> : <span className="badge bg-sun text-[#0b0b14]">draft</span>;

  return (
    <div className="space-y-8">
      {error && <p className="text-sm text-accent">{error}</p>}

      <div className="grid lg:grid-cols-2 gap-4">
        <form onSubmit={createPage} className="card p-5 !transform-none space-y-3">
          <h2 className="font-semibold flex items-center gap-2"><Plus size={16} /> New page</h2>
          <p className="text-xs text-muted">A fresh page at /p/&lt;slug&gt;, e.g. a landing page for a campaign.</p>
          <input className="input" placeholder="Page title" value={title} maxLength={140} onChange={(e) => { setTitle(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }} required />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted shrink-0">/p/</span>
            <input className="input font-mono text-sm" placeholder="slug" value={slug} onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} />
          </div>
          <button className="btn btn-primary text-sm" disabled={busy === "create"}>{busy === "create" ? <Loader2 className="animate-spin" size={16} /> : "Create and open editor"}</button>
        </form>

        <div className="card p-5 !transform-none space-y-3">
          <h2 className="font-semibold flex items-center gap-2"><Replace size={16} /> Take over an existing page</h2>
          <p className="text-xs text-muted">Starts from a copy of the current page so you edit a filled canvas. The code version stays live until you publish, and you can revert any time.</p>
          <select className="input" value={takeover} onChange={(e) => setTakeover(e.target.value)}>
            {TAKEOVER_PAGES.map((p) => (
              <option key={p.slug} value={p.slug}>{p.label} ({p.path}){bySlug.has(p.slug) ? " · already has a layout" : ""}</option>
            ))}
          </select>
          <button onClick={seed} className="btn btn-ghost text-sm" disabled={busy === "seed"}>{busy === "seed" ? <Loader2 className="animate-spin" size={16} /> : bySlug.has(takeover) ? "Open existing layout" : "Start from current page"}</button>
        </div>
      </div>

      <section>
        <h2 className="font-semibold mb-3">Existing pages</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {TAKEOVER_PAGES.map((p) => {
            const l = bySlug.get(p.slug);
            return (
              <div key={p.slug} className="card p-4 !transform-none flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{p.label}</h3>
                    <p className="text-xs text-muted font-mono">{p.path}</p>
                  </div>
                  <Status l={l} />
                </div>
                {l && <p className="text-xs text-muted">{l.blocks} blocks · updated {new Date(l.updatedAt).toLocaleString("en-IN")}</p>}
                <div className="flex gap-2 flex-wrap mt-auto">
                  {l ? (
                    <>
                      <Link href={`/admin/builder/${p.slug}`} className="btn btn-primary text-sm !py-2"><FileEdit size={16} /> Edit</Link>
                      <button onClick={() => remove(p.slug, l.status === "published")} className="btn btn-ghost text-sm !py-2 text-accent" disabled={busy === `del:${p.slug}`}><Trash2 size={16} /> Revert to code</button>
                    </>
                  ) : (
                    <button onClick={() => { setTakeover(p.slug); void (async () => { setBusy("seed"); try { const x = await post({ action: "seed", slug: p.slug }); router.push(`/admin/builder/${x.slug}`); } catch (err) { setError(err instanceof Error ? err.message : "Failed"); setBusy(""); } })(); }} className="btn btn-ghost text-sm !py-2"><Replace size={16} /> Take over</button>
                  )}
                  <a href={p.path} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-sm !py-2"><ExternalLink size={16} /> Live</a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Custom pages</h2>
        {custom.length === 0 ? (
          <p className="text-sm text-muted">No custom pages yet. Create one above.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {custom.map((l) => (
              <div key={l.slug} className="card p-4 !transform-none flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{l.title}</h3>
                    <p className="text-xs text-muted font-mono truncate">{layoutPath(l.slug)}</p>
                  </div>
                  <Status l={l} />
                </div>
                <p className="text-xs text-muted">{l.blocks} blocks · updated {new Date(l.updatedAt).toLocaleString("en-IN")}</p>
                <div className="flex gap-2 flex-wrap mt-auto">
                  <Link href={`/admin/builder/${l.slug}`} className="btn btn-primary text-sm !py-2"><FileEdit size={16} /> Edit</Link>
                  {l.status === "published" && <a href={layoutPath(l.slug)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-sm !py-2"><ExternalLink size={16} /> Live</a>}
                  <button onClick={() => remove(l.slug, l.status === "published")} className="btn btn-ghost text-sm !py-2 text-accent" disabled={busy === `del:${l.slug}`}><Trash2 size={16} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
