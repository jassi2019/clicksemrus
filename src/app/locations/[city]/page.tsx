import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Check, IndianRupee, Rocket, Unlock } from "lucide-react";
import { LOCATIONS, INDUSTRIES, SITE, workForLocation, findSubService, serviceUrl, findCategory } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd } from "@/lib/seo";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import RelatedWork from "@/components/RelatedWork";

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

/** Sub-services most requested by local businesses, shown as the "popular in <city>" grid. */
const POPULAR = ["local-seo", "google-ads-ppc", "meta-ads", "instagram-marketing", "business-website", "whatsapp-automation"];

function checklist(city: string): { t: string; d: string }[] {
  return [
    { t: `Google Business Profile for every ${city} location`, d: "Correct category, services, hours, photos every month and posts every week. Most local rankings are decided here." },
    { t: "Area pages for the localities you serve", d: `One page per area with real directions, landmarks and FAQs, not a template with the suburb name swapped in.` },
    { t: "Reviews that mention the service and the area", d: "A simple WhatsApp follow-up after every job or visit. Fresh, specific reviews move the Maps pack faster than anything else." },
    { t: `Consistent name, address and phone across ${city} directories`, d: "Justdial, Sulekha, IndiaMART, Practo or Zomato depending on your category, all matching your website to the letter." },
    { t: "Click-to-call and WhatsApp above the fold on mobile", d: "Local searches happen on phones. If the number is not visible in the first screen, the call goes to a competitor." },
    { t: "Local links and mentions", d: `Chambers, associations, event sponsors and ${city} news sites. A handful of relevant local links beats hundreds of generic ones.` },
  ];
}

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const loc = LOCATIONS.find((l) => l.slug === city);
  if (!loc) notFound();
  const others = LOCATIONS.filter((l) => l.slug !== loc.slug);
  const work = workForLocation();
  const popular = POPULAR.map((slug) => findSubService(slug)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const items = checklist(loc.name);

  return (
    <>
      <JsonLd data={[localBusinessJsonLd(loc), faqJsonLd(loc.faqs), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: loc.name, path: `/locations/${loc.slug}` }])]} />

      {/* hero */}
      <section className="relative overflow-hidden mesh">
        <div className="absolute inset-0 dots opacity-70" />
        <div className="blob w-[26rem] h-[26rem] bg-brand-2 -top-32 -left-20" />
        <div className="blob w-72 h-72 bg-sun right-[-6rem] bottom-[-4rem] opacity-25" style={{ animationDelay: "-6s" }} />
        <div className="container-x relative pt-14 md:pt-20 pb-14 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-muted mb-5" aria-label="Breadcrumb"><Link href="/" className="hover:text-fg">Home</Link> / <span className="text-fg">{loc.name}</span></nav>
            <span className="eyebrow"><MapPin size={12} /> {loc.name}, Delhi NCR</span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">Digital marketing agency in <span className="gradient-text">{loc.name}</span></h1>
            <p className="text-muted text-lg mt-6 leading-relaxed">{loc.intro}</p>
            <p className="mt-5 text-sm"><span className="font-semibold">We work with:</span> <span className="text-muted">{loc.industriesHint}</span></p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <a href="#quote" className="btn btn-primary">Free audit for {loc.name} businesses <ArrowRight size={18} /></a>
              <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
            </div>
            <ul className="flex flex-wrap gap-2.5 mt-8" aria-label="Why clients choose us">
              <li className="proof"><IndianRupee size={14} /> Reports in rupees</li>
              <li className="proof"><Rocket size={14} /> 7-day launch</li>
              <li className="proof"><Unlock size={14} /> No lock-ins</li>
            </ul>
          </div>
          <Reveal variant="zoom">
            <TiltCard className="p-7" max={6}>
              <p className="text-xs font-bold tracking-widest text-brand uppercase flex items-center gap-2"><MapPin size={14} /> Areas we serve in {loc.name}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {loc.areas.map((a) => <li key={a} className="px-3 py-1.5 rounded-full text-sm font-semibold bg-surface-2 border border-border">{a}</li>)}
              </ul>
              <p className="text-sm text-muted mt-5 pt-5 border-t border-border">Not listed? We cover all of {loc.name} and the rest of Delhi NCR. Ads can be targeted to a pin code or a radius around your business.</p>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* local seo checklist */}
      <section className="container-x py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Local SEO checklist</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Six things every {loc.name} business should fix first</h2>
          <p className="text-muted mt-4 text-lg">This is the first page of every local audit we run. Do these yourself or let us handle them inside a <Link href={serviceUrl("local-seo")} className="text-brand font-semibold underline underline-offset-2">Local SEO</Link> plan.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={(i % 3) * 90}>
              <div className="card num-card p-6 h-full" data-num={`0${i + 1}`}>
                <span className="grid place-items-center w-9 h-9 rounded-lg bg-lime/15 text-lime"><Check size={18} /></span>
                <h3 className="font-display text-lg font-bold mt-4 pr-10">{it.t}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* popular services */}
      <section className="section-tint relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 dots opacity-50" />
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">Popular in {loc.name}</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Services {loc.name} businesses ask for most</h2>
            <p className="text-muted mt-4 text-lg">Each one is scoped for your category and area, with tracking and a live dashboard included.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {popular.map((p, i) => (
              <Reveal key={p.service.slug} delay={(i % 3) * 90}>
                <Link href={`/services/${p.category.slug}/${p.service.slug}`} className="card p-6 h-full flex flex-col group">
                  <span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-[#0b0b14] text-white group-hover:bg-brand transition"><ServiceIcon name={p.category.icon} size={20} /></span>
                  <h3 className="font-display text-lg font-bold mt-4">{p.service.name} in {loc.name}</h3>
                  <p className="text-muted text-sm mt-2 flex-1">{p.service.short}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-brand mt-4 group-hover:gap-2 transition-all">Explore <ArrowRight size={14} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-8">
            {["seo", "paid-ads", "social-media-marketing", "web-design-development", "ecommerce", "branding-creative", "automation-crm"].map((slug) => {
              const c = findCategory(slug);
              return c ? <Link key={slug} href={`/services/${c.slug}`} className="btn btn-ghost text-sm !py-2">{c.name} <ArrowRight size={14} /></Link> : null;
            })}
          </div>
        </div>
      </section>

      {/* industries */}
      <section className="container-x py-12 md:py-16">
        <h2 className="font-display text-2xl md:text-3xl font-extrabold">Industries we serve in {loc.name}</h2>
        <p className="text-muted mt-2">Sector playbooks with benchmarks, creative formats and compliance rules already worked out.</p>
        <div className="flex flex-wrap gap-2 mt-6">
          {INDUSTRIES.map((ind) => <Link key={ind.slug} href={`/industries/${ind.slug}`} className="btn btn-ghost text-sm !py-2">{ind.name}</Link>)}
        </div>
      </section>

      <RelatedWork items={work} limit={3} tint title={`Work for Delhi NCR brands, open in ${loc.name} or anywhere`} sub="Live sites and stores we built or grow. Hover a card to scroll the site, or tap for a full preview." />

      {/* faq */}
      <section className="container-x py-16 md:py-20 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <span className="eyebrow">FAQ</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-4">FAQs from {loc.name} businesses</h2>
          <div className="mt-8"><FAQ items={loc.faqs} /></div>
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

      {/* lead form */}
      <section id="quote" className="relative overflow-hidden py-16 md:py-24 scroll-mt-28 mesh">
        <div className="container-x relative grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <span className="eyebrow">Free audit</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Free marketing audit for {loc.name} businesses</h2>
            <p className="text-muted mt-5 text-lg leading-relaxed">Within 48 hours you get a written review of your Google Maps visibility, website, social and ads against competitors in {loc.name}, with a prioritised 90-day plan.</p>
            <ul className="mt-8 grid gap-3">
              {[`Maps ranking check for your ${loc.name} keywords`, "Website speed and conversion review", "Ad account waste analysis", "In-person or video walkthrough, your choice"].map((x) => (
                <li key={x} className="flex gap-3 items-center font-medium"><span className="w-7 h-7 rounded-full bg-[#0b0b14] text-white grid place-items-center text-sm font-black">✓</span>{x}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={90}>
            <div className="card p-6 md:p-8 !transform-none">
              <h3 className="font-display text-2xl font-bold">Request a free audit</h3>
              <p className="text-muted text-sm mt-1 mb-5">We reply within 2 business hours.</p>
              <LeadForm compact source={`/locations/${loc.slug}`} />
            </div>
          </Reveal>
        </div>
      </section>

      <CTA title={`Ready to grow your ${loc.name} business?`} />
    </>
  );
}
