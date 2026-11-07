import { Play, Layers, ArrowUpRight } from "lucide-react";
import InstagramGrid from "./InstagramGrid";
import { SITE } from "@/lib/site";
import { INSTAGRAM_HANDLE, type IgPost } from "@/lib/instagram";
import Reveal from "./Reveal";
import InstagramIcon from "./InstagramIcon";

/** Branded tiles shown until a real feed is configured. Each links to the profile. */
const PLACEHOLDERS = [
  { t: "Trend of the day", s: "Reel", g: "from-[#4f46e5] to-[#0ea5e9]" },
  { t: "Before / after: ROAS 1.4 → 3.8", s: "Carousel", g: "from-[#0b0b14] to-[#4f46e5]" },
  { t: "Local SEO in 60 seconds", s: "Reel", g: "from-[#f59e0b] to-[#ef4444]" },
  { t: "Hook formulas that stop the scroll", s: "Post", g: "from-[#0ea5e9] to-[#16a34a]" },
  { t: "Client win: 60+ calls / month", s: "Post", g: "from-[#7c3aed] to-[#db2777]" },
  { t: "Meta Ads creative teardown", s: "Reel", g: "from-[#0b0b14] to-[#0ea5e9]" },
  { t: "Google Business Profile checklist", s: "Carousel", g: "from-[#16a34a] to-[#0b0b14]" },
  { t: "What we shipped this week", s: "Reel", g: "from-[#4f46e5] to-[#f59e0b]" },
];

export default function InstagramFeed({ posts }: { posts: IgPost[] }) {
  const live = posts.length > 0;
  const profile = SITE.instagram;

  return (
    <section className="relative overflow-hidden py-24 bg-bg-2 border-y border-border">
      <div className="absolute inset-0 dots opacity-70" />
      <div className="container-x relative">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <Reveal className="max-w-2xl">
            <span className="eyebrow"><InstagramIcon size={12} /> Instagram</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">
              Live from <span className="gradient-text">@{INSTAGRAM_HANDLE}</span>
            </h2>
            <p className="text-muted mt-5 text-lg">Trend breakdowns, client wins and creative teardowns. New reels every week.</p>
          </Reveal>
          <Reveal delay={90}>
            <a href={profile} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <InstagramIcon size={18} /> Follow on Instagram
            </a>
          </Reveal>
        </div>

        {live ? (
          <InstagramGrid posts={posts.map((p) => ({ ...p, image: p.code ? `/api/ig-img?c=${p.code}` : p.image }))} />
        ) : (
          <div className="ig-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-12">
            {PLACEHOLDERS.map((p, i) => (
              <Reveal key={p.t} delay={(i % 4) * 90}>
                <a href={profile} target="_blank" rel="noopener noreferrer" className={`ig-tile group relative block aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${p.g} text-white`}>
                  <span className="absolute inset-0 dots opacity-40" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                    {p.s === "Reel" ? <Play size={10} fill="currentColor" /> : p.s === "Carousel" ? <Layers size={10} /> : <InstagramIcon size={10} />} {p.s}
                  </span>
                  <span className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-white/15 backdrop-blur"><InstagramIcon size={14} /></span>
                  <span className="absolute inset-x-0 bottom-0 p-4">
                    <span className="block font-display font-bold text-base md:text-lg leading-tight">{p.t}</span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold opacity-80 group-hover:opacity-100 transition">Watch on Instagram <ArrowUpRight size={12} /></span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#ef4444]" /></span>
          {live ? "Real posts from our Instagram, refreshed every hour. Tap a tile for a live preview." : "Tap any tile to see our latest reels on Instagram."}
        </div>
      </div>
    </section>
  );
}
