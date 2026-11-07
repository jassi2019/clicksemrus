import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, TrendingUp, ExternalLink } from "lucide-react";
import FacebookIcon from "@/components/FacebookIcon";
import InstagramIcon from "@/components/InstagramIcon";
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
          {w.deliverables && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {w.deliverables.map((d) => <li key={d} className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#0b0b14] text-white">{d}</li>)}
            </ul>
          )}
          {(w.url || w.instagram || w.facebook || w.appStore || w.playStore) && (
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              {w.url && <a href={w.url} target="_blank" rel="noopener noreferrer" className="btn btn-accent">Open live site <ExternalLink size={16} /></a>}
              {w.playStore && <a href={w.playStore} target="_blank" rel="noopener noreferrer" className="btn btn-dark">Google Play</a>}
              {w.appStore && <a href={w.appStore} target="_blank" rel="noopener noreferrer" className="btn btn-dark">App Store</a>}
              {w.instagram && <a href={w.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid place-items-center w-11 h-11 rounded-full border border-border bg-surface hover:bg-[#0b0b14] hover:text-white transition"><InstagramIcon size={18} /></a>}
              {w.facebook && <a href={w.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid place-items-center w-11 h-11 rounded-full border border-border bg-surface hover:bg-[#0b0b14] hover:text-white transition"><FacebookIcon size={18} /></a>}
            </div>
          )}
        </div>
        <Reveal delay={90} variant="zoom">
          {w.shotDesktop ? (
            <div className="work-frame is-animated" style={{ "--shift": `${(-(1 - (w.shotDesktopSize ? w.shotDesktopSize[0] / 1.5 / w.shotDesktopSize[1] : 0.3)) * 100).toFixed(2)}%`, "--play": `${Math.round(((w.shotDesktopSize?.[1] ?? 6000) / 110) * 2.2)}s` } as React.CSSProperties}>
              <div className="work-frame__bar"><span /><span /><span /><i className="work-frame__url">{w.url?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</i></div>
              <div className="work-frame__view">
                <Image src={w.shotDesktop} alt={w.title} width={w.shotDesktopSize?.[0] ?? 1200} height={w.shotDesktopSize?.[1] ?? 6000} className="work-frame__img" priority sizes="(min-width: 1024px) 600px, 100vw" />
              </div>
            </div>
          ) : (
            <div className="card overflow-hidden !transform-none">
              <Image src={w.cover} alt={w.title} width={1200} height={800} className="w-full h-auto" priority sizes="(min-width: 1024px) 600px, 100vw" />
            </div>
          )}
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
