import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, Heart, Check } from "lucide-react";
import { SERVICE_CATEGORIES, SITE, WORK, serviceUrl } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import ServiceIcon from "@/components/ServiceIcon";
import ServiceArt from "@/components/ServiceArt";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import RelatedWork from "@/components/RelatedWork";

export const metadata = pageMeta({
  title: "Digital Marketing Services in Delhi NCR | SEO, Ads, Social, Web, E-commerce",
  description: `Explore ${SITE.name} services: SEO and search, paid ads, social media and content, web development, e-commerce, creative and branding, automation and CRM for businesses in Delhi NCR.`,
  path: "/services",
  keywords: ["digital marketing services delhi", "seo services delhi ncr", "social media marketing services", "ppc services gurugram", "web development noida"],
});

/** Three most-requested sub-services per family, shown as quick links on the hub cards. */
const POPULAR: Record<string, string[]> = {
  seo: ["local-seo", "technical-seo", "ecommerce-seo"],
  "paid-ads": ["google-ads-ppc", "meta-ads", "remarketing"],
  "social-media-marketing": ["instagram-marketing", "reels-video-production", "influencer-marketing"],
  "web-design-development": ["business-website", "landing-pages", "wordpress-development"],
  ecommerce: ["shopify-development", "marketplace-management", "retention-marketing"],
  "branding-creative": ["logo-identity", "ad-creatives", "packaging-design"],
  "automation-crm": ["whatsapp-automation", "crm-setup", "lead-management"],
};

const CHANNEL_FIRST = [
  {
    icon: Zap,
    tag: "Need leads this month",
    pick: "Start with Paid Ads",
    href: "/services/paid-ads",
    why: "Google Search catches people already looking for you; Meta finds the ones who do not know you yet. With tracking set up in week one, you see cost per lead by week two and can decide with data.",
    points: ["Live within 7 days", "Budget from Rs 30,000 per month in spend", "Pairs with a landing page for best results"],
  },
  {
    icon: TrendingUp,
    tag: "Want compounding traffic",
    pick: "Start with SEO",
    href: "/services/seo",
    why: "Search traffic you do not pay for per click. Local SEO moves in 4 to 8 weeks for Delhi NCR businesses; competitive categories take a quarter. Every month of work keeps paying after you stop.",
    points: ["Lowest long-term cost per lead", "Owns Google Maps for 'near me' searches", "3-month initial commitment, then month to month"],
  },
  {
    icon: Heart,
    tag: "Building a brand",
    pick: "Start with Social & Creative",
    href: "/services/social-media-marketing",
    why: "Reels, creator collaborations and a trend desk that reacts within 24 hours. Best for food, fashion, beauty, wellness and founder-led B2B, where people check the grid before they buy.",
    points: ["Content shot on location in Delhi NCR", "Creator network from nano to celebrity", "Feeds your ads with proven creative"],
  },
];

export default function ServicesPage() {
  const total = SERVICE_CATEGORIES.reduce((n, c) => n + c.subs.length, 0);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Services", path: "/services" }])} />

      {/* hero */}
      <section className="relative overflow-hidden mesh">
        <div className="absolute inset-0 dots opacity-70" />
        <div className="blob w-[26rem] h-[26rem] bg-brand -top-32 -right-20" />
        <div className="container-x relative pt-14 md:pt-20 pb-12">
          <Reveal className="max-w-3xl">
            <span className="eyebrow">Services</span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">Full-funnel digital marketing services in <span className="gradient-text">Delhi NCR</span></h1>
            <p className="text-muted mt-6 text-lg leading-relaxed">Seven service families, {total} specialist services, one team. Start with the channel that pays back fastest for your business, or hand us the whole funnel. Every engagement includes tracking, a live dashboard and a named growth manager.</p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <Link href="/contact" className="btn btn-primary">Get a free audit <ArrowRight size={18} /></Link>
              <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* category cards */}
      <section className="container-x py-16 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICE_CATEGORIES.map((c, i) => {
            const popular = (POPULAR[c.slug] ?? []).map((slug) => c.subs.find((s) => s.slug === slug)).filter((s): s is NonNullable<typeof s> => Boolean(s));
            return (
              <Reveal key={c.slug} delay={(i % 3) * 90}>
                <TiltCard className="p-6 h-full flex flex-col overflow-hidden group" max={6}>
                  <ServiceArt slug={c.slug} />
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-grid place-items-center w-12 h-12 rounded-xl bg-[#0b0b14] text-white group-hover:bg-brand transition"><ServiceIcon name={c.icon} /></span>
                    <span className="badge bg-surface-2 text-muted">{c.subs.length} services</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold mt-5"><Link href={`/services/${c.slug}`} className="hover:text-brand transition">{c.name}</Link></h2>
                  <p className="text-muted text-sm mt-2 leading-relaxed">{c.short}</p>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-muted mt-5">Popular</p>
                  <ul className="mt-2 text-sm space-y-1.5 flex-1">
                    {popular.map((s) => (
                      <li key={s.slug}><Link href={`/services/${c.slug}/${s.slug}`} className="text-fg/85 hover:text-brand flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand" />{s.name}</Link></li>
                    ))}
                  </ul>
                  <Link href={`/services/${c.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-brand mt-5 group-hover:gap-2 transition-all">All {c.subs.length} {c.name} services <ArrowRight size={14} /></Link>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* which channel first */}
      <section className="section-tint relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 dots opacity-50" />
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">Which channel first?</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Match the channel to the goal, not the trend</h2>
            <p className="text-muted mt-4 text-lg">Most Delhi NCR businesses should not start everywhere at once. Here is how we decide on the first call.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {CHANNEL_FIRST.map((c, i) => (
              <Reveal key={c.tag} delay={i * 90}>
                <div className="card num-card p-7 h-full flex flex-col" data-num={`0${i + 1}`}>
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand/10 text-brand"><c.icon size={22} /></span>
                  <p className="text-xs font-bold tracking-widest uppercase text-muted mt-5">{c.tag}</p>
                  <h3 className="font-display text-2xl font-bold mt-1">{c.pick}</h3>
                  <p className="text-muted text-sm mt-3 leading-relaxed flex-1">{c.why}</p>
                  <ul className="mt-5 space-y-2 text-sm">
                    {c.points.map((p) => <li key={p} className="flex gap-2"><Check size={16} className="text-lime shrink-0 mt-0.5" />{p}</li>)}
                  </ul>
                  <Link href={c.href} className="inline-flex items-center gap-1 text-sm font-bold text-brand mt-6">Explore <ArrowRight size={14} /></Link>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-sm text-muted mt-8 max-w-2xl">Not sure? Our <Link href={serviceUrl("seo-audit")} className="text-brand font-semibold underline underline-offset-2">SEO audit</Link> and free growth call cover all three and tell you where the fastest payback is.</p>
        </div>
      </section>

      <RelatedWork items={WORK} limit={3} title="Work across every service family" sub="Clinics, D2C stores, an education app and a skincare brand. Open any project to see the live site." />

      <CTA title="Not sure which service you need?" sub="Tell us your goal and budget. We will recommend the channel mix with the fastest payback, free." />
    </>
  );
}
