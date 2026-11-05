import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { LOCATIONS, SERVICE_CATEGORIES, INDUSTRIES, SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd } from "@/lib/seo";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ city: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const loc = LOCATIONS.find((l) => l.slug === city);
  if (!loc) return {};
  return pageMeta({
    title: `${loc.headline} | SEO, Ads & Social Media | ${SITE.name}`,
    description: loc.intro.slice(0, 158),
    path: `/locations/${loc.slug}`,
    keywords: [`digital marketing agency ${loc.name.toLowerCase()}`, `seo company ${loc.name.toLowerCase()}`, `social media marketing ${loc.name.toLowerCase()}`, `google ads agency ${loc.name.toLowerCase()}`],
  });
}

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const loc = LOCATIONS.find((l) => l.slug === city);
  if (!loc) notFound();
  const others = LOCATIONS.filter((l) => l.slug !== loc.slug);

  return (
    <>
      <JsonLd data={[localBusinessJsonLd(loc), faqJsonLd(loc.faqs), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: loc.name, path: `/locations/${loc.slug}` }])]} />
      <section className="relative overflow-hidden">
        <div className="blob w-96 h-96 bg-brand-2 -top-32 -left-20" />
        <div className="container-x relative pt-16 md:pt-24 pb-12 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-muted mb-4" aria-label="Breadcrumb"><Link href="/">Home</Link> / <span className="text-fg">{loc.name}</span></nav>
            <span className="eyebrow"><MapPin size={12} /> {loc.name}, Delhi NCR</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-5 leading-tight">{loc.headline}</h1>
            <p className="text-muted text-lg mt-5 leading-relaxed">{loc.intro}</p>
            <p className="mt-5 text-sm"><span className="font-semibold">We work with:</span> <span className="text-muted">{loc.industriesHint}</span></p>
            <h2 className="font-bold mt-8">Areas we serve in {loc.name}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {loc.areas.map((a) => <li key={a} className="badge bg-surface-2 text-muted normal-case tracking-normal font-semibold">{a}</li>)}
            </ul>
          </div>
          <div id="quote" className="card p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold">Free audit for {loc.name} businesses</h2>
            <p className="text-muted text-sm mt-1 mb-5">We reply within 2 business hours.</p>
            <LeadForm compact source={`/locations/${loc.slug}`} />
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <Reveal>
          <p className="eyebrow">Services in {loc.name}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">Everything a {loc.name} business needs to grow online</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {SERVICE_CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 90}>
              <Link href={`/services/${c.slug}`} className="card p-6 h-full flex flex-col group">
                <span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-[#0b0b14] text-white group-hover:bg-brand transition"><ServiceIcon name={c.icon} size={20} /></span>
                <h3 className="font-display text-lg font-bold mt-4">{c.name} in {loc.name}</h3>
                <p className="text-muted text-sm mt-2 flex-1">{c.short}</p>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-brand mt-4 group-hover:gap-2 transition-all">Explore <ArrowRight size={14} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-8">
        <h2 className="font-display text-2xl font-bold">Industries we serve in {loc.name}</h2>
        <div className="flex flex-wrap gap-2 mt-5">
          {INDUSTRIES.map((ind) => <Link key={ind.slug} href={`/industries/${ind.slug}`} className="btn btn-ghost text-sm !py-2">{ind.name}</Link>)}
        </div>
      </section>

      <section className="container-x py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-display text-3xl font-bold">FAQs from {loc.name} businesses</h2>
          <div className="mt-6"><FAQ items={loc.faqs} /></div>
        </div>
        <aside className="card p-6 h-fit">
          <h3 className="font-bold">Also serving</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {others.map((o) => (
              <li key={o.slug}><Link href={`/locations/${o.slug}`} className="flex items-center gap-2 text-muted hover:text-fg"><MapPin size={14} className="text-brand" />{o.name}</Link></li>
            ))}
          </ul>
        </aside>
      </section>
      <CTA title={`Ready to grow your ${loc.name} business?`} />
    </>
  );
}
