"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Layers, ArrowUpRight, X, ExternalLink, Loader2 } from "lucide-react";
import type { IgPost } from "@/lib/instagram";
import InstagramIcon from "./InstagramIcon";
import Reveal from "./Reveal";
import { trackEvent } from "./Tracker";

function fmt(ts: string) {
  if (!ts) return "";
  try { return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; }
}

/** Grid of real posts; clicking a tile opens the live Instagram embed in a lightbox. */
export default function InstagramGrid({ posts }: { posts: IgPost[] }) {
  const [active, setActive] = useState<IgPost | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [active]);

  const open = (p: IgPost) => { setLoaded(false); setActive(p); trackEvent("instagram_preview"); };
  const idx = active ? posts.findIndex((p) => p.code === active.code) : -1;
  const go = (d: number) => { const n = posts[idx + d]; if (n) { setLoaded(false); setActive(n); } };

  return (
    <>
      <div className="ig-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-12">
        {posts.map((p, i) => (
          <Reveal key={p.code} delay={(i % 4) * 90}>
            <button type="button" onClick={() => open(p)} className="ig-tile group relative block w-full aspect-square overflow-hidden rounded-2xl bg-[#0b0b14] text-left" aria-label={`Preview Instagram post${p.caption ? `: ${p.caption.slice(0, 60)}` : ""}`}>
              <Image
                src={p.image}
                alt={p.caption || "Instagram post by ClickSemrus"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105"
                unoptimized
              />
              <span className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-black/50 text-white backdrop-blur">
                {p.type === "VIDEO" ? <Play size={14} fill="currentColor" /> : p.type === "CAROUSEL_ALBUM" ? <Layers size={14} /> : <InstagramIcon size={14} />}
              </span>
              <span className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/85 via-black/30 to-transparent">
                {p.caption && <span className="text-xs leading-snug line-clamp-3">{p.caption}</span>}
                <span className="mt-3 flex items-center justify-between text-[11px] font-bold">
                  <span>{fmt(p.timestamp)}</span>
                  <span className="inline-flex items-center gap-1">Live preview <ArrowUpRight size={12} /></span>
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Instagram post preview">
          <div className="absolute inset-0 bg-[#0b0b14]/80 backdrop-blur-sm gp-fade" onClick={() => setActive(null)} />
          <div className="gp-card relative w-full max-w-[420px] max-h-[92vh] rounded-3xl overflow-hidden bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)] flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Image src="/logo-160.png" alt="" width={32} height={32} className="rounded-full" />
              <div className="leading-tight">
                <p className="text-sm font-bold">clicksemrus</p>
                <p className="text-[11px] text-muted">{fmt(active.timestamp) || "Instagram"}</p>
              </div>
              <a href={active.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("instagram_open")} className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline">Open <ExternalLink size={12} /></a>
              <button type="button" onClick={() => setActive(null)} aria-label="Close" className="grid place-items-center w-8 h-8 rounded-full hover:bg-surface-2"><X size={16} /></button>
            </div>
            <div className="relative flex-1 min-h-[420px] bg-[#fafafa]">
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="relative w-full h-full">
                    <Image src={active.image} alt="" fill className="object-cover opacity-40" unoptimized />
                    <span className="absolute inset-0 grid place-items-center text-brand"><Loader2 className="animate-spin" size={28} /></span>
                  </div>
                </div>
              )}
              <iframe
                key={active.code}
                src={`https://www.instagram.com/p/${active.code}/embed/captioned/`}
                title="Instagram post"
                className={`w-full h-[min(72vh,640px)] border-0 transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
                loading="eager"
                allow="encrypted-media; picture-in-picture"
                onLoad={() => setLoaded(true)}
              />
            </div>
            {posts.length > 1 && (
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-border text-xs font-bold">
                <button type="button" disabled={idx <= 0} onClick={() => go(-1)} className="px-3 py-1.5 rounded-full hover:bg-surface-2 disabled:opacity-30">← Newer</button>
                <span className="text-muted">{idx + 1} / {posts.length}</span>
                <button type="button" disabled={idx >= posts.length - 1} onClick={() => go(1)} className="px-3 py-1.5 rounded-full hover:bg-surface-2 disabled:opacity-30">Older →</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
