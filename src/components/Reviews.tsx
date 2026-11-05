import { Star } from "lucide-react";
import Image from "next/image";
import { SITE } from "@/lib/site";
import type { ReviewData, Review } from "@/lib/reviews";
import Reveal from "./Reveal";

function GoogleG({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.1C3.2 21.3 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3c-.3-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.2C.4 8.2 0 10 0 12s.4 3.8 1.2 5.4l4.1-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4.1 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="card relative w-[300px] sm:w-[340px] shrink-0 p-5 flex flex-col gap-3 !transform-none">
      <span className="absolute top-4 right-4 grid place-items-center w-7 h-7 rounded-full bg-surface-2 border border-border"><GoogleG /></span>
      <div className="flex items-center gap-3 pr-8">
        {r.photo ? (
          <Image src={r.photo} alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover" unoptimized />
        ) : (
          <span className="w-10 h-10 rounded-full bg-brand text-white grid place-items-center font-bold">{r.name.charAt(0).toUpperCase()}</span>
        )}
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{r.name}</p>
          <p className="text-xs text-muted truncate">{r.meta}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex text-sun">{[...Array(5)].map((_, i) => <Star key={i} size={13} fill={i < Math.round(r.rating) ? "currentColor" : "none"} />)}</span>
        {r.relative && <span className="text-xs text-muted">{r.relative}</span>}
      </div>
      <p className="text-sm leading-relaxed text-fg/85 line-clamp-5">{r.text}</p>
    </article>
  );
}

function Row({ items, reverse = false }: { items: Review[]; reverse?: boolean }) {
  return (
    <div className="overflow-hidden group" aria-hidden={reverse}>
      <div className={`marquee marquee-pause ${reverse ? "marquee-reverse" : ""} !gap-5 py-2`} style={{ animationDuration: `${Math.max(30, items.length * 8)}s` }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex gap-5">
            {items.map((r) => <ReviewCard key={`${k}-${r.id}`} r={r} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reviews({ data }: { data: ReviewData }) {
  const half = Math.ceil(data.reviews.length / 2);
  const rowA = data.reviews.slice(0, half);
  const rowB = data.reviews.slice(half);
  const ratingText = data.rating.toFixed(1);
  return (
    <section className="relative overflow-hidden py-24 bg-bg-2 border-y border-border">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">Google Reviews</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">What Delhi NCR businesses say</h2>
            <p className="text-muted mt-4 text-lg">Real reviews from founders, doctors and store owners we work with.</p>
          </Reveal>
          <Reveal delay={90} variant="zoom">
            <div className="card !transform-none p-5 flex items-center gap-4 w-fit">
              <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white border border-border"><GoogleG size={24} /></span>
              <div>
                <p className="font-display text-3xl font-extrabold leading-none flex items-center gap-2">{ratingText} <Star size={22} className="text-sun" fill="currentColor" /></p>
                <p className="text-sm text-muted mt-1">{data.total}+ reviews on Google</p>
              </div>
              {SITE.googleReviewUrl && (
                <a href={SITE.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-xs !py-2 !px-4 ml-2 hidden sm:inline-flex">Read all</a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
      <div className="mt-12 space-y-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <Row items={rowA} />
        <div className="hidden md:block"><Row items={rowB.length ? rowB : rowA} reverse /></div>
      </div>
    </section>
  );
}
