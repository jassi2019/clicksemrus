"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { WorkItem, WorkType } from "@/lib/site";

const TABS: { key: "all" | WorkType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "website", label: "Websites" },
  { key: "creative", label: "Creatives" },
  { key: "reel", label: "Reels" },
];

const TYPE_LABEL: Record<WorkType, string> = { website: "Website", creative: "Creative", reel: "Reel" };

export default function WorkGrid({ items, limit, showTabs = true }: { items: WorkItem[]; limit?: number; showTabs?: boolean }) {
  const [tab, setTab] = useState<"all" | WorkType>("all");
  const visible = items.filter((w) => tab === "all" || w.type === tab).slice(0, limit ?? items.length);

  return (
    <div>
      {showTabs && (
        <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filter work">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${tab === t.key ? "bg-[#0b0b14] text-white border-transparent" : "border-border bg-surface hover:bg-surface-2"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div key={tab} className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ${showTabs ? "mt-8" : ""}`}>
        {visible.map((w, i) => (
          <Link
            key={w.slug}
            href={`/case-studies/${w.slug}`}
            className="card overflow-hidden group flex flex-col work-card"
            style={{ animationDelay: `${(i % 6) * 70}ms` }}
          >
            <div className="relative aspect-[3/2] overflow-hidden bg-bg-2">
              <Image src={w.cover} alt={w.title} width={1200} height={800} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
              <span className="absolute top-3 left-3 badge bg-white/90 text-fg border border-border backdrop-blur">{w.industry}</span>
              <span className="absolute top-3 right-3 badge bg-[#0b0b14] text-white">{TYPE_LABEL[w.type]}</span>
            </div>
            <div className="p-5 flex flex-col gap-2 flex-1">
              <h3 className="font-display text-xl font-bold leading-snug group-hover:text-brand transition">{w.title}</h3>
              <p className="text-sm font-semibold flex items-start gap-1.5 text-lime"><TrendingUp size={16} className="shrink-0 mt-0.5" /> {w.result}</p>
              <p className="text-sm text-muted line-clamp-2">{w.summary}</p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-brand mt-auto pt-3 group-hover:gap-2 transition-all">View project <ArrowRight size={14} /></span>
            </div>
          </Link>
        ))}
      </div>
      {visible.length === 0 && <p className="text-muted mt-8">No projects in this category yet.</p>}
    </div>
  );
}
