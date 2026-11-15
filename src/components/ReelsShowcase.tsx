"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Heart, MessageCircle, X, ExternalLink, Sparkles } from "lucide-react";
import type { Reel } from "@/lib/reels";
import InstagramIcon from "./InstagramIcon";
import { trackEvent } from "./Tracker";

/**
 * Client reels showcase with a spotlight: tap a reel and it lights up and plays (Instagram embed),
 * while every other card dims and blurs. Works the same on phones (horizontal snap row).
 */
export default function ReelsShowcase({ reels, client, handle, profileUrl, caseStudyHref }: { reels: Reel[]; client: string; handle: string; profileUrl: string; caseStudyHref?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    // bring the active card to the centre of the row
    const el = rowRef.current?.querySelector<HTMLElement>(`[data-code="${active}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  if (!reels.length) return null;

  const toggle = (code: string) => {
    setActive((cur) => (cur === code ? null : code));
    trackEvent("reel_spotlight");
  };

  return (
    <section className={`reels relative overflow-hidden py-16 md:py-24 ${active ? "has-focus" : ""}`} aria-label={`Reels made for ${client}`}>
      <div className="absolute inset-0 dots opacity-60" aria-hidden="true" />
      <div className="blob w-[28rem] h-[28rem] bg-[#db2777] -right-40 -top-32 opacity-25" aria-hidden="true" />
      <div className="container-x relative">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <span className="eyebrow"><Sparkles size={12} /> Content we produce</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">
              Reels we made for <span className="gradient-text">{client}</span>
            </h2>
            <p className="text-muted mt-5 text-lg">Scripted, shot, edited and posted by ClickSemrus. Tap any reel to watch it right here.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><InstagramIcon size={16} /> @{handle}</a>
            {caseStudyHref && <a href={caseStudyHref} className="btn btn-primary">Case study</a>}
          </div>
        </div>

        {/* dim layer: clicking outside clears the spotlight */}
        {active && <button type="button" aria-label="Close" onClick={() => setActive(null)} className="reels__scrim" />}

        <div ref={rowRef} className="reels__row mt-10 md:mt-12" role="list">
          {reels.map((r, i) => {
            const on = active === r.code;
            return (
              <article key={r.code} data-code={r.code} role="listitem" className={`reel ${on ? "is-active" : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
                <button type="button" onClick={() => toggle(r.code)} className="reel__frame" aria-pressed={on} aria-label={on ? "Close reel" : `Play reel: ${r.caption || client}`}>
                  {on ? (
                    r.video ? (
                      <video src={r.video} poster={r.thumb} className="reel__embed object-cover" autoPlay playsInline controls preload="metadata" />
                    ) : (
                      <iframe
                        src={`https://www.instagram.com/p/${r.code}/embed/`}
                        title={r.caption || "Instagram reel"}
                        className="reel__embed"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        loading="eager"
                      />
                    )
                  ) : (
                    <>
                      <Image src={r.thumb} alt={r.caption || `${client} reel`} fill sizes="(min-width: 1024px) 220px, 46vw" className="object-cover" unoptimized />
                      <span className="reel__shade" />
                      <span className="reel__play"><Play size={18} fill="currentColor" /></span>
                      <span className="reel__meta">
                        <span className="inline-flex items-center gap-1"><Heart size={12} /> {r.likes}</span>
                        <span className="inline-flex items-center gap-1"><MessageCircle size={12} /> {r.comments}</span>
                      </span>
                      {r.caption && <span className="reel__caption">{r.caption}</span>}
                    </>
                  )}
                </button>
                {on && (
                  <div className="reel__bar">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-white/90 hover:text-white">Open on Instagram <ExternalLink size={12} /></a>
                    <button type="button" onClick={() => setActive(null)} className="grid place-items-center w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Close"><X size={14} /></button>
                  </div>
                )}
                <span className="reel__tag"><InstagramIcon size={10} /> Reel · {client}</span>
              </article>
            );
          })}
        </div>
        <p className="mt-5 text-xs text-muted">Live from Instagram · updates every hour.</p>
      </div>
    </section>
  );
}
