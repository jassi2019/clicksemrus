"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, ExternalLink, Monitor, Smartphone, X, MousePointer2 } from "lucide-react";
import FacebookIcon from "./FacebookIcon";
import type { WorkItem, WorkType } from "@/lib/site";
import InstagramIcon from "./InstagramIcon";
import { trackEvent } from "./Tracker";

const TABS: { key: "all" | WorkType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "website", label: "Websites" },
  { key: "creative", label: "Creatives" },
  { key: "reel", label: "Reels" },
];
const TYPE_LABEL: Record<WorkType, string> = { website: "Website", creative: "Creative", reel: "Reel" };

/** Default screenshot dimensions (overridden per item when known). */
const DESK: [number, number] = [1200, 6000];
const MOB: [number, number] = [390, 8000];

/** CSS vars for the scroll animation: distance and duration from image height vs. frame height. */
function scrollVars(size: [number, number], frameAspect: number): React.CSSProperties {
  const [w, h] = size;
  const frameH = w / frameAspect; // frame height in image pixels
  const shift = Math.max(0, 1 - frameH / h); // fraction of image height to travel
  const dur = Math.max(6, Math.round((h - frameH) / 110)); // about 110px per second
  return { "--shift": `${(-shift * 100).toFixed(2)}%`, "--dur": `${dur}s`, "--play": `${Math.round(dur * 2.2)}s` } as React.CSSProperties;
}

function host(url?: string) {
  try { return url ? new URL(url).host.replace(/^www\./, "") : ""; } catch { return ""; }
}

/** Browser chrome around a tall screenshot; the image scrolls on hover (desktop) or always (when `play`). */
function BrowserFrame({ src, alt, play, className = "", size = DESK }: { src: string; alt: string; play?: boolean; className?: string; size?: [number, number] }) {
  return (
    <div className={`work-frame ${play ? "is-playing" : ""} ${className}`} style={scrollVars(size, 3 / 2)}>
      <div className="work-frame__bar">
        <span /><span /><span />
        <i className="work-frame__url">{alt}</i>
      </div>
      <div className="work-frame__view">
        <Image src={src} alt={alt} width={size[0]} height={size[1]} className="work-frame__img" sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" />
      </div>
    </div>
  );
}

function PhoneFrame({ src, alt, play, size = MOB }: { src: string; alt: string; play?: boolean; size?: [number, number] }) {
  return (
    <div className={`work-phone ${play ? "is-playing" : ""}`} style={scrollVars(size, 390 / 844)}>
      <span className="work-phone__notch" />
      <div className="work-phone__view">
        <Image src={src} alt={alt} width={size[0]} height={size[1]} className="work-phone__img" sizes="260px" />
      </div>
    </div>
  );
}

export default function WorkGrid({ items, limit, showTabs = true }: { items: WorkItem[]; limit?: number; showTabs?: boolean }) {
  const [tab, setTab] = useState<"all" | WorkType>("all");
  const [active, setActive] = useState<WorkItem | null>(null);
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  const visible = items.filter((w) => tab === "all" || w.type === tab).slice(0, limit ?? items.length);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [active]);

  const openPreview = (w: WorkItem) => {
    setView(typeof window !== "undefined" && window.innerWidth < 640 && w.shotMobile ? "mobile" : "desktop");
    setActive(w);
    trackEvent("work_preview");
  };

  return (
    <div>
      {showTabs && (
        <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filter work">
          {TABS.map((t) => (
            <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${tab === t.key ? "bg-[#0b0b14] text-white border-transparent" : "border-border bg-surface hover:bg-surface-2"}`}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div key={tab} className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ${showTabs ? "mt-8" : ""}`}>
        {visible.map((w, i) => (
          <article key={w.slug} className="card overflow-hidden group flex flex-col work-card" style={{ animationDelay: `${(i % 6) * 70}ms` }}>
            {w.shotDesktop ? (
              <button type="button" onClick={() => openPreview(w)} className="relative block w-full text-left bg-[#0b0b14] p-3 pb-0" aria-label={`Live preview of ${w.title}`}>
                <BrowserFrame src={w.shotDesktop} alt={host(w.url) || w.title} size={w.shotDesktopSize} />
                <span className="work-hint absolute left-1/2 -translate-x-1/2 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 text-[#0b0b14] text-[11px] font-bold px-3 py-1.5 shadow-lg">
                  <MousePointer2 size={12} /> <span className="hidden sm:inline">Hover to scroll ·</span> Tap for live preview
                </span>
                <span className="absolute top-5 left-5 badge bg-white/90 text-fg border border-border backdrop-blur">{w.industry}</span>
                <span className="absolute top-5 right-5 badge bg-lime text-white"><span className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1 animate-pulse" />Live</span>
              </button>
            ) : (
              <Link href={`/case-studies/${w.slug}`} className="relative aspect-[3/2] overflow-hidden bg-bg-2 block">
                <Image src={w.cover} alt={w.title} width={1200} height={800} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
                <span className="absolute top-3 left-3 badge bg-white/90 text-fg border border-border backdrop-blur">{w.industry}</span>
                <span className="absolute top-3 right-3 badge bg-[#0b0b14] text-white">{TYPE_LABEL[w.type]}</span>
              </Link>
            )}
            <div className="p-5 flex flex-col gap-2 flex-1">
              <h3 className="font-display text-xl font-bold leading-snug"><Link href={`/case-studies/${w.slug}`} className="hover:text-brand transition">{w.title}</Link></h3>
              <p className="text-sm font-semibold flex items-start gap-1.5 text-lime"><TrendingUp size={16} className="shrink-0 mt-0.5" /> {w.result}</p>
              <p className="text-sm text-muted line-clamp-2">{w.summary}</p>
              <div className="flex items-center gap-3 mt-auto pt-3 flex-wrap">
                <Link href={`/case-studies/${w.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:gap-2 transition-all">Case study <ArrowRight size={14} /></Link>
                {w.url && (
                  <a href={w.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("work_visit")} className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg">Visit site <ExternalLink size={13} /></a>
                )}
                <span className="ml-auto flex items-center gap-1.5">
                  {w.instagram && <a href={w.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid place-items-center w-8 h-8 rounded-full bg-surface-2 hover:bg-[#0b0b14] hover:text-white transition"><InstagramIcon size={14} /></a>}
                  {w.facebook && <a href={w.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid place-items-center w-8 h-8 rounded-full bg-surface-2 hover:bg-[#0b0b14] hover:text-white transition"><FacebookIcon size={14} /></a>}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && <p className="text-muted mt-8">No projects in this category yet.</p>}

      {active && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`Live preview: ${active.title}`}>
          <div className="absolute inset-0 bg-[#0b0b14]/85 backdrop-blur-sm gp-fade" onClick={() => setActive(null)} />
          <div className="gp-card relative w-full max-w-[1100px] max-h-[94vh] rounded-3xl overflow-hidden bg-[#0b0b14] text-white shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)] flex flex-col">
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-white/10">
              <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full rounded-full bg-lime opacity-75 animate-ping" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" /></span>
              <div className="leading-tight min-w-0">
                <p className="text-sm font-bold truncate">{active.title}</p>
                <p className="text-[11px] text-white/60 truncate">{host(active.url)} · live preview</p>
              </div>
              <div className="ml-auto flex items-center gap-1 rounded-full bg-white/10 p-1">
                <button type="button" onClick={() => setView("desktop")} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition ${view === "desktop" ? "bg-white text-[#0b0b14]" : "text-white/70 hover:text-white"}`}><Monitor size={14} /> <span className="hidden sm:inline">Desktop</span></button>
                {active.shotMobile && (
                  <button type="button" onClick={() => setView("mobile")} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition ${view === "mobile" ? "bg-white text-[#0b0b14]" : "text-white/70 hover:text-white"}`}><Smartphone size={14} /> <span className="hidden sm:inline">Mobile</span></button>
                )}
              </div>
              <button type="button" onClick={() => setActive(null)} aria-label="Close" className="grid place-items-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20"><X size={16} /></button>
            </div>

            <div className="relative flex-1 overflow-hidden p-4 sm:p-8 grid place-items-center bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,.35),transparent_60%)]">
              <div className="absolute inset-0 dots opacity-30" />
              {view === "desktop" ? (
                <BrowserFrame key={`d-${active.slug}`} src={active.shotDesktop!} alt={host(active.url) || active.title} play className="w-full max-w-[920px]" size={active.shotDesktopSize} />
              ) : (
                <PhoneFrame key={`m-${active.slug}`} src={active.shotMobile!} alt={active.title} play size={active.shotMobileSize} />
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-t border-white/10 flex-wrap">
              <p className="text-xs text-white/60 hidden md:block">Auto-scrolling full-page capture. Open the live site for the real thing.</p>
              <span className="ml-auto flex items-center gap-2">
                {active.instagram && <a href={active.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid place-items-center w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#0b0b14] transition"><InstagramIcon size={16} /></a>}
                {active.facebook && <a href={active.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid place-items-center w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#0b0b14] transition"><FacebookIcon size={16} /></a>}
                <Link href={`/case-studies/${active.slug}`} className="btn btn-ghost !border-white/20 !bg-white/10 !text-white text-sm !py-2">Case study</Link>
                {active.url && <a href={active.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("work_visit")} className="btn btn-accent text-sm !py-2">Open live site <ExternalLink size={14} /></a>}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
