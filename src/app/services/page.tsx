import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES, SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMeta({
  title: "Digital Marketing Services in Delhi NCR | SEO, Social, Ads, Web",
  description: `Explore ${SITE.name} services: SEO, social media marketing, Google Ads, Meta Ads, content marketing, web design, influencer, WhatsApp and email marketing, and branding for businesses in Delhi NCR.`,
  path: "/services",
  keywords: ["digital marketing services delhi", "seo services delhi ncr", "social media marketing services", "ppc services gurugram"],
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Services", path: "/services" }])} />
      <section className="container-x pt-16 pb-10 md:pt-24">
        <p className="eyebrow">Services</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-3 max-w-3xl">Full-funnel digital marketing services in Delhi NCR</h1>
        <p className="text-muted mt-5 max-w-2xl text-lg">From the first search to the repeat purchase, we cover every step. Start with one channel or hand us the whole funnel.</p>
      </section>
      <section className="container-x grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={i * 50}>
            <Link href={`/services/${s.slug}`} className="card p-6 block h-full group">
              <span className="inline-grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand/30 to-brand-2/20 border border-border text-brand-2"><ServiceIcon name={s.icon} /></span>
              <h2 className="font-display text-xl font-bold mt-5">{s.name}</h2>
              <p className="text-muted text-sm mt-2">{s.short}</p>
              <ul className="mt-4 text-sm text-muted space-y-1">
                {s.deliverables.slice(0, 3).map((d) => <li key={d}>• {d}</li>)}
              </ul>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-2 mt-5 group-hover:gap-2 transition-all">View service <ArrowRight size={14} /></span>
            </Link>
          </Reveal>
        ))}
      </section>
      <CTA title="Not sure which service you need?" sub="Tell us your goal and budget. We will recommend the channel mix with the fastest payback, free." />
    </>
  );
}
