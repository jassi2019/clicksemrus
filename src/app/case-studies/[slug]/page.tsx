import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, TrendingUp } from "lucide-react";
import { SITE, WORK, SERVICES, INDUSTRIES, serviceUrl } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import WorkGrid from "@/components/WorkGrid";

export function generateStaticParams() {
  return WORK.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = WORK.find((x) => x.slug === slug);
  if (!w) return {};
  return pageMeta({
    title: `${w.title} | ${w.industry} case study`,
    description: `${w.result}. ${w.summary}`.slice(0, 158),
    path: `/case-studies/${w.slug}`,
    image: `${SITE.url}${w.cover}`,
    type: "article",
  });
}

const TYPE_LABEL = { website: "Website", creative: "Creative", reel: "Reel" } as const;

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = WORK.find((x) => x.slug === slug);
  if (!w) notFound();
  const services = w.services.map((s) => SERVICES.find((x) => x.slug === s)).filter((x): x is (typeof SERVICES)[number] => Boolean(x));
  const industry = INDUSTRIES.find((i) => i.name === w.industry);
  const related = WORK.filter((x) => x.slug !== w.slug && (x.industry === w.industry || x.type === w.type)).slice(0, 3);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Our work", path: "/case-studies" }, { name: w.title, path: `/case-studies/${w.slug}` }])} />
      <section className="container-x pt-16 md:pt-24 pb-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <nav className="text-xs text-muted mb-4" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/case-studies">Our work</Link> / <span className="text-fg">{w.title}</span></nav>
          <div className="flex gap-2 flex-wrap">
            <span className="badge bg-surface-2 text-fg border border-border">{TYPE_LABEL[w.type]}</span>
            {industry ? <Link href={`/industries/${industry.slug}`} className="badge bg-brand/10 text-brand">{w.industry}</Link> : <span className="badge bg-brand/10 text-brand">{w.industry}</span>}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-5 leading-tight">{w.title}</h1>
          <p className="text-muted mt-2 font-medium">{w.client}</p>
          <p className="text-muted text-lg mt-5 leading-relaxed">{w.summary}</p>
          <p className="mt-6 inline-flex items-center gap-2 font-bold text-lg"><TrendingUp className="text-lime" size={22} /> {w.result}</p>
        </div>
        <Reveal delay={90} variant="zoom">
          <div className="card overflow-hidden !transform-none">
            <Image src={w.cover} alt={w.title} width={1200} height={800} className="w-full h-auto" priority sizes="(min-width: 1024px) 600px, 100vw" />
          </div>
        </Reveal>
      </section>

      <section className="container-x py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {[
            ["The challenge", w.challenge],
            ["What we did", w.approach],
            ["Result", `${w.result}. ${w.summary}`],
          ].map(([h, body], i) => (
            <Reveal key={h} delay={i * 90}>
              <p className="text-xs font-bold tracking-widest text-muted">0{i + 1}</p>
              <h2 className="font-display text-3xl font-bold mt-1">{h}</h2>
              <p className="text-muted text-lg mt-3 leading-relaxed">{body}</p>
            </Reveal>
          ))}
        </div>
        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold">Services used</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.slug}><Link href={serviceUrl(s.slug)} className="flex items-center gap-2 text-muted hover:text-fg"><ServiceIcon name={s.icon} size={16} className="text-brand" />{s.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="card p-6 bg-gradient-to-br from-brand/15 to-transparent">
            <h3 className="font-bold">Want this for your business?</h3>
            <p className="text-sm text-muted mt-2">Free 30-minute call. We will map the same playbook to your goals and budget.</p>
            <Link href="/contact" className="btn btn-primary mt-4 w-full text-sm">Book a call <ArrowRight size={16} /></Link>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="container-x py-12">
          <h2 className="font-display text-2xl font-bold mb-6">More work</h2>
          <WorkGrid items={related} showTabs={false} />
        </section>
      )}
      <CTA title="Ready for results like these?" />
    </>
  );
}
