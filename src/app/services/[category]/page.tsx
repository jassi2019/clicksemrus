import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { SERVICES, SERVICE_CATEGORIES, SITE, findCategory, findSubService } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import ServiceIcon from "@/components/ServiceIcon";
import ServiceArt from "@/components/ServiceArt";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";

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

  return (
    <>
      <JsonLd data={[faqJsonLd(faqs), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Services", path: "/services" }, { name: c.name, path: `/services/${c.slug}` }])]} />
      <section className="relative overflow-hidden">
        <div className="blob w-96 h-96 bg-brand -top-32 -right-20" />
        <div className="container-x relative pt-16 md:pt-24 pb-12 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-muted mb-4" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/services">Services</Link> / <span className="text-fg">{c.name}</span></nav>
            <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-[#0b0b14] text-white"><ServiceIcon name={c.icon} size={26} /></span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-5 leading-tight">{c.headline}</h1>
            <p className="text-muted text-lg mt-5 leading-relaxed">{c.description}</p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-2">
              {benefits.map((b) => <li key={b} className="flex gap-2 text-sm"><Check size={18} className="text-lime shrink-0" /> {b}</li>)}
            </ul>
            <div className="flex gap-3 mt-8 flex-wrap">
              <a href="#quote" className="btn btn-primary">Get a free audit <ArrowRight size={18} /></a>
              <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
            </div>
          </div>
          <div id="quote" className="card p-6 md:p-8 relative overflow-hidden">
            <ServiceArt slug={c.slug} />
            <h2 className="font-display text-2xl font-bold">Request a free audit</h2>
            <p className="text-muted text-sm mt-1 mb-5">We reply within 2 business hours.</p>
            <LeadForm compact source={`/services/${c.slug}`} />
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <Reveal>
          <p className="eyebrow">{c.name}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">{c.subs.length} specialist services</h2>
          <p className="text-muted mt-3 max-w-2xl">{c.tagline}</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {c.subs.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 90}>
              <Link href={`/services/${c.slug}/${s.slug}`} className="card p-6 h-full flex flex-col group relative overflow-hidden">
                <span className="font-display text-sm font-bold text-brand tracking-widest">0{i + 1}</span>
                <h3 className="font-display text-xl font-bold mt-3">{s.name}</h3>
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

      {base && (
        <section className="container-x py-8">
          <h2 className="font-display text-3xl font-bold">What every {c.name.toLowerCase()} plan includes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {base.deliverables.map((d, i) => (
              <div key={d} className="card p-5 flex gap-3 items-start">
                <span className="w-8 h-8 rounded-lg bg-brand/15 text-brand grid place-items-center text-sm font-bold shrink-0">{i + 1}</span>
                <p className="font-medium">{d}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container-x py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-display text-3xl font-bold">FAQs about {c.name.toLowerCase()}</h2>
          <div className="mt-6"><FAQ items={faqs} /></div>
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
