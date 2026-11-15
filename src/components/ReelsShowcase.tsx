"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Heart, MessageCircle, X, ExternalLink, Sparkles, Wand2, Clapperboard } from "lucide-react";
import type { Reel } from "@/lib/reels";
import InstagramIcon from "./InstagramIcon";
import { trackEvent } from "./Tracker";

export type ReelClient = {
  key: string;
  client: string;
  handle: string;
  profileUrl: string;
  caseStudyHref?: string;
  /** Short label for the tab, e.g. "Reels" or "AI videos". */
  kind: string;
  tagline: string;
  reels: Reel[];
};

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

/**
 * Client content showcase with tabs per client and a spotlight: tap a reel and it lights up
 * while the others dim and blur. Same behaviour on phones (horizontal snap row).
 */
export default function ReelsShowcase({ clients }: { clients: ReelClient[] }) {
  const list = clients.filter((c) => c.reels.length);
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    rowRef.current?.querySelector<HTMLElement>(`[data-code="${active}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  if (!list.length) return null;
  const c = list[Math.min(tab, list.length - 1)];
  const isAi = /ai/i.test(c.kind);

  const toggle = (code: string) => { setActive((cur) => (cur === code ? null : code)); trackEvent("reel_spotlight"); };
  const switchTab = (i: number) => { setTab(i); setActive(null); rowRef.current?.scrollTo({ left: 0 }); };

  return (
    <section className={`reels relative overflow-hidden py-16 md:py-24 ${active ? "has-focus" : ""}`} aria-label="Content we produce">
      <div className="absolute inset-0 dots opacity-60" aria-hidden="true" />
      <div className={`blob w-[28rem] h-[28rem] -right-40 -top-32 opacity-25 ${isAi ? "bg-[#7c3aed]" : "bg-[#db2777]"}`} aria-hidden="true" />
      <div className="container-x relative">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <span className="eyebrow"><Sparkles size={12} /> Content we produce</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">
              {/studio/i.test(c.kind) ? <>Reels from <span className="gradient-text">our studio</span></> : <>{isAi ? "AI videos" : "Reels"} we create for <span className="gradient-text">{c.client}</span></>}
            </h2>
            <p className="text-muted mt-5 text-lg">{c.tagline}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <a href={c.profileUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("instagram_open")} className="btn btn-ghost"><InstagramIcon size={16} /> @{c.handle}</a>
            {c.caseStudyHref && <a href={c.caseStudyHref} className="btn btn-primary">See our work</a>}
          </div>
        </div>

        {list.length > 1 && (
          <div className="mt-8 flex gap-2 flex-wrap" role="tablist" aria-label="Clients">
            {list.map((cl, i) => (
              <button key={cl.key} role="tab" aria-selected={i === tab} onClick={() => switchTab(i)} className={`reels__tab ${i === tab ? "is-on" : ""}`}>
                {/ai/i.test(cl.kind) ? <Wand2 size={14} /> : <Clapperboard size={14} />} {/ai/i.test(cl.kind) ? "AI storytelling" : /studio/i.test(cl.kind) ? "Our studio" : "Brand reels"} <span className="reels__tab-kind">{cl.kind}</span>
              </button>
            ))}
          </div>
        )}

        {active && <button type="button" aria-label="Close" onClick={() => setActive(null)} className="reels__scrim" />}

        <div ref={rowRef} className="reels__row mt-8 md:mt-10" role="list" key={c.key}>
          {c.reels.map((r, i) => {
            const on = active === r.code;
            const top = i === 0 && r.likes >= 500;
            return (
              <article key={r.code} data-code={r.code} role="listitem" className={`reel ${on ? "is-active" : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
                <button type="button" onClick={() => toggle(r.code)} className="reel__frame" aria-pressed={on} aria-label={on ? "Close" : `Open: ${r.caption || c.client}`}>
                  {on ? (
                    r.video ? (
                      <video src={r.video} poster={r.thumb} className="reel__embed object-cover" autoPlay playsInline controls preload="metadata" />
                    ) : (
                      <span className="reel__focus">
                        <Image src={r.thumb} alt={r.caption || `${c.client} reel`} fill sizes="(min-width: 1024px) 260px, 60vw" className="object-cover" unoptimized />
                        <span className="reel__shade" />
                        <span className="reel__meta reel__meta--big"><span className="inline-flex items-center gap-1"><Heart size={13} fill="currentColor" /> {fmt(r.likes)}</span><span className="inline-flex items-center gap-1"><MessageCircle size={13} /> {r.comments}</span></span>
                        {r.caption && <span className="reel__focus-caption">{r.caption}</span>}
                        <a href={c.profileUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); trackEvent("reel_open"); }} className="reel__watch">
                          <InstagramIcon size={15} /> More on our Instagram
                        </a>
                      </span>
                    )
                  ) : (
                    <>
                      <Image src={r.thumb} alt={r.caption || `${c.client} reel`} fill sizes="(min-width: 1024px) 220px, 46vw" className="object-cover" unoptimized />
                      <span className="reel__shade" />
                      <span className="reel__play"><Play size={18} fill="currentColor" /></span>
                      <span className="reel__meta">
                        <span className="inline-flex items-center gap-1"><Heart size={12} fill="currentColor" /> {fmt(r.likes)}</span>
                        <span className="inline-flex items-center gap-1"><MessageCircle size={12} /> {r.comments}</span>
                      </span>
                      {top && <span className="reel__top">Most liked</span>}
                      {r.caption && <span className="reel__caption">{r.caption}</span>}
                    </>
                  )}
                </button>
                {on && (
                  <div className="reel__bar">
                    <a href={c.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-white/90 hover:text-white">@{c.handle} <ExternalLink size={12} /></a>
                    <button type="button" onClick={() => setActive(null)} className="grid place-items-center w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Close"><X size={14} /></button>
                  </div>
                )}
                <span className="reel__tag">{isAi ? <Wand2 size={10} /> : <InstagramIcon size={10} />} {c.kind} · by ClickSemrus</span>
              </article>
            );
          })}
        </div>
        <p className="mt-5 text-xs text-muted">Live from Instagram · updates every hour · {isAi ? "ranked by likes" : "latest first"}{c.reels.some((r) => r.video) ? " · plays right here" : ""}.</p>
      </div>
    </section>
  );
}
