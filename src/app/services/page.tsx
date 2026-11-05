import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICE_CATEGORIES, SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import ServiceIcon from "@/components/ServiceIcon";
import ServiceArt from "@/components/ServiceArt";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMeta({
  title: "Digital Marketing Services in Delhi NCR | SEO, Ads, Social, Web, E-commerce",
  description: `Explore ${SITE.name} services: SEO and search, paid ads, social media and content, web development, e-commerce, creative and branding, automation and CRM for businesses in Delhi NCR.`,
  path: "/services",
  keywords: ["digital marketing services delhi", "seo services delhi ncr", "social media marketing services", "ppc services gurugram", "web development noida"],
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Services", path: "/services" }])} />
      <section className="container-x pt-16 pb-10 md:pt-24">
        <p className="eyebrow">Services</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-3 max-w-3xl">Full-funnel digital marketing services in Delhi NCR</h1>
        <p className="text-muted mt-5 max-w-2xl text-lg">Seven service families, {SERVICE_CATEGORIES.reduce((n, c) => n + c.subs.length, 0)} specialist services. Start with one or hand us the whole funnel.</p>
      </section>
      <section className="container-x grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
        {SERVICE_CATEGORIES.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 3) * 90}>
            <div className="card p-6 h-full flex flex-col relative overflow-hidden group">
              <ServiceArt slug={c.slug} />
              <span className="inline-grid place-items-center w-12 h-12 rounded-xl bg-[#0b0b14] text-white group-hover:bg-brand transition"><ServiceIcon name={c.icon} /></span>
              <h2 className="font-display text-xl font-bold mt-5"><Link href={`/services/${c.slug}`} className="hover:text-brand transition">{c.name}</Link></h2>
              <p className="text-muted text-sm mt-2">{c.short}</p>
              <ul className="mt-4 text-sm space-y-1.5 flex-1">
                {c.subs.slice(0, 5).map((s) => (
                  <li key={s.slug}><Link href={`/services/${c.slug}/${s.slug}`} className="text-muted hover:text-fg flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-brand" />{s.name}</Link></li>
                ))}
              </ul>
              <Link href={`/services/${c.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-brand mt-5 group-hover:gap-2 transition-all">All {c.subs.length} services <ArrowRight size={14} /></Link>
            </div>
          </Reveal>
        ))}
      </section>
      <CTA title="Not sure which service you need?" sub="Tell us your goal and budget. We will recommend the channel mix with the fastest payback, free." />
    </>
  );
}
