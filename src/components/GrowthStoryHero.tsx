"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Globe, Search, Megaphone, MessageCircle, Check, MapPin, Star, Heart, Phone, ShoppingBag, TrendingUp, Zap } from "lucide-react";
import { HERO_DEFAULT, type HeroContent } from "./HeroStatic";
import InstagramIcon from "./InstagramIcon";
import AutoScrollRow from "./AutoScrollRow";
import Image from "next/image";

export type HeroReel = { thumb: string; video?: string; likes: number; comments: number; caption?: string };

/**
 * Growth-story hero v2. A new business starts at zero; ClickSemrus modules plug in one by one and the
 * board climbs. Perspective board that tilts with the cursor, a phone that shows what each stage looks
 * like (website, Maps ranking, ad, reel, WhatsApp chat), count-up KPIs, glowing chart, confetti at the end.
 * CSS transforms only. Pauses on hover; final state under prefers-reduced-motion.
 */

const MODULES = [
  { key: "web", label: "Website", icon: Globe, at: 1, c: "#38bdf8" },
  { key: "seo", label: "Local SEO", icon: Search, at: 2, c: "#a3ff6b" },
  { key: "ads", label: "Google & Meta Ads", icon: Megaphone, at: 3, c: "#fbbf24" },
  { key: "ig", label: "Instagram", icon: InstagramIcon, at: 4, c: "#f472b6" },
  { key: "wa", label: "WhatsApp", icon: MessageCircle, at: 5, c: "#4ade80" },
] as const;

const STAGES = [
  { label: "Day 0", title: "A fresh business.", sub: "No website, no leads, no reviews.", leads: 0, revenue: 0, followers: 0, rank: "—" },
  { label: "Week 1", title: "Website live in 7 days.", sub: "Tracking on. Google Business Profile set up.", leads: 3, revenue: 0.2, followers: 40, rank: "—" },
  { label: "Week 2", title: "Ranking on Google Maps.", sub: "Local SEO puts you in the map pack.", leads: 12, revenue: 0.9, followers: 180, rank: "#3" },
  { label: "Month 1", title: "First paid leads.", sub: "Google & Meta Ads with tested creatives.", leads: 48, revenue: 3.6, followers: 620, rank: "#2" },
  { label: "Month 2", title: "Reels bring followers.", sub: "Social proof turns visitors into buyers.", leads: 96, revenue: 7.8, followers: 2400, rank: "#1" },
  { label: "Month 3", title: "Growth compounds.", sub: "WhatsApp automation closes faster.", leads: 180, revenue: 15.4, followers: 5200, rank: "#1" },
] as const;

const STEP_MS = 2800;
const CHART = "M0,150 C40,148 60,146 90,142 S150,128 190,112 S250,78 300,52 S350,28 400,10";
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.round(n)));

function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now(); const a = from.current; let raf = 0;
    const tick = (t: number) => { const p = Math.min(1, (t - start) / ms); setV(a + (target - a) * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); else from.current = target; };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export default function GrowthStoryHero({ hero = HERO_DEFAULT, reel }: { hero?: HeroContent; reel?: HeroReel | null }) {
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) { setStage(STAGES.length - 1); return; }
    const id = setInterval(() => {
      if (paused) return;
      setStage((cur) => (cur + 1) % STAGES.length);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [paused]);
  // a manual click holds the chosen stage for a few seconds, then the loop resumes
  const hold = (i: number) => { setStage(i); setPaused(true); window.clearTimeout((hold as unknown as { t?: number }).t); (hold as unknown as { t?: number }).t = window.setTimeout(() => setPaused(false), 7000); };

  const s = STAGES[stage];
  const progress = stage / (STAGES.length - 1);
  const leads = useCountUp(s.leads), revenue = useCountUp(s.revenue), followers = useCountUp(s.followers);
  const dash = 520;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 10 });
  };

  return (
    <section className="relative overflow-hidden -mt-20 pt-28 pb-14 md:pt-40 md:pb-24 min-h-[92svh] flex items-center">
      <div className="absolute inset-0 dots" aria-hidden="true" />
      <div className="hero-blob hero-blob-a" aria-hidden="true" />
      <div className="hero-blob hero-blob-b" aria-hidden="true" />

      <div className="container-x relative grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 lg:gap-12 items-center">
        <div className="max-w-2xl min-w-0">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1] mt-5">
            {hero.headline}<br /><span className="gradient-text">{hero.headlineAccent}</span>
          </h1>
          <p className="text-muted text-base md:text-xl mt-5 md:mt-6 leading-relaxed">{hero.sub}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-7 md:mt-8">
            <Link href="/contact" className="btn btn-primary text-base !px-7 !py-4">{hero.primaryCta} <ArrowRight size={18} /></Link>
            <Link href="/case-studies" className="btn btn-ghost text-base !px-7 !py-4">{hero.secondaryCta}</Link>
          </div>
          <AutoScrollRow className="hero-proofs mt-7" speed={22}>
            {[["Zero to launch in 7 days", Zap], ["Every channel, one team", Globe], ["Reports in rupees", TrendingUp]].map(([t, Icon]) => {
              const I = Icon as typeof Zap;
              return (
                <span key={t as string} className="hero-proof"><span className="hero-proof__ic"><I size={13} /></span>{t as string}<Check size={12} className="hero-proof__ok" /></span>
              );
            })}
          </AutoScrollRow>
        </div>

        {/* scene */}
        <div className="gs2-scene" onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
          <div className={`gs2-board stage-${stage}`} style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }} aria-label="How a new business grows with ClickSemrus">
            <div className="gs2-glow" aria-hidden="true" />

            {/* timeline */}
            <div className="gs2-timeline" role="list" aria-label="Timeline">
              <span className="gs2-timeline__fill" style={{ width: `${progress * 100}%` }} />
              {STAGES.map((st, i) => (
                <button key={st.label} type="button" onClick={() => hold(i)} className={`gs2-tick ${i <= stage ? "is-on" : ""} ${i === stage ? "is-now" : ""}`} aria-current={i === stage} aria-label={st.label}>
                  <i /><span>{st.label}</span>
                </button>
              ))}
            </div>

            <div className="gs2-grid">
              {/* phone */}
              <div className="gs2-phone">
                <span className="gs2-phone__notch" />
                <div className="gs2-screen">
                  {stage === 0 && (
                    <div className="gs2-shot gs2-shot--empty">
                      <span className="gs2-store"><ShoppingBag size={26} /></span>
                      <p className="font-display font-bold text-sm mt-3">Your Business</p>
                      <p className="text-[11px] text-white/50">Opening soon</p>
                      <span className="gs2-ghost" /><span className="gs2-ghost w-2/3" /><span className="gs2-ghost w-1/2" />
                    </div>
                  )}
                  {stage === 1 && (
                    <div className="gs2-shot gs2-shot--web">
                      <div className="gs2-url"><Globe size={10} /> yourbrand.in</div>
                      <div className="gs2-hero-mock"><span className="gs2-line w-4/5" /><span className="gs2-line w-3/5" /><span className="gs2-btn-mock">Book now</span></div>
                      <div className="gs2-cards"><span /><span /><span /></div>
                      <span className="gs2-badge-float"><Check size={10} /> Live in 7 days</span>
                    </div>
                  )}
                  {stage === 2 && (
                    <div className="gs2-shot gs2-shot--maps">
                      <div className="gs2-map">
                        <svg viewBox="0 0 160 150" className="gs2-map__svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                          <rect width="160" height="150" fill="#0e1726" />
                          <path d="M-10 40 H170 M-10 95 H170 M30 -10 V160 M105 -10 V160" stroke="#243247" strokeWidth="7" />
                          <path d="M-10 65 H170 M70 -10 V160 M-10 20 L60 120" stroke="#1b2636" strokeWidth="4" />
                          <path d="M30 40 L105 40 L105 95" stroke="#3b5bdb" strokeWidth="3.5" strokeLinecap="round" opacity=".9" className="gs2-map__route" />
                          <rect x="8" y="46" width="16" height="12" rx="2" fill="#16202e" /><rect x="112" y="12" width="20" height="18" rx="2" fill="#16202e" /><rect x="112" y="100" width="22" height="20" rx="2" fill="#16202e" /><rect x="36" y="100" width="20" height="16" rx="2" fill="#16202e" />
                          <circle cx="78" cy="55" r="4" fill="#4ade80" opacity=".6"><animate attributeName="r" values="4;10;4" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values=".6;0;.6" dur="2s" repeatCount="indefinite" /></circle>
                        </svg>
                        <span className="gs2-pin"><MapPin size={18} fill="#ef4444" stroke="#fff" strokeWidth={1.5} /></span>
                        <span className="gs2-ring" />
                        <span className="gs2-map__you">You</span>
                      </div>
                      <div className="gs2-listing"><p className="font-bold text-[12px]">Your Business</p><p className="text-[10px] text-white/60 flex items-center gap-1"><Star size={10} fill="#fbbf24" stroke="#fbbf24" /> 4.9 · 120 reviews · Open now</p></div>
                      <span className="gs2-badge-float">{s.rank} on Maps</span>
                    </div>
                  )}
                  {stage === 3 && (
                    <div className="gs2-shot gs2-shot--ad">
                      <div className="gs2-ad"><span className="text-[9px] font-bold tracking-widest text-white/50">SPONSORED</span><p className="font-display font-bold text-[13px] leading-tight mt-1">Book a free consultation today</p><span className="gs2-btn-mock mt-2">Call now</span></div>
                      <div className="gs2-kpis"><span>CTR <b>6.2%</b></span><span>CPL <b>₹180</b></span></div>
                      <span className="gs2-badge-float"><Phone size={10} /> 12 calls today</span>
                    </div>
                  )}
                  {stage === 4 && (
                    <div className="gs2-shot gs2-shot--reel">
                      <div className="gs2-reel">
                        {reel?.video ? <video src={reel.video} poster={reel.thumb} muted autoPlay loop playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" /> : reel?.thumb ? <Image src={reel.thumb} alt={reel.caption || "Reel"} fill sizes="170px" className="object-cover" unoptimized /> : null}
                        <span className="gs2-reel__shade" />
                        <span className="gs2-reel__stats"><InstagramIcon size={12} /> Reel{reel ? <> · <Heart size={11} fill="currentColor" /> {reel.likes >= 1000 ? `${(reel.likes / 1000).toFixed(1)}k` : reel.likes} · 💬 {reel.comments}</> : null}</span>
                      </div>
                      <span className="gs2-heart" style={{ left: "70%" }}><Heart size={14} fill="#f472b6" stroke="#f472b6" /></span>
                      <span className="gs2-heart" style={{ left: "78%", animationDelay: ".6s" }}><Heart size={11} fill="#f472b6" stroke="#f472b6" /></span>
                      <span className="gs2-heart" style={{ left: "62%", animationDelay: "1.1s" }}><Heart size={12} fill="#f472b6" stroke="#f472b6" /></span>
                      <span className="gs2-badge-float">{reel && reel.likes >= 500 ? `${(reel.likes / 1000).toFixed(1)}k likes on one reel` : "+2.4k followers"}</span>
                    </div>
                  )}
                  {stage === 5 && (
                    <div className="gs2-shot gs2-shot--wa">
                      <div className="gs2-chat in">Hi, do you have slots tomorrow?</div>
                      <div className="gs2-chat out">Yes! 11am or 4pm works. Shall I book 11am?</div>
                      <div className="gs2-chat in">11am please 🙌</div>
                      <div className="gs2-chat out">Booked ✅ Address and directions sent.</div>
                      <span className="gs2-badge-float"><Zap size={10} /> Replied in 40s</span>
                    </div>
                  )}
                </div>
              </div>

              {/* right column */}
              <div className="gs2-right">
                <div key={stage} className="gs2-title">
                  <p className="text-[10px] font-bold tracking-[.2em] text-[#8b84ff] uppercase">{s.label}</p>
                  <p className="font-display font-extrabold text-lg sm:text-xl leading-tight text-white">{s.title}</p>
                  <p className="text-xs text-white/60 mt-0.5">{s.sub}</p>
                </div>

                <ul className="gs2-mods" aria-label="ClickSemrus modules">
                  {MODULES.map((m, i) => {
                    const on = stage >= m.at;
                    return (
                      <li key={m.key} className={`gs2-mod ${on ? "is-on" : ""}`} style={{ transitionDelay: `${i * 70}ms`, "--c": m.c } as React.CSSProperties}>
                        <span className="gs2-mod__ic"><m.icon size={12} /></span>{m.label}{on && <Check size={11} className="gs2-mod__ok" />}
                      </li>
                    );
                  })}
                </ul>

                <div className="gs2-kpi-row">
                  <div className="gs2-kpi"><span>Leads</span><b>{fmt(leads)}</b></div>
                  <div className="gs2-kpi"><span>Followers</span><b>{fmt(followers)}</b></div>
                  <div className="gs2-kpi"><span>Maps</span><b>{s.rank}</b></div>
                </div>

                <div className="gs2-chart">
                  <svg viewBox="0 0 400 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gs2-line" x1="0" x2="1"><stop offset="0" stopColor="#8b84ff" /><stop offset="1" stopColor="#fbbf24" /></linearGradient>
                      <linearGradient id="gs2-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8b84ff" stopOpacity=".5" /><stop offset="1" stopColor="#8b84ff" stopOpacity="0" /></linearGradient>
                      <clipPath id="gs2-clip"><rect x="0" y="0" width={400 * progress} height="160" /></clipPath>
                    </defs>
                    <path d={`${CHART} L400,160 L0,160 Z`} fill="url(#gs2-fill)" clipPath="url(#gs2-clip)" className="gs2-chart__fill" />
                    <path d={CHART} fill="none" stroke="url(#gs2-line)" strokeWidth="3.5" strokeLinecap="round" style={{ strokeDasharray: dash, strokeDashoffset: dash * (1 - progress) }} className="gs2-chart__line" />
                  </svg>
                  <div className="gs2-chart__label"><TrendingUp size={11} /> Revenue / month</div>
                  <div className="gs2-chart__value">₹{revenue.toFixed(1)}L</div>
                </div>
              </div>
            </div>

            {stage === STAGES.length - 1 && (
              <div className="gs2-confetti" aria-hidden="true">
                {Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ left: `${(i * 53) % 100}%`, animationDelay: `${(i % 6) * 0.12}s`, background: ["#fbbf24", "#8b84ff", "#4ade80", "#f472b6", "#38bdf8"][i % 5] }} />)}
              </div>
            )}
          </div>
          <p className="mt-3 text-xs text-muted text-center">Illustrative 90-day journey. Your numbers depend on category and budget.</p>
        </div>
      </div>
    </section>
  );
}
