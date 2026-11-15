import { Search, Share2, MousePointerClick, Megaphone, PenTool, Code2, Users, MessageCircle, Palette, Flame, Sparkles, TrendingUp } from "lucide-react";

/**
 * Eye-catching service ticker: a tilted dark band with two rows scrolling in opposite directions,
 * icon chips with per-service accent colours, a shine sweep and edge fades. Pauses on hover.
 */
const ROW_A = [
  { t: "SEO", i: Search, c: "#8b84ff" },
  { t: "Social Media", i: Share2, c: "#f472b6" },
  { t: "Google Ads", i: MousePointerClick, c: "#fbbf24" },
  { t: "Meta Ads", i: Megaphone, c: "#38bdf8" },
  { t: "Content", i: PenTool, c: "#a3ff6b" },
  { t: "Web Design", i: Code2, c: "#fb923c" },
] as const;
const ROW_B = [
  { t: "Influencers", i: Users, c: "#f472b6" },
  { t: "WhatsApp Marketing", i: MessageCircle, c: "#4ade80" },
  { t: "Branding", i: Palette, c: "#fbbf24" },
  { t: "Moment Marketing", i: Flame, c: "#fb7185" },
  { t: "Reels & Shorts", i: Sparkles, c: "#c084fc" },
  { t: "Growth Reporting", i: TrendingUp, c: "#38bdf8" },
] as const;

function Row({ items, reverse = false, speed = 34 }: { items: typeof ROW_A | typeof ROW_B; reverse?: boolean; speed?: number }) {
  return (
    <div className={`ticker-row ${reverse ? "is-reverse" : ""}`} style={{ animationDuration: `${speed}s` }} aria-hidden={reverse}>
      {[0, 1].map((k) => (
        <div key={k} className="ticker-track">
          {items.map((it) => (
            <span key={it.t} className="ticker-chip" style={{ "--chip": it.c } as React.CSSProperties}>
              <span className="ticker-chip__icon"><it.i size={14} /></span>
              {it.t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ServiceTicker() {
  return (
    <div className="ticker" role="region" aria-label="What we do">
      <div className="ticker__band">
        <div className="ticker__shine" aria-hidden="true" />
        <Row items={ROW_A} />
        <Row items={ROW_B} reverse speed={42} />
        <span className="ticker__badge"><Sparkles size={12} /> Every channel. One team.</span>
      </div>
    </div>
  );
}
