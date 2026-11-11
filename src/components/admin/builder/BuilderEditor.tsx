"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ChevronDown, ChevronRight, ChevronUp, Code2, Columns2, Copy, ExternalLink, Eye, GripVertical, Hash, HelpCircle, Image as ImageIcon, Images, LayoutGrid, ListOrdered, Loader2, Mail,
  Megaphone, Monitor, MoveVertical, Plus, Quote, RefreshCw, Rocket, Save, Smartphone, Sparkles, Trash2, Type, Undo2, Briefcase, AlertTriangle, type LucideIcon,
} from "lucide-react";
import { BLOCK_DEFS, BLOCK_GROUPS, BLOCK_TYPES, isTakeoverSlug, layoutPath, newBlock, newId, str, type Block, type BlockType, type PageLayout } from "@/lib/builder";
import FieldInput from "./FieldInput";

const PALETTE_ICONS: Record<string, LucideIcon> = { Sparkles, Type, LayoutGrid, Hash, ListOrdered, Briefcase, Images, Quote, HelpCircle, Megaphone, Mail, Image: ImageIcon, Columns2, MoveVertical, Code2 };
const PaletteIcon = ({ name, size = 16 }: { name: string; size?: number }) => {
  const I = PALETTE_ICONS[name] || Sparkles;
  return <I size={size} />;
};

/** One-line summary of a block for the list. */
function summary(b: Block): string {
  const p = b.props;
  return str(p.headline) || str(p.heading) || str(p.title) || str(p.body).split("\n")[0] || str(p.caption) || str(p.alt) || str(p.url) || "";
}

const draftKey = (slug: string) => `builder:draft:${slug}`;

type SaveState = "idle" | "saving" | "saved" | "error";

export default function BuilderEditor({ initial }: { initial: PageLayout }) {
  const router = useRouter();
  const [layout, setLayout] = useState<PageLayout>(initial);
  const [selected, setSelected] = useState<string | null>(initial.blocks[0]?.id ?? null);
  const [dirty, setDirty] = useState(false);
  const [state, setState] = useState<SaveState>("idle");
  const [msg, setMsg] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState<Record<string, boolean>>({ Layout: true, Content: true, Proof: true, Conversion: true, Advanced: false });
  const [previewKey, setPreviewKey] = useState(0);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [restorable, setRestorable] = useState<PageLayout | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const takeover = isTakeoverSlug(layout.slug);
  const publicPath = layoutPath(layout.slug);
  const previewSrc = `/p/preview/${layout.slug}?v=${previewKey}`;
  const current = useMemo(() => layout.blocks.find((b) => b.id === selected) ?? null, [layout.blocks, selected]);

  /* ---------------------------------------------------------------- local autosave */
  useEffect(() => {
    // Deferred so the check runs after hydration, outside the effect body itself.
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(draftKey(initial.slug));
        if (!raw) return;
        const saved = JSON.parse(raw) as { savedAt: string; layout: PageLayout };
        if (saved.savedAt > initial.updatedAt && JSON.stringify(saved.layout.blocks) !== JSON.stringify(initial.blocks)) setRestorable(saved.layout);
        else localStorage.removeItem(draftKey(initial.slug));
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(t);
  }, [initial]);

  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey(layout.slug), JSON.stringify({ savedAt: new Date().toISOString(), layout }));
      } catch {
        /* storage full or blocked */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [layout, dirty]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  /* ---------------------------------------------------------------- mutations */
  const patch = useCallback((fn: (l: PageLayout) => PageLayout) => {
    setLayout((l) => fn(l));
    setDirty(true);
    setState("idle");
  }, []);

  const setBlocks = (fn: (b: Block[]) => Block[]) => patch((l) => ({ ...l, blocks: fn(l.blocks) }));
  const setProp = (id: string, key: string, v: unknown) => setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, props: { ...b.props, [key]: v } } : b)));

  function addBlock(type: BlockType) {
    const b = newBlock(type);
    setBlocks((bs) => {
      const i = selected ? bs.findIndex((x) => x.id === selected) : -1;
      const next = [...bs];
      next.splice(i === -1 ? bs.length : i + 1, 0, b);
      return next;
    });
    setSelected(b.id);
    setPaletteOpen(false);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  const move = (id: string, dir: -1 | 1) =>
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i === -1 || j < 0 || j >= bs.length) return bs;
      const next = [...bs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const duplicate = (id: string) => {
    const copy: Block = { ...layout.blocks.find((b) => b.id === id)!, id: newId() };
    copy.props = structuredClone(copy.props);
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === id);
      const next = [...bs];
      next.splice(i + 1, 0, copy);
      return next;
    });
    setSelected(copy.id);
  };
  const remove = (id: string) => {
    const i = layout.blocks.findIndex((b) => b.id === id);
    setBlocks((bs) => bs.filter((b) => b.id !== id));
    if (selected === id) setSelected(layout.blocks[i + 1]?.id ?? layout.blocks[i - 1]?.id ?? null);
  };
  function dropOn(targetId: string) {
    if (!dragId || dragId === targetId) return;
    setBlocks((bs) => {
      const from = bs.findIndex((b) => b.id === dragId);
      const to = bs.findIndex((b) => b.id === targetId);
      if (from === -1 || to === -1) return bs;
      const next = [...bs];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDragId(null);
  }

  /* ---------------------------------------------------------------- server actions */
  const api = useCallback(async (action: "save" | "publish" | "unpublish", l: PageLayout) => {
    setState("saving");
    setMsg("");
    try {
      const res = await fetch("/api/admin/builder", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, layout: l }) });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; layout?: PageLayout };
      if (!res.ok || !j.ok || !j.layout) throw new Error(j.error || "Save failed");
      setLayout((cur) => ({ ...cur, status: j.layout!.status, updatedAt: j.layout!.updatedAt }));
      setDirty(false);
      setState("saved");
      try {
        localStorage.removeItem(draftKey(l.slug));
      } catch {
        /* ignore */
      }
      setMsg(action === "publish" ? `Published. Live at ${publicPath}` : action === "unpublish" ? "Unpublished. The code version is live again." : "Draft saved.");
      setPreviewKey((k) => k + 1);
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Save failed");
    }
  }, [publicPath]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void api("save", layout);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [api, layout]);

  async function revert() {
    const msgText = takeover
      ? `Delete this layout and show the original code version of ${publicPath} again?`
      : `Delete this page? ${layout.status === "published" ? "It is live right now and the link will stop working." : ""}`;
    if (!confirm(msgText)) return;
    setState("saving");
    const res = await fetch(`/api/admin/builder?slug=${encodeURIComponent(layout.slug)}`, { method: "DELETE" });
    if (res.ok) {
      try {
        localStorage.removeItem(draftKey(layout.slug));
      } catch {
        /* ignore */
      }
      setDirty(false);
      router.push("/admin/builder");
    } else {
      setState("error");
      setMsg("Delete failed");
    }
  }

  async function reseed() {
    if (!confirm("Replace every block with a fresh copy of the current code version of this page? Your edits in this layout are lost.")) return;
    setState("saving");
    const res = await fetch("/api/admin/builder", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "reseed", slug: layout.slug }) });
    const j = (await res.json().catch(() => ({}))) as { ok?: boolean; layout?: PageLayout; error?: string };
    if (res.ok && j.ok && j.layout) {
      setLayout(j.layout);
      setSelected(j.layout.blocks[0]?.id ?? null);
      setDirty(false);
      setState("saved");
      setMsg("Reset to the current page.");
      setPreviewKey((k) => k + 1);
    } else {
      setState("error");
      setMsg(j.error || "Reset failed");
    }
  }

  const published = layout.status === "published";

  return (
    <div className="space-y-4 -mt-2">
      {/* top bar */}
      <div className="sticky top-[57px] md:top-0 z-30 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-bg-2/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/admin/builder" className="text-xs text-muted inline-flex items-center gap-1 hover:text-fg shrink-0"><ArrowLeft size={14} /> Builder</Link>
          <input className="input !py-2 font-display font-bold text-lg flex-1 min-w-[12rem]" value={layout.title} maxLength={140} onChange={(e) => patch((l) => ({ ...l, title: e.target.value }))} aria-label="Page title" />
          <span className="text-xs font-mono text-muted hidden sm:inline truncate max-w-[14rem]">{publicPath}</span>
          <span className={`badge ${published ? "bg-lime text-white" : "bg-sun text-[#0b0b14]"}`}>{published ? "published" : "draft"}</span>
          {dirty && <span className="text-xs text-muted">unsaved</span>}
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <button onClick={() => api("save", layout)} disabled={state === "saving"} className="btn btn-primary text-sm !py-2">{state === "saving" ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save draft</button>
          {published ? (
            <button onClick={() => api("unpublish", layout)} disabled={state === "saving"} className="btn btn-ghost text-sm !py-2"><Undo2 size={16} /> Unpublish</button>
          ) : (
            <button onClick={() => api("publish", layout)} disabled={state === "saving"} className="btn btn-accent text-sm !py-2"><Rocket size={16} /> Publish</button>
          )}
          <a href={previewSrc} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-sm !py-2"><Eye size={16} /> Open preview</a>
          {published && <a href={publicPath} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-sm !py-2"><ExternalLink size={16} /> Live page</a>}
          <button onClick={() => setSeoOpen((v) => !v)} className="btn btn-ghost text-sm !py-2" aria-expanded={seoOpen}>SEO {seoOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
          <div className="flex-1" />
          {takeover && <button onClick={reseed} className="text-xs text-muted hover:text-fg inline-flex items-center gap-1"><RefreshCw size={12} /> Reset from code</button>}
          <button onClick={revert} className="text-xs text-accent inline-flex items-center gap-1"><Trash2 size={12} /> {takeover ? "Revert to code version" : "Delete page"}</button>
        </div>
        {msg && <p className={`text-xs mt-2 ${state === "error" ? "text-accent" : "text-lime"}`}>{msg}</p>}
        {seoOpen && (
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <label className="text-sm">
              <span className="font-medium">SEO title</span>
              <input className="input mt-1" value={layout.seoTitle ?? ""} maxLength={160} placeholder={layout.title} onChange={(e) => patch((l) => ({ ...l, seoTitle: e.target.value }))} />
            </label>
            <label className="text-sm">
              <span className="font-medium">Meta description</span>
              <textarea className="input mt-1 min-h-10" value={layout.seoDescription ?? ""} maxLength={320} onChange={(e) => patch((l) => ({ ...l, seoDescription: e.target.value }))} />
            </label>
            {takeover && <p className="text-xs text-muted sm:col-span-2">This page keeps the metadata set in code; SEO fields here are stored for reference only. Custom pages under /p/ use them.</p>}
          </div>
        )}
      </div>

      {restorable && (
        <div className="card p-4 !transform-none border-sun/60 bg-sun/10 flex gap-3 items-start text-sm">
          <AlertTriangle size={18} className="text-sun shrink-0 mt-0.5" />
          <div className="flex-1">
            <p><strong>Unsaved changes found</strong> from an earlier session on this device.</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => { setLayout({ ...restorable, status: layout.status }); setSelected(restorable.blocks[0]?.id ?? null); setDirty(true); setRestorable(null); }} className="btn btn-primary text-xs !py-1.5">Restore</button>
              <button onClick={() => { try { localStorage.removeItem(draftKey(layout.slug)); } catch { /* ignore */ } setRestorable(null); }} className="btn btn-ghost text-xs !py-1.5">Discard</button>
            </div>
          </div>
        </div>
      )}

      {/* editor */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-4 items-start">
        {/* block list */}
        <aside className="card p-3 !transform-none lg:sticky lg:top-[7.5rem] space-y-3 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold px-1">Blocks ({layout.blocks.length})</h2>
            <button onClick={() => setPaletteOpen((v) => !v)} className="btn btn-primary text-xs !py-1.5 !px-3" aria-expanded={paletteOpen}><Plus size={14} /> Add block</button>
          </div>

          {paletteOpen && (
            <div className="rounded-xl border border-border bg-surface-2/60 p-2 space-y-1">
              {BLOCK_GROUPS.map((g) => {
                const types = BLOCK_TYPES.filter((t) => BLOCK_DEFS[t].group === g);
                const open = groupOpen[g] !== false;
                return (
                  <div key={g}>
                    <button onClick={() => setGroupOpen((o) => ({ ...o, [g]: !open }))} className="w-full flex items-center justify-between text-[11px] font-bold tracking-widest uppercase text-muted px-1 py-1">
                      {g} {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                    {open && (
                      <div className="grid gap-1 mb-1">
                        {types.map((t) => (
                          <button key={t} onClick={() => addBlock(t)} className="flex items-start gap-2 text-left px-2 py-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border">
                            <span className="grid place-items-center w-7 h-7 rounded-lg bg-[#0b0b14] text-white shrink-0 mt-0.5"><PaletteIcon name={BLOCK_DEFS[t].icon} size={14} /></span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium">{BLOCK_DEFS[t].label}</span>
                              <span className="block text-[11px] text-muted leading-snug">{BLOCK_DEFS[t].description}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <ol className="space-y-1">
            {layout.blocks.map((b, i) => {
              const def = BLOCK_DEFS[b.type];
              const active = b.id === selected;
              return (
                <li
                  key={b.id}
                  draggable
                  onDragStart={() => setDragId(b.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dropOn(b.id)}
                  onDragEnd={() => setDragId(null)}
                  className={`group rounded-xl border ${active ? "border-brand bg-brand/5" : "border-border bg-surface"} ${dragId === b.id ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-1 pl-1 pr-1 py-1">
                    <span className="text-muted/60 cursor-grab touch-none hidden sm:block" title="Drag to reorder"><GripVertical size={14} /></span>
                    <button onClick={() => { setSelected(b.id); formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="flex-1 min-w-0 flex items-center gap-2 text-left py-1">
                      <span className="grid place-items-center w-7 h-7 rounded-lg bg-[#0b0b14] text-white shrink-0"><PaletteIcon name={def.icon} size={13} /></span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold leading-tight">{i + 1}. {def.label}{b.type === "html" && <span className="ml-1 text-[10px] text-sun font-bold">RAW</span>}</span>
                        <span className="block text-[11px] text-muted truncate">{summary(b) || def.description}</span>
                      </span>
                    </button>
                    <div className="flex flex-col">
                      <button onClick={() => move(b.id, -1)} disabled={i === 0} className="p-0.5 text-muted hover:text-fg disabled:opacity-30" title="Move up"><ChevronUp size={13} /></button>
                      <button onClick={() => move(b.id, 1)} disabled={i === layout.blocks.length - 1} className="p-0.5 text-muted hover:text-fg disabled:opacity-30" title="Move down"><ChevronDown size={13} /></button>
                    </div>
                    <button onClick={() => duplicate(b.id)} className="p-1 text-muted hover:text-fg" title="Duplicate"><Copy size={13} /></button>
                    <button onClick={() => { if (confirm(`Delete the ${def.label} block?`)) remove(b.id); }} className="p-1 text-muted hover:text-accent" title="Delete"><Trash2 size={13} /></button>
                  </div>
                </li>
              );
            })}
          </ol>
          {layout.blocks.length === 0 && <p className="text-xs text-muted px-1">The page is empty. Add a block to begin.</p>}
        </aside>

        {/* selected block form */}
        <div ref={formRef} className="card p-4 sm:p-6 !transform-none scroll-mt-40 min-h-[20rem]">
          {current ? (
            <BlockForm key={current.id} block={current} onChange={(k, v) => setProp(current.id, k, v)} />
          ) : (
            <p className="text-sm text-muted">Select a block on the left to edit it, or add one.</p>
          )}
        </div>
      </div>

      {/* preview */}
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-semibold text-sm">Preview <span className="text-muted font-normal">· shows the last saved version{dirty ? ", save to refresh" : ""}</span></h2>
          <div className="flex items-center gap-1">
            <button onClick={() => setDevice("desktop")} className={`p-2 rounded-lg ${device === "desktop" ? "bg-[#0b0b14] text-white" : "text-muted hover:text-fg"}`} title="Desktop"><Monitor size={16} /></button>
            <button onClick={() => setDevice("mobile")} className={`p-2 rounded-lg ${device === "mobile" ? "bg-[#0b0b14] text-white" : "text-muted hover:text-fg"}`} title="Phone"><Smartphone size={16} /></button>
            <button onClick={() => setPreviewKey((k) => k + 1)} className="p-2 rounded-lg text-muted hover:text-fg" title="Reload preview"><RefreshCw size={16} /></button>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface-2 p-2 sm:p-3 overflow-hidden">
          <iframe key={previewKey} src={previewSrc} title="Page preview" className={`bg-white rounded-xl border border-border mx-auto block h-[75vh] ${device === "mobile" ? "w-[390px] max-w-full" : "w-full"}`} />
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- block form */
function BlockForm({ block, onChange }: { block: Block; onChange: (key: string, v: unknown) => void }) {
  const def = BLOCK_DEFS[block.type];
  const values = { ...def.defaults, ...block.props };
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#0b0b14] text-white shrink-0"><PaletteIcon name={def.icon} size={18} /></span>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold">{def.label}</h2>
          <p className="text-xs text-muted">{def.description} · anchor <span className="font-mono">#{block.id}</span></p>
        </div>
      </div>
      {block.type === "html" && (
        <div className="rounded-xl border border-sun/60 bg-sun/10 p-3 text-xs flex gap-2 items-start">
          <AlertTriangle size={14} className="text-sun shrink-0 mt-0.5" />
          <p><strong>Raw HTML.</strong> Rendered exactly as written on the live page. Broken tags can break the layout below this block. Scripts, iframes and inline event handlers are removed automatically.</p>
        </div>
      )}
      <div className="grid gap-4">
        {def.fields.map((f) => <FieldInput key={f.key} field={f} value={values[f.key]} onChange={(v) => onChange(f.key, v)} />)}
      </div>
    </div>
  );
}
