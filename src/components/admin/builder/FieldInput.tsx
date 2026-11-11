"use client";
import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronRight, ChevronUp, Copy, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { SERVICES, WORK } from "@/lib/site";
import { asItems, str, strList, type Field } from "@/lib/builder";
import BuilderIcon from "@/components/builder/BuilderIcon";

type Props = { field: Field; value: unknown; onChange: (v: unknown) => void };

/** Renders the right input for a block field. Used by the builder's block form, recursively for list items. */
export default function FieldInput({ field, value, onChange }: Props) {
  const id = useId();
  const label = (
    <label htmlFor={id} className="block text-sm font-medium">
      {field.label}
    </label>
  );
  const hint = field.hint ? <p className="text-xs text-muted mt-1">{field.hint}</p> : null;

  switch (field.kind) {
    case "text":
    case "link":
      return (
        <div>
          {label}
          <input id={id} className="input mt-1" value={str(value)} placeholder={field.placeholder} maxLength={field.kind === "link" ? 500 : 300} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      );
    case "textarea":
      return (
        <div>
          {label}
          <textarea id={id} className="input mt-1 min-h-24" value={str(value)} placeholder={field.placeholder} maxLength={4000} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      );
    case "markdown":
      return (
        <div>
          {label}
          <textarea id={id} className="input mt-1 min-h-48 font-mono text-sm" value={str(value)} placeholder={field.placeholder} maxLength={60000} onChange={(e) => onChange(e.target.value)} spellCheck={false} />
          {hint}
        </div>
      );
    case "number":
      return (
        <div>
          {label}
          <input id={id} type="number" className="input mt-1" value={typeof value === "number" ? value : str(value)} min={field.min} max={field.max} step="any" onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />
          {hint}
        </div>
      );
    case "select":
      return (
        <div>
          {label}
          <select id={id} className="input mt-1" value={str(value)} onChange={(e) => onChange(e.target.value)}>
            {(field.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {hint}
        </div>
      );
    case "icon":
      return (
        <div>
          {label}
          <div className="flex items-center gap-2 mt-1">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#0b0b14] text-white shrink-0"><BuilderIcon name={str(value)} size={18} /></span>
            <select id={id} className="input" value={str(value)} onChange={(e) => onChange(e.target.value)}>
              {(field.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {hint}
        </div>
      );
    case "toggle":
      return (
        <div>
          <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
            <input id={id} type="checkbox" className="accent-[#4f46e5] w-4 h-4" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
            {field.label}
          </label>
          {hint}
        </div>
      );
    case "color":
      return (
        <div>
          {label}
          <div className="flex items-center gap-2 mt-1">
            <input id={id} type="color" className="w-10 h-10 rounded-lg border border-border bg-transparent" value={/^#[0-9a-f]{6}$/i.test(str(value)) ? str(value) : "#4f46e5"} onChange={(e) => onChange(e.target.value)} />
            <input className="input font-mono text-sm" value={str(value)} placeholder="#4f46e5" onChange={(e) => onChange(e.target.value)} />
          </div>
          {hint}
        </div>
      );
    case "image":
      return <ImageField id={id} field={field} value={str(value)} onChange={onChange} />;
    case "services":
      return <PickField id={id} field={field} value={strList(value)} onChange={onChange} options={SERVICES.map((s) => ({ value: s.slug, label: s.name }))} />;
    case "work":
      return <PickField id={id} field={field} value={strList(value)} onChange={onChange} options={WORK.map((w) => ({ value: w.slug, label: w.title }))} />;
    case "list":
      return <ListField field={field} value={asItems(value)} onChange={onChange} />;
    default:
      return null;
  }
}

/* ---------------------------------------------------------------- image */
function ImageField({ id, field, value, onChange }: { id: string; field: Field; value: string; onChange: (v: unknown) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !j.ok || !j.url) throw new Error(j.error || "Upload failed");
      onChange(j.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">{field.label}</label>
      <div className="flex gap-2 mt-1">
        <input id={id} className="input font-mono text-sm" value={value} placeholder="https://… or upload" onChange={(e) => onChange(e.target.value)} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="btn btn-ghost text-sm !py-2 !px-3 shrink-0" title="Upload an image (max 4 MB)">
          {busy ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />} <span className="hidden sm:inline">Upload</span>
        </button>
        {value && <button type="button" onClick={() => onChange("")} className="btn btn-ghost text-sm !py-2 !px-3 shrink-0" title="Clear"><X size={16} /></button>}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); }} />
      {value && (
        <div className="mt-2 rounded-xl border border-border overflow-hidden bg-surface-2 max-w-xs">
          <Image src={value} alt="" width={320} height={180} unoptimized className="w-full h-auto max-h-40 object-contain" />
        </div>
      )}
      {error && <p className="text-xs text-accent mt-1">{error}</p>}
      {field.hint && <p className="text-xs text-muted mt-1">{field.hint}</p>}
      <p className="text-xs text-muted mt-1">JPG, PNG, WebP, GIF or SVG up to 4 MB.</p>
    </div>
  );
}

/* ---------------------------------------------------------------- multi pick */
function PickField({ id, field, value, onChange, options }: { id: string; field: Field; value: string[]; onChange: (v: unknown) => void; options: { value: string; label: string }[] }) {
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div>
      <p className="text-sm font-medium" id={id}>{field.label}</p>
      {field.hint && <p className="text-xs text-muted mt-1">{field.hint}</p>}
      <div className="mt-2 grid gap-1.5 max-h-56 overflow-y-auto pr-1" role="group" aria-labelledby={id}>
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="accent-[#4f46e5] w-4 h-4" checked={value.includes(o.value)} onChange={() => toggle(o.value)} />
            <span className="truncate">{o.label}</span>
          </label>
        ))}
      </div>
      {value.length > 0 && <button type="button" onClick={() => onChange([])} className="text-xs text-muted hover:text-fg mt-2">Clear selection (show all)</button>}
    </div>
  );
}

/* ---------------------------------------------------------------- list of items */
function ListField({ field, value, onChange }: { field: Field; value: Record<string, unknown>[]; onChange: (v: unknown) => void }) {
  const [open, setOpen] = useState<number | null>(value.length ? 0 : null);
  const sub = field.fields ?? [];
  const labelKey = field.itemLabelKey ?? sub[0]?.key ?? "";

  const update = (i: number, key: string, v: unknown) => onChange(value.map((it, k) => (k === i ? { ...it, [key]: v } : it)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(j);
  };
  const remove = (i: number) => { onChange(value.filter((_, k) => k !== i)); setOpen(null); };
  const duplicate = (i: number) => { const next = [...value]; next.splice(i + 1, 0, { ...value[i] }); onChange(next); setOpen(i + 1); };
  const add = () => { onChange([...value, { ...(field.itemDefault ?? {}) }]); setOpen(value.length); };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{field.label} <span className="text-muted font-normal">({value.length})</span></p>
        <button type="button" onClick={add} className="text-xs font-semibold text-brand inline-flex items-center gap-1"><Plus size={14} /> Add</button>
      </div>
      {field.hint && <p className="text-xs text-muted mt-1">{field.hint}</p>}
      <div className="mt-2 space-y-2">
        {value.map((it, i) => {
          const isOpen = open === i;
          const title = str(it[labelKey]) || `Item ${i + 1}`;
          return (
            <div key={i} className="rounded-xl border border-border bg-surface">
              <div className="flex items-center gap-1 px-2 py-1.5">
                <button type="button" onClick={() => setOpen(isOpen ? null : i)} className="flex-1 min-w-0 flex items-center gap-2 text-left text-sm font-medium py-1" aria-expanded={isOpen}>
                  {isOpen ? <ChevronDown size={14} className="shrink-0 text-muted" /> : <ChevronRight size={14} className="shrink-0 text-muted" />}
                  <span className="text-muted text-xs w-5 shrink-0">{i + 1}.</span>
                  <span className="truncate">{title}</span>
                </button>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 text-muted hover:text-fg disabled:opacity-30" title="Move up"><ChevronUp size={14} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="p-1.5 text-muted hover:text-fg disabled:opacity-30" title="Move down"><ChevronDown size={14} /></button>
                <button type="button" onClick={() => duplicate(i)} className="p-1.5 text-muted hover:text-fg" title="Duplicate"><Copy size={14} /></button>
                <button type="button" onClick={() => remove(i)} className="p-1.5 text-muted hover:text-accent" title="Delete"><Trash2 size={14} /></button>
              </div>
              {isOpen && (
                <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border">
                  {sub.map((f) => <FieldInput key={f.key} field={f} value={it[f.key]} onChange={(v) => update(i, f.key, v)} />)}
                </div>
              )}
            </div>
          );
        })}
        {value.length === 0 && <p className="text-xs text-muted">No items yet.</p>}
      </div>
    </div>
  );
}
