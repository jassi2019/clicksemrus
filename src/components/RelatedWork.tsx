import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { WorkItem } from "@/lib/site";
import WorkGrid from "@/components/WorkGrid";
import Reveal from "@/components/Reveal";

/** Portfolio strip used on service, industry, location, about and pricing pages. */
export default function RelatedWork({
  items,
  title = "Websites, stores and campaigns we run today",
  sub = "Live projects you can open right now. Hover a card to scroll the site, or tap for a full preview.",
  limit = 3,
  id = "work",
  tint = false,
}: {
  items: WorkItem[];
  title?: string;
  sub?: string;
  limit?: number;
  id?: string;
  tint?: boolean;
}) {
  if (!items.length) return null;
  return (
    <section id={id} className={`relative overflow-hidden py-16 md:py-24 scroll-mt-24 ${tint ? "section-tint" : ""}`}>
      <div className="container-x">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">Our work</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">{title}</h2>
            {sub && <p className="text-muted mt-4 text-lg">{sub}</p>}
          </Reveal>
          <Link href="/case-studies" className="btn btn-ghost">See all work <ArrowRight size={16} /></Link>
        </div>
        <Reveal delay={90} className="mt-10">
          <WorkGrid items={items} showTabs={false} limit={limit} />
        </Reveal>
      </div>
    </section>
  );
}
