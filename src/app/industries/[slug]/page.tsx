import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, AlertCircle, Check, IndianRupee, Rocket, Unlock } from "lucide-react";
import { INDUSTRIES, SITE, workForIndustry, serviceUrl, findSubService } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import ServiceArt from "@/components/ServiceArt";
import RelatedWork from "@/components/RelatedWork";

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

/** Illustration and the service pages most relevant to each industry. */
const ART: Record<string, string> = {
  "retail-ecommerce": "meta-ads",
  "restaurants-food": "social-media-marketing",
  "healthcare-clinics": "seo",
  "education-coaching": "google-ads-ppc",
  "real-estate": "google-ads-ppc",
  "fashion-beauty": "influencer-marketing",
};
const LINKS: Record<string, string[]> = {
  "retail-ecommerce": ["shopify-development", "meta-ads", "retention-marketing"],
  "restaurants-food": ["local-seo", "instagram-marketing", "whatsapp-automation"],
  "healthcare-clinics": ["local-seo", "google-ads-ppc", "whatsapp-automation"],
  "education-coaching": ["google-ads-ppc", "reels-video-production", "crm-setup"],
  "real-estate": ["landing-pages", "meta-ads", "lead-management"],
  "fashion-beauty": ["influencer-marketing", "reels-video-production", "meta-ads"],
};

const PLAN = [
  { when: "Weeks 1 to 2", t: "Audit", d: "Website, Google Business Profile, ad accounts and competitors reviewed. Tracking fixed first so every rupee after this is measured." },
  { when: "Weeks 3 to 4", t: "Launch", d: "First campaigns, content calendar and landing pages go live. Lead routing to WhatsApp and your CRM is tested end to end." },
  { when: "Weeks 5 to 8", t: "Optimise", d: "Weekly cuts and pushes: keywords, audiences, creatives and offers. You get a short note every week on what changed and why." },
  { when: "Weeks 9 to 12", t: "Scale", d: "Budgets, locations and channels expand only where cost per lead is proven. The plan for the next quarter is written with you." },
];

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = INDUSTRIES.find((x) => x.slug === slug);
  if (!ind) notFound();
  const work = workForIndustry(ind.name);
  const exact = work.some((w) => w.industry === ind.name);
  const others = INDUSTRIES.filter((x) => x.slug !== ind.slug);
  const lower = ind.name.toLowerCase();
  const links = (LINKS[ind.slug] ?? []).map((s) => ({ slug: s, url: serviceUrl(s), name: findSubService(s)?.service.name ?? s.replace(/-/g, " ") }));

  return (
    <>
      <JsonLd data={[faqJsonLd(ind.faqs), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Industries", path: "/industries" }, { name: ind.name, path: `/industries/${ind.slug}` }])]} />

      {/* hero */}
      <section className="relative overflow-hidden mesh">
        <div className="absolute inset-0 dots opacity-70" />
        <div className="blob w-[26rem] h-[26rem] bg-brand -top-32 -right-20" />
        <div className="container-x relative pt-14 md:pt-20 pb-14 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-muted mb-5" aria-label="Breadcrumb"><Link href="/" className="hover:text-fg">Home</Link> / <Link href="/industries" className="hover:text-fg">Industries</Link> / <span className="text-fg">{ind.name}</span></nav>
            <span className="eyebrow">{ind.name}</span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">{ind.headline}</h1>
            <p className="text-muted text-lg mt-6 leading-relaxed">{ind.description}</p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <a href="#quote" className="btn btn-primary">Get a free {lower} audit <ArrowRight size={18} /></a>
              <Link href="/case-studies" className="btn btn-ghost">See our work</Link>
            </div>
            <ul className="flex flex-wrap gap-2.5 mt-8" aria-label="Why clients choose us">
              <li className="proof"><IndianRupee size={14} /> Reports in rupees</li>
              <li className="proof"><Rocket size={14} /> 7-day launch</li>
              <li className="proof"><Unlock size={14} /> No lock-ins</li>
            </ul>
          </div>
          <Reveal variant="zoom">
            <TiltCard className="p-7 overflow-hidden" max={6}>
              <ServiceArt slug={ART[ind.slug] ?? "seo"} className="!w-32 !h-32 !opacity-15" />
              <p className="text-xs font-bold tracking-widest text-sun uppercase">Sound familiar?</p>
              <ul className="mt-4 grid gap-3">
                {ind.painPoints.map((p) => (
                  <li key={p} className="flex gap-3 items-start font-medium leading-snug"><AlertCircle size={18} className="text-sun shrink-0 mt-0.5" /> {p}</li>
                ))}
              </ul>
              <p className="text-sm text-muted mt-5 pt-5 border-t border-border">We hear these from {lower} owners every week. The sections below show how we fix each one.</p>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* pain points we solve */}
      <section className="container-x py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Pain points we solve</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">The problems {lower} businesses bring us</h2>
          <p className="text-muted mt-4 text-lg">Each one has a specific fix. No generic &quot;digital presence&quot; packages.</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {ind.painPoints.map((p, i) => (
            <Reveal key={p} delay={i * 90}>
              <div className="card num-card p-6 h-full flex flex-col" data-num={`0${i + 1}`}>
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-sun/15 text-sun"><AlertCircle size={20} /></span>
                <h3 className="font-display text-xl font-bold mt-4 pr-10">{p}</h3>
                <div className="mt-4 pt-4 border-t border-border flex-1">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-muted">Our fix</p>
                  <p className="font-medium mt-1 flex gap-2"><Check size={18} className="text-lime shrink-0 mt-0.5" />{ind.channels[i] ?? ind.channels[0]}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* channels split */}
      <section className="section-tint relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 dots opacity-50" />
        <div className="container-x relative grid lg:grid-cols-2 gap-12 items-center">
          <Reveal variant="right">
            <span className="eyebrow">The playbook</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Channels that work for {lower}</h2>
            <p className="text-muted mt-4 text-lg leading-relaxed">We have run these channels for {lower} brands in Delhi NCR and know the benchmarks, the creative formats and the compliance rules. This is the mix we usually start with.</p>
            <ul className="mt-8 grid gap-3">
              {ind.channels.map((c, i) => (
                <li key={c} className="card !transform-none p-4 flex gap-4 items-center">
                  <span className="font-display text-lg font-extrabold text-brand w-8 shrink-0">0{i + 1}</span>
                  <span className="font-semibold">{c}</span>
                </li>
              ))}
            </ul>
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {links.map((l) => <Link key={l.slug} href={l.url} className="btn btn-ghost text-sm !py-2">{l.name} <ArrowRight size={14} /></Link>)}
              </div>
            )}
          </Reveal>
          <Reveal delay={90} variant="zoom" className="hidden lg:block">
            <div className="relative aspect-square max-w-md mx-auto grid place-items-center">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand/15 via-brand-2/10 to-sun/15 border border-border" />
              <div className="absolute inset-0 dots opacity-60 rounded-[2.5rem]" />
              <ServiceArt slug={ART[ind.slug] ?? "seo"} className="!static !w-56 !h-56 !opacity-80" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 90-day plan */}
      <section className="container-x py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">90-day plan</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">What the first quarter looks like</h2>
          <p className="text-muted mt-4 text-lg">The same rhythm on every {lower} account, so you know what happens next before you sign.</p>
        </Reveal>
        <ol className="timeline mt-12" style={{ "--steps": 4 } as React.CSSProperties}>
          {PLAN.map((p, i) => (
            <li key={p.t} className="timeline-step">
              <span className="timeline-dot">{i + 1}</span>
              <Reveal delay={i * 90}>
                <div className="card p-6 h-full">
                  <p className="text-xs font-bold text-muted tracking-widest uppercase">{p.when}</p>
                  <h3 className="font-display text-xl font-bold mt-2">{p.t}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{p.d}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <RelatedWork
        items={work}
        limit={3}
        tint
        title={exact ? `${ind.name} work you can open right now` : "Work across Delhi NCR brands"}
        sub={exact ? `Live sites and campaigns for ${lower} clients. Hover to scroll, tap for a full preview.` : `We are onboarding our first ${lower} case study. Meanwhile, here is how we work for other Delhi NCR brands.`}
      />

      {/* faq */}
      <section className="container-x py-16 md:py-20 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <span className="eyebrow">FAQ</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-4">Questions from {lower} owners</h2>
          <div className="mt-8"><FAQ items={ind.faqs} /></div>
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

      {/* lead form */}
      <section id="quote" className="relative overflow-hidden py-16 md:py-24 scroll-mt-28 mesh">
        <div className="container-x relative grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <span className="eyebrow">Free audit</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Get a free {lower} marketing audit</h2>
            <p className="text-muted mt-5 text-lg leading-relaxed">Within 48 hours you get a written review of your Google presence, social and ads, benchmarked against {lower} competitors in Delhi NCR, with a prioritised 90-day plan.</p>
            <ul className="mt-8 grid gap-3">
              {["Google Maps and website visibility check", "Ad account waste and tracking review", "Content and creative scorecard", "Clear quote, no hidden add-ons"].map((x) => (
                <li key={x} className="flex gap-3 items-center font-medium"><span className="w-7 h-7 rounded-full bg-[#0b0b14] text-white grid place-items-center text-sm font-black">✓</span>{x}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={90}>
            <div className="card p-6 md:p-8 !transform-none">
              <h3 className="font-display text-2xl font-bold">Request a free audit</h3>
              <p className="text-muted text-sm mt-1 mb-5">We reply within 2 business hours.</p>
              <LeadForm compact source={`/industries/${ind.slug}`} />
            </div>
          </Reveal>
        </div>
      </section>

      <CTA title={`Ready to grow your ${lower} business?`} />
    </>
  );
}
