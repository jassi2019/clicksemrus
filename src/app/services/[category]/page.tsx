import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, IndianRupee, Rocket, Unlock } from "lucide-react";
import { SERVICES, SERVICE_CATEGORIES, SITE, findCategory, findSubService, workForService } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import ServiceIcon from "@/components/ServiceIcon";
import ServiceArt from "@/components/ServiceArt";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import RelatedWork from "@/components/RelatedWork";

export const revalidate = 3600;

/** Category hubs plus every legacy /services/[slug] URL (resolved to its sub-service). */
export function generateStaticParams() {
  const slugs = new Set<string>([...SERVICE_CATEGORIES.map((c) => c.slug), ...SERVICES.map((s) => s.slug)]);
  return Array.from(slugs).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = findCategory(category);
  if (c) {
    return pageMeta({
      title: `${c.name} Services in Delhi NCR | ${SITE.name}`,
      description: `${c.headline}. ${c.description}`.slice(0, 158),
      path: `/services/${c.slug}`,
      keywords: c.keywords,
    });
  }
  const hit = findSubService(category);
  if (!hit) return {};
  return pageMeta({
    title: `${hit.service.name} in Delhi NCR | ${SITE.name}`,
    description: `${hit.service.headline}. ${hit.service.description}`.slice(0, 158),
    path: `/services/${hit.category.slug}/${hit.service.slug}`,
    keywords: hit.service.keywords,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = findCategory(category);
  if (!c) {
    // Legacy slug such as /services/google-ads-ppc: render the sub-service template (canonical points to the new URL).
    const hit = findSubService(category);
    if (!hit) notFound();
    return <ServicePageTemplate s={hit.service} category={hit.category} path={`/services/${hit.category.slug}/${hit.service.slug}`} />;
  }
  const base = c.legacy ? SERVICES.find((s) => s.slug === c.legacy) : undefined;
  const benefits = base?.benefits ?? c.subs.slice(0, 4).map((s) => s.benefits[0]);
  const faqs = [...c.faqs, ...(base?.faqs ?? [])].slice(0, 5);
  const otherCats = SERVICE_CATEGORIES.filter((x) => x.slug !== c.slug);
  const work = workForService(c.slug);

  return (
    <>
      <JsonLd data={[faqJsonLd(faqs), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Services", path: "/services" }, { name: c.name, path: `/services/${c.slug}` }])]} />

      {/* hero */}
      <section className="relative overflow-hidden mesh">
        <div className="absolute inset-0 dots opacity-70" />
        <div className="blob w-[26rem] h-[26rem] bg-brand -top-32 -right-20" />
        <div className="container-x relative pt-14 md:pt-20 pb-14 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-muted mb-5" aria-label="Breadcrumb"><Link href="/" className="hover:text-fg">Home</Link> / <Link href="/services" className="hover:text-fg">Services</Link> / <span className="text-fg">{c.name}</span></nav>
            <span className="eyebrow"><ServiceIcon name={c.icon} size={12} /> {c.name} · Delhi NCR</span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">{c.headline}</h1>
            <p className="text-muted text-lg mt-6 leading-relaxed">{c.description}</p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-2.5">
              {benefits.map((b) => <li key={b} className="flex gap-2 text-sm font-medium"><Check size={18} className="text-lime shrink-0" /> {b}</li>)}
            </ul>
            <div className="flex gap-3 mt-8 flex-wrap">
              <a href="#quote" className="btn btn-primary">Get a free audit <ArrowRight size={18} /></a>
              <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
            </div>
            <ul className="flex flex-wrap gap-2.5 mt-8" aria-label="Why clients choose us">
              <li className="proof"><IndianRupee size={14} /> Reports in rupees</li>
              <li className="proof"><Rocket size={14} /> 7-day launch</li>
              <li className="proof"><Unlock size={14} /> No lock-ins</li>
            </ul>
          </div>
          <div id="quote" className="card p-6 md:p-8 relative overflow-hidden !transform-none scroll-mt-28">
            <ServiceArt slug={c.slug} />
            <h2 className="font-display text-2xl font-bold">Request a free audit</h2>
            <p className="text-muted text-sm mt-1 mb-5">We reply within 2 business hours.</p>
            <LeadForm compact source={`/services/${c.slug}`} />
          </div>
        </div>
      </section>

      {/* sub-services */}
      <section className="container-x py-16 md:py-20">
        <Reveal>
          <p className="eyebrow">{c.name}</p>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">{c.subs.length} specialist services</h2>
          <p className="text-muted mt-3 max-w-2xl text-lg">{c.tagline}</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {c.subs.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 90}>
              <Link href={`/services/${c.slug}/${s.slug}`} className="card num-card p-6 h-full flex flex-col group" data-num={`0${i + 1}`}>
                <span className="font-display text-sm font-bold text-brand tracking-widest">0{i + 1}</span>
                <h3 className="font-display text-xl font-bold mt-3 pr-10">{s.name}</h3>
                <p className="text-muted text-sm mt-2 flex-1">{s.short}</p>
                <ul className="mt-4 text-xs text-muted space-y-1">
                  {s.deliverables.slice(0, 3).map((d) => <li key={d} className="flex gap-1.5"><span className="text-brand">•</span>{d}</li>)}
                </ul>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-brand mt-5 group-hover:gap-2 transition-all">View service <ArrowRight size={14} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* included */}
      {base && (
        <section className="section-tint relative overflow-hidden py-16 md:py-20">
          <div className="absolute inset-0 dots opacity-50" />
          <div className="container-x relative">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">What is included</p>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">What every {c.name.toLowerCase()} plan includes</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
              {base.deliverables.map((d, i) => (
                <Reveal key={d} delay={(i % 3) * 80}>
                  <div className="card num-card p-6 h-full" data-num={`0${i + 1}`}>
                    <span className="font-display text-sm font-bold text-brand tracking-widest">0{i + 1}</span>
                    <h3 className="font-display text-lg font-bold mt-3 pr-12">{d}</h3>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <RelatedWork items={work} limit={3} title={`${c.name} work you can open right now`} sub="Live projects for Delhi NCR brands. Hover a card to scroll the site, or tap for a full preview." />

      {/* faq */}
      <section className="container-x py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <span className="eyebrow">FAQ</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-4">FAQs about {c.name.toLowerCase()}</h2>
          <div className="mt-8"><FAQ items={faqs} /></div>
        </div>
        <aside className="card p-6 h-fit">
          <h3 className="font-bold">Other service families</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {otherCats.map((o) => (
              <li key={o.slug}><Link href={`/services/${o.slug}`} className="flex items-center gap-2 text-muted hover:text-fg"><ServiceIcon name={o.icon} size={16} className="text-brand" />{o.name}</Link></li>
            ))}
          </ul>
        </aside>
      </section>
      <CTA title={`Ready to grow with ${c.name.toLowerCase()}?`} />
    </>
  );
}
