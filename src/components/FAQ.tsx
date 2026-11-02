"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
      {items.map((f, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 font-semibold hover:bg-surface-2"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{f.q}</span>
            {open === i ? <Minus size={18} className="shrink-0 text-brand-2" /> : <Plus size={18} className="shrink-0 text-brand-2" />}
          </button>
          {open === i && <p className="px-5 pb-5 text-muted leading-relaxed">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
