import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, AlertCircle, Check } from "lucide-react";
import { INDUSTRIES, SITE, WORK } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import WorkGrid from "@/components/WorkGrid";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = INDUSTRIES.find((x) => x.slug === slug);
  if (!ind) return {};
  return pageMeta({
    title: `${ind.name} Digital Marketing in Delhi NCR | ${SITE.name}`,
    description: `${ind.headline}. ${ind.description}`.slice(0, 158),
    path: `/industries/${ind.slug}`,
    keywords: ind.keywords,
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = INDUSTRIES.find((x) => x.slug === slug);
  if (!ind) notFound();
  const work = WORK.filter((w) => w.industry === ind.name);
  const others = INDUSTRIES.filter((x) => x.slug !== ind.slug);

  return (
    <>
      <JsonLd data={[faqJsonLd(ind.faqs), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Industries", path: "/industries" }, { name: ind.name, path: `/industries/${ind.slug}` }])]} />
      <section className="relative overflow-hidden">
        <div className="blob w-96 h-96 bg-brand -top-32 -right-20" />
        <div className="container-x relative pt-16 md:pt-24 pb-12 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-muted mb-4" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/industries">Industries</Link> / <span className="text-fg">{ind.name}</span></nav>
            <span className="eyebrow">{ind.name}</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-5 leading-tight">{ind.headline}</h1>
            <p className="text-muted text-lg mt-5 leading-relaxed">{ind.description}</p>
            <h2 className="font-bold mt-8">Sound familiar?</h2>
            <ul className="mt-3 space-y-2">
              {ind.painPoints.map((p) => <li key={p} className="flex gap-2 text-sm"><AlertCircle size={18} className="text-sun shrink-0" /> {p}</li>)}
            </ul>
          </div>
          <div id="quote" className="card p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold">Get a free {ind.name.toLowerCase()} audit</h2>
            <p className="text-muted text-sm mt-1 mb-5">We reply within 2 business hours.</p>
            <LeadForm compact source={`/industries/${ind.slug}`} />
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <Reveal>
          <p className="eyebrow">The playbook</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">Channels that work for {ind.name.toLowerCase()}</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {ind.channels.map((c, i) => (
            <Reveal key={c} delay={(i % 4) * 90}>
              <div className="card p-5 h-full flex gap-3 items-start">
                <span className="w-8 h-8 rounded-lg bg-brand/15 text-brand grid place-items-center shrink-0"><Check size={16} /></span>
                <p className="font-medium">{c}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {work.length > 0 && (
        <section className="container-x py-8">
          <h2 className="font-display text-2xl font-bold mb-6">{ind.name} work</h2>
          <WorkGrid items={work} showTabs={false} />
        </section>
      )}

      <section className="container-x py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-display text-3xl font-bold">FAQs for {ind.name.toLowerCase()}</h2>
          <div className="mt-6"><FAQ items={ind.faqs} /></div>
        </div>
        <aside className="card p-6 h-fit">
          <h3 className="font-bold">Other industries</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {others.map((o) => (
              <li key={o.slug}><Link href={`/industries/${o.slug}`} className="flex items-center gap-2 text-muted hover:text-fg"><ArrowRight size={14} className="text-brand" />{o.name}</Link></li>
            ))}
          </ul>
        </aside>
      </section>
      <CTA title={`Ready to grow your ${ind.name.toLowerCase()} business?`} />
    </>
  );
}
