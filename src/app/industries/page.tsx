import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INDUSTRIES, SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMeta({
  title: "Industries We Serve | Digital Marketing by Sector in Delhi NCR",
  description: `${SITE.name} builds sector-specific marketing for retail, restaurants, healthcare, education, real estate and fashion brands across Delhi NCR.`,
  path: "/industries",
  keywords: ["industry specific digital marketing delhi", "marketing agency for clinics", "marketing agency for real estate delhi ncr"],
});

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Industries", path: "/industries" }])} />
      <section className="container-x pt-16 md:pt-24 pb-10 max-w-3xl">
        <p className="eyebrow">Industries</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">Built for businesses across every sector</h1>
        <p className="text-muted text-lg mt-5">Every industry buys differently. We bring playbooks, benchmarks and creative formats that already work for businesses like yours in Delhi NCR.</p>
      </section>
      <section className="container-x grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
        {INDUSTRIES.map((ind, i) => (
          <Reveal key={ind.slug} delay={(i % 3) * 90}>
            <Link href={`/industries/${ind.slug}`} className="card p-7 h-full flex flex-col group">
              <span className="font-display text-sm font-bold text-brand tracking-widest">0{i + 1}</span>
              <h2 className="font-display text-2xl font-bold mt-3">{ind.name}</h2>
              <p className="text-muted mt-2 flex-1">{ind.short}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {ind.channels.slice(0, 3).map((c) => <li key={c} className="badge bg-surface-2 text-muted normal-case tracking-normal font-semibold">{c}</li>)}
              </ul>
              <span className="inline-flex items-center gap-1 font-bold text-brand mt-5 group-hover:gap-3 transition-all">See playbook <ArrowRight size={16} /></span>
            </Link>
          </Reveal>
        ))}
      </section>
      <CTA title="Don't see your industry?" sub="We have worked with B2B, SaaS, travel, automotive and more. Tell us your goal and we will share the closest playbook." />
    </>
  );
}
