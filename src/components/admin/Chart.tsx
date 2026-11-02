"use client";
import { useState } from "react";

/** Single-series bar chart with hover tooltip and a table view (accessibility). */
export default function Chart({ data }: { data: { date: string; views: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const max = Math.max(1, ...data.map((d) => d.views));
  const W = 900, H = 220, pad = 28, gap = 2;
  const bw = (W - pad * 2) / data.length - gap;
  const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  if (table)
    return (
      <div>
        <button className="text-xs text-brand-2 mb-2" onClick={() => setTable(false)}>Show chart</button>
        <table className="table"><thead><tr><th>Date</th><th>Views</th></tr></thead><tbody>{data.map((d) => <tr key={d.date}><td>{fmt(d.date)}</td><td>{d.views}</td></tr>)}</tbody></table>
      </div>
    );

  return (
    <div className="relative">
      <button className="text-xs text-brand-2 absolute right-0 -top-7" onClick={() => setTable(true)}>Show table</button>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-56" role="img" aria-label="Daily page views for the last 30 days">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={pad} x2={W - pad} y1={H - pad - f * (H - pad * 2)} y2={H - pad - f * (H - pad * 2)} stroke="rgba(255,255,255,.08)" />
            <text x={pad - 6} y={H - pad - f * (H - pad * 2) + 4} fontSize="10" fill="#a5a7bd" textAnchor="end">{Math.round(max * f)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const h = Math.max(2, (d.views / max) * (H - pad * 2));
          const x = pad + i * (bw + gap);
          const y = H - pad - h;
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={x} y={pad} width={bw + gap} height={H - pad * 2} fill="transparent" />
              <rect x={x} y={y} width={bw} height={h} rx="3" fill={hover === i ? "#22d3ee" : "#7c5cff"} />
              {(i % 5 === 0 || i === data.length - 1) && <text x={x + bw / 2} y={H - pad + 14} fontSize="10" fill="#a5a7bd" textAnchor="middle">{fmt(d.date)}</text>}
            </g>
          );
        })}
        {hover !== null && (
          <g>
            <rect x={Math.min(W - 130, pad + hover * (bw + gap))} y={4} width={120} height={36} rx="6" fill="#14142a" stroke="rgba(255,255,255,.15)" />
            <text x={Math.min(W - 130, pad + hover * (bw + gap)) + 10} y={20} fontSize="11" fill="#a5a7bd">{fmt(data[hover].date)}</text>
            <text x={Math.min(W - 130, pad + hover * (bw + gap)) + 10} y={34} fontSize="12" fontWeight="700" fill="#f4f4fb">{data[hover].views} views</text>
          </g>
        )}
      </svg>
    </div>
  );
}
