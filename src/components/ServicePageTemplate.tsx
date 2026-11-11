import Link from "next/link";
import { ArrowRight, Check, IndianRupee, Rocket, Unlock, Target, Zap, BarChart3, TrendingUp, Building2, Store, Stethoscope, GraduationCap, ShoppingBag, Briefcase, Sparkles, MessageCircle } from "lucide-react";
import { SERVICES, serviceUrl, workForService, type ServiceCategory, type SubService } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import ServiceIcon from "@/components/ServiceIcon";
import ServiceArt from "@/components/ServiceArt";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import BlogCard from "@/components/BlogCard";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import Counter from "@/components/Counter";
import RelatedWork from "@/components/RelatedWork";

type Audience = { icon: React.ComponentType<{ size?: number; className?: string }>; t: string; d: string };

/** "Who this is for" cards, keyed by service family. */
const AUDIENCE: Record<string, Audience[]> = {
  seo: [
    { icon: Stethoscope, t: "Clinics and local services", d: "Dentists, dermatologists, salons and showrooms in Delhi NCR whose customers search 'near me' and call the first result on Maps." },
    { icon: ShoppingBag, t: "E-commerce and D2C stores", d: "Shopify and WooCommerce brands paying too much for every paid order and wanting category pages that rank for buying keywords." },
    { icon: Briefcase, t: "B2B and professional firms", d: "Consultancies, SaaS and manufacturers in Gurugram and Noida that need steady inbound enquiries without a sales army." },
  ],
  "paid-ads": [
    { icon: Building2, t: "Real estate and high-ticket", d: "Developers and channel partners who need qualified site visits this month, with budget and location filters built into the funnel." },
    { icon: GraduationCap, t: "Education and admissions", d: "Coaching institutes and ed-tech with a seasonal calendar: batch launches, exam dates and counselling slots to fill." },
    { icon: ShoppingBag, t: "D2C brands scaling spend", d: "Stores past the first Rs 1 lakh a month in ad spend that need creative testing, CAPI tracking and a real ROAS target." },
  ],
  "social-media-marketing": [
    { icon: Store, t: "Restaurants, cafes and food brands", d: "Kitchens that look great on Instagram at 8 pm but still depend on aggregators for every order." },
    { icon: Sparkles, t: "Fashion, beauty and lifestyle", d: "Labels and salons whose customers discover them on reels first and check the grid before they buy or book." },
    { icon: Briefcase, t: "Founders building a voice", d: "B2B founders and clinicians who want LinkedIn and Instagram authority without spending their evenings writing posts." },
  ],
  "web-design-development": [
    { icon: Briefcase, t: "Service businesses with an old site", d: "Companies whose website is slow, hard to edit or quietly losing enquiries to competitors with clearer pages." },
    { icon: Target, t: "Teams running ads to a homepage", d: "Anyone sending Google or Meta traffic to a generic page and wondering why cost per lead keeps climbing." },
    { icon: GraduationCap, t: "Products and apps launching", d: "Apps, courses and new brands that need a fast landing page with install or sign-up CTAs before launch day." },
  ],
  ecommerce: [
    { icon: ShoppingBag, t: "New D2C brands", d: "Founders launching a Shopify store who want pixels, feeds, offers and WhatsApp set up correctly from day one." },
    { icon: Store, t: "Offline retailers going online", d: "Lajpat Nagar, Karol Bagh and Sector 18 stores adding an online channel without losing margin to marketplaces." },
    { icon: TrendingUp, t: "Stores stuck at a plateau", d: "Brands with traffic but flat conversion, rising returns or no retention flows, that need CRO and repeat revenue." },
  ],
  "branding-creative": [
    { icon: Sparkles, t: "Brands about to scale ads", d: "Companies that know their creative is the bottleneck and want weekly batches of hooks, statics and video." },
    { icon: ShoppingBag, t: "Product brands and packaging", d: "Food, cosmetics and wellness labels that need packaging, labels and mockups that sell on shelf and in unboxing reels." },
    { icon: Building2, t: "Businesses rebranding", d: "Established firms whose logo and website no longer match the quality of what they deliver." },
  ],
  "automation-crm": [
    { icon: Building2, t: "High-volume lead businesses", d: "Real estate, education and clinics where leads go cold in minutes and follow-up depends on who is free." },
    { icon: ShoppingBag, t: "E-commerce retention", d: "Stores that want cart recovery, win-back and loyalty flows on WhatsApp and email measured by repeat revenue." },
    { icon: Briefcase, t: "Sales teams without a pipeline", d: "Teams running on spreadsheets and phone notes who need a CRM that fills itself and a dashboard the founder trusts." },
  ],
};

const DEFAULT_AUDIENCE: Audience[] = [
  { icon: Store, t: "Local businesses in Delhi NCR", d: "Clinics, restaurants, showrooms and institutes that need more enquiries from their own area." },
  { icon: ShoppingBag, t: "D2C and e-commerce brands", d: "Online stores that want profitable growth across search, social and retention." },
  { icon: Briefcase, t: "B2B and professional services", d: "Firms in Gurugram and Noida that need qualified inbound leads without cold calling." },
];

const PROCESS = [
  { icon: Target, t: "Audit and plan", when: "Week 1", d: "We review your site, accounts, competitors and funnel, agree the KPIs that matter and write a 90-day roadmap you can hold us to." },
  { icon: Zap, t: "Build and launch", when: "Weeks 2 to 4", d: "Tracking first, then the work: pages, campaigns, content or fixes go live. You see the first data in the dashboard within days." },
  { icon: BarChart3, t: "Optimise weekly", when: "Months 2 to 3", d: "Every week we cut what does not perform and push what does. You get a short note on what changed and why, not a PDF of impressions." },
  { icon: TrendingUp, t: "Scale on proof", when: "Month 3 onwards", d: "Once cost per lead or revenue is proven, we add budget, channels and locations. Month to month, no lock-in needed to keep you." },
];

const WHY = [
  { t: "Reports in rupees", d: "Every report starts with leads, cost per lead and revenue. Reach and impressions are footnotes." },
  { t: "7-day launch", d: "Tracking, creatives and first campaigns are live within a week of signing. No month-long onboarding." },
  { t: "No lock-ins", d: "Month to month after the first 90 days. We keep clients by performing, not by contract." },
  { t: "You own everything", d: "Ad accounts, pixels, domains and dashboards stay in your name. Leave any time with all your data." },
];

const NAV = [
  { href: "#included", label: "Included" },
  { href: "#process", label: "Process" },
  { href: "#work", label: "Work" },
  { href: "#faq", label: "FAQ" },
];

/** Shared template for sub-service pages (and legacy /services/[slug] URLs). */
export default async function ServicePageTemplate({ s, category, path }: { s: SubService; category?: ServiceCategory; path: string }) {
  const icon = SERVICES.find((x) => x.slug === s.slug)?.icon || category?.icon || "Sparkles";
  const siblings = (category ? category.subs : []).filter((x) => x.slug !== s.slug).slice(0, 5);
  const others = siblings.length ? siblings : SERVICES.filter((x) => x.slug !== s.slug).slice(0, 4);
  const posts = (await getAllPosts()).filter((p) => p.content.toLowerCase().includes(s.name.split(" ")[0].toLowerCase())).slice(0, 3);
  const crumbs = [{ name: "Home", path: "" }, { name: "Services", path: "/services" }];
  if (category) crumbs.push({ name: category.name, path: `/services/${category.slug}` });
  crumbs.push({ name: s.name, path });
  const audience = (category && AUDIENCE[category.slug]) || DEFAULT_AUDIENCE;
  const work = workForService(s.slug);
  const lower = s.name.toLowerCase();

  return (
    <>
      <JsonLd data={[serviceJsonLd(s, path), faqJsonLd(s.faqs), breadcrumbJsonLd(crumbs)]} />

      {/* hero */}
      <section className="relative overflow-hidden mesh">
        <div className="absolute inset-0 dots opacity-70" />
        <div className="blob w-[26rem] h-[26rem] bg-brand -top-32 -right-20" />
        <div className="blob w-72 h-72 bg-sun left-[-6rem] bottom-[-4rem] opacity-25" style={{ animationDelay: "-6s" }} />
        <div className="container-x relative pt-14 md:pt-20 pb-14 grid lg:grid-cols-[1.15fr_.85fr] gap-10 lg:gap-14 items-center">
          <div>
            <nav className="text-xs text-muted mb-5 flex flex-wrap gap-1" aria-label="Breadcrumb">
              {crumbs.map((c, i) => (
                <span key={c.path}>
                  {i > 0 && <span className="mx-1">/</span>}
                  {i === crumbs.length - 1 ? <span className="text-fg">{c.name}</span> : <Link href={c.path || "/"} className="hover:text-fg">{c.name}</Link>}
                </span>
              ))}
            </nav>
            <span className="eyebrow"><ServiceIcon name={icon} size={12} /> {category ? category.name : "Service"} · Delhi NCR</span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">{s.headline}</h1>
            <p className="text-muted text-lg mt-6 leading-relaxed max-w-2xl">{s.description}</p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <a href="#quote" className="btn btn-primary">Get a free {s.name.split(" ")[0]} audit <ArrowRight size={18} /></a>
              <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
            </div>
            <ul className="flex flex-wrap gap-2.5 mt-8" aria-label="Why clients choose us">
              <li className="proof"><IndianRupee size={14} /> Reports in rupees</li>
              <li className="proof"><Rocket size={14} /> 7-day launch</li>
              <li className="proof"><Unlock size={14} /> No lock-ins</li>
            </ul>
          </div>
          <Reveal variant="zoom" className="relative">
            <TiltCard className="p-7 md:p-8 overflow-hidden" max={6}>
              <ServiceArt slug={s.slug} className="!w-32 !h-32 !opacity-15" />
              <p className="text-xs font-bold tracking-widest text-brand uppercase">What changes for you</p>
              <ul className="mt-4 grid gap-3">
                {s.benefits.map((b) => (
                  <li key={b} className="flex gap-3 items-start font-medium leading-snug">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-[#0b0b14] text-white grid place-items-center shrink-0"><Check size={13} /></span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-border flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">Free 30-minute strategy call</span>
                <Link href="/contact" className="font-bold text-brand inline-flex items-center gap-1">Book now <ArrowRight size={14} /></Link>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* sticky sub-nav (desktop) */}
      <div className="subnav hidden lg:block">
        <div className="container-x">
          <div className="glass rounded-full px-2 py-1.5 flex items-center gap-1 w-fit mx-auto">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
            <a href="#quote" className="is-cta">Get a quote</a>
          </div>
        </div>
      </div>

      {/* included */}
      <section id="included" className="container-x py-16 md:py-24 scroll-mt-28">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">What is included</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Everything in our {lower} plans</h2>
          <p className="text-muted mt-4 text-lg">Six deliverables, one owner, one dashboard. Nothing here is an add-on you discover on the invoice.</p>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mt-8 sm:mt-12">
          {s.deliverables.map((d, i) => (
            <Reveal key={d} delay={(i % 3) * 90}>
              <div className="card num-card p-6 h-full" data-num={`0${i + 1}`}>
                <span className="font-display text-sm font-bold text-brand tracking-widest">0{i + 1}</span>
                <h3 className="font-display text-xl font-bold mt-3 pr-12">{d}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* process */}
      <section id="process" className="section-tint relative overflow-hidden py-16 md:py-24 scroll-mt-28">
        <div className="absolute inset-0 dots opacity-50" />
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">How we do it</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">From audit to scale in four steps</h2>
            <p className="text-muted mt-4 text-lg">The same operating rhythm on every {lower} account, so you always know what happens next.</p>
          </Reveal>
          <ol className="timeline mt-12" style={{ "--steps": 4 } as React.CSSProperties}>
            {PROCESS.map((p, i) => (
              <li key={p.t} className="timeline-step">
                <span className="timeline-dot">{i + 1}</span>
                <Reveal delay={i * 90}>
                  <div className="card p-6 h-full">
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/10 text-brand"><p.icon size={20} /></span>
                      <span className="text-xs font-bold text-muted tracking-widest uppercase">{p.when}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold mt-4">{p.t}</h3>
                    <p className="text-sm text-muted mt-2 leading-relaxed">{p.d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* who this is for */}
      <section className="container-x py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Who this is for</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Built for businesses like yours</h2>
          <p className="text-muted mt-4 text-lg">We say no when {lower} is not the right first step. These are the situations where it is.</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {audience.map((a, i) => (
            <Reveal key={a.t} delay={i * 90}>
              <TiltCard className="p-7 h-full" max={6}>
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-[#0b0b14] text-white"><a.icon size={22} /></span>
                <h3 className="font-display text-xl font-bold mt-5">{a.t}</h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{a.d}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* why clicksemrus + stats band */}
      <section className="section-dark relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 dots" />
        <div className="blob w-[28rem] h-[28rem] bg-[#4f46e5] -left-40 -bottom-32" />
        <div className="container-x relative grid lg:grid-cols-2 gap-12 items-center">
          <Reveal variant="right">
            <span className="eyebrow">Why ClickSemrus</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">An agency judged on <span className="text-[#8b84ff]">your numbers</span>, not ours</h2>
            <p className="text-muted mt-5 text-lg leading-relaxed">We built the agency we wished we could hire when we ran marketing in-house: fast to launch, honest about what is working and judged on revenue.</p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { v: 7, s: "", l: "days from signing to live campaigns" },
                { v: 2, s: "h", l: "reply time on business days" },
                { v: 24, s: "h", l: "from trend to published creative" },
                { v: 30, s: " min", l: "free strategy call, no pitch deck" },
              ].map((x) => (
                <div key={x.l} className="glass rounded-2xl p-4">
                  <p className="font-display text-3xl md:text-4xl font-extrabold"><Counter to={x.v} suffix={x.s} /></p>
                  <p className="text-xs text-muted mt-1 leading-snug">{x.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <div className="grid gap-4">
            {WHY.map((w, i) => (
              <Reveal key={w.t} delay={i * 80}>
                <div className="glass rounded-2xl p-5 flex gap-4 items-start">
                  <span className="font-display text-2xl font-extrabold text-[#8b84ff] leading-none w-9 shrink-0">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{w.t}</h3>
                    <p className="text-muted mt-1 text-sm leading-relaxed">{w.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* related work */}
      <RelatedWork items={work} limit={3} title={`${s.name} work you can open right now`} sub="Live sites and stores we built or grow for Delhi NCR brands. Hover to scroll, tap for a full preview." />

      {/* faq + sidebar */}
      <section id="faq" className="section-tint py-16 md:py-24 scroll-mt-28">
        <div className="container-x grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <span className="eyebrow">FAQ</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-4">Questions about {lower}</h2>
            <div className="mt-8"><FAQ items={s.faqs} /></div>
          </div>
          <aside className="space-y-5">
            <div className="card p-6">
              <h3 className="font-bold">{category ? `More in ${category.name}` : "Pairs well with"}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {others.map((o) => (
                  <li key={o.slug}><Link href={serviceUrl(o.slug)} className="flex items-center gap-2 text-muted hover:text-fg"><ArrowRight size={14} className="text-brand" />{o.name}</Link></li>
                ))}
              </ul>
              {category && <Link href={`/services/${category.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-brand mt-4">All {category.name} services <ArrowRight size={14} /></Link>}
            </div>
            <div className="card p-6 bg-gradient-to-br from-brand/15 to-transparent">
              <h3 className="font-bold flex items-center gap-2"><MessageCircle size={16} className="text-brand" /> Talk to a strategist</h3>
              <p className="text-sm text-muted mt-2">Free 30-minute call. We will tell you honestly whether {lower} is the right first step for your business.</p>
              <Link href="/contact" className="btn btn-primary mt-4 w-full text-sm">Book a call</Link>
            </div>
          </aside>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="container-x py-16">
          <span className="eyebrow">Related reading</span>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold mt-4">Fresh angles on {lower}</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-8">{posts.map((p, i) => <BlogCard key={p.slug} post={p} i={i} />)}</div>
        </section>
      )}

      {/* lead form */}
      <section id="quote" className="relative overflow-hidden py-16 md:py-24 scroll-mt-28 mesh">
        <div className="container-x relative grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <span className="eyebrow">Free audit</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">See exactly where {lower} can grow your business</h2>
            <p className="text-muted mt-5 text-lg leading-relaxed">Within 48 hours you get a written review of your current setup, the gaps against your top competitors and a prioritised 90-day plan. No obligation.</p>
            <ul className="mt-8 grid gap-3">
              {["Honest view on whether this channel fits your goal", "Benchmarks for your category in Delhi NCR", "Quick wins you can ship this month", "A clear quote with no hidden add-ons"].map((x) => (
                <li key={x} className="flex gap-3 items-center font-medium"><span className="w-7 h-7 rounded-full bg-[#0b0b14] text-white grid place-items-center text-sm font-black">✓</span>{x}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={90}>
            <div className="card p-6 md:p-8 relative overflow-hidden !transform-none">
              <ServiceArt slug={s.slug} />
              <h3 className="font-display text-2xl font-bold">Request a free audit</h3>
              <p className="text-muted text-sm mt-1 mb-5">We reply within 2 business hours.</p>
              <LeadForm compact source={path} />
            </div>
          </Reveal>
        </div>
      </section>

      <CTA title={`Ready to grow with ${lower}?`} />
    </>
  );
}
