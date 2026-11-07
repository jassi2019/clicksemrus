import { Fragment } from "react";
import Link from "next/link";
import { Check, Minus, ArrowRight, Megaphone, MapPin, Layers, Clock, Wrench } from "lucide-react";
import { SITE, WORK } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import RelatedWork from "@/components/RelatedWork";

export const metadata = pageMeta({
  title: "Digital Marketing Packages & Pricing in Delhi NCR",
  description: `Transparent digital marketing pricing from ${SITE.name}: SEO, social media, Google Ads and Meta Ads packages for startups, growing businesses and enterprises in Delhi NCR.`,
  path: "/pricing",
  keywords: ["digital marketing packages delhi", "seo packages india", "social media marketing pricing", "ppc management fees"],
});

const PLANS = [
  {
    name: "Starter",
    price: "15,000",
    tag: "Single channel",
    desc: "For small businesses starting with one channel: SEO, social media or ads.",
    features: ["1 channel (SEO, Social or Ads)", "12 posts or 8 keywords or 1 ad campaign", "GA4 & conversion tracking setup", "Monthly report & call", "WhatsApp support"],
    cta: "Start small",
  },
  {
    name: "Growth",
    price: "40,000",
    tag: "Most popular",
    desc: "For businesses that want leads now and organic growth for later.",
    features: ["2 channels (e.g. Google Ads + SEO)", "20 posts + 4 reels per month", "Up to 3 ad campaigns with creatives", "Landing page CRO", "Live dashboard + weekly optimisation", "Dedicated growth manager"],
    cta: "Grow faster",
    featured: true,
  },
  {
    name: "Scale",
    price: "90,000",
    tag: "Full funnel",
    desc: "The complete team: SEO, social, paid, content, email/WhatsApp and creative.",
    features: ["All channels", "Daily content + trend creatives in 24h", "Unlimited ad campaigns", "Influencer & WhatsApp automation", "Quarterly brand & website refresh", "Weekly strategy call"],
    cta: "Scale the brand",
  },
];

type Cell = boolean | string;
const COMPARE: { group: string; rows: { f: string; v: [Cell, Cell, Cell] }[] }[] = [
  {
    group: "Channels",
    rows: [
      { f: "Channels included", v: ["1", "2", "All"] },
      { f: "SEO keywords tracked", v: ["8", "25", "60+"] },
      { f: "Social posts per month", v: ["12", "20 + 4 reels", "Daily + reels"] },
      { f: "Ad campaigns managed", v: ["1", "Up to 3", "Unlimited"] },
      { f: "Ad creatives (statics / video)", v: [false, "8 / 2 per month", "Weekly batches"] },
    ],
  },
  {
    group: "Tracking and reporting",
    rows: [
      { f: "GA4, GTM and conversion tracking", v: [true, true, true] },
      { f: "Live dashboard (leads, CPL, revenue)", v: [false, true, true] },
      { f: "Call and WhatsApp attribution", v: [false, true, true] },
      { f: "Reporting cadence", v: ["Monthly", "Weekly note + monthly call", "Weekly call"] },
    ],
  },
  {
    group: "Team and support",
    rows: [
      { f: "Dedicated growth manager", v: [false, true, true] },
      { f: "Landing page CRO", v: [false, true, true] },
      { f: "Influencer and WhatsApp automation", v: [false, false, true] },
      { f: "Quarterly brand and website refresh", v: [false, false, true] },
      { f: "Support", v: ["WhatsApp, business hours", "WhatsApp + email, same day", "Priority, named team"] },
    ],
  },
];

const ADDONS = [
  { t: "Landing page", p: "from Rs 15,000", d: "One message, one action, live in 5 to 7 working days." },
  { t: "Reel shoot day", p: "from Rs 12,000", d: "On-location in Delhi NCR, 8 to 12 reels edited with captions." },
  { t: "Extra ad campaign", p: "from Rs 5,000 / month", d: "Any platform, with creatives and weekly optimisation." },
  { t: "Google Business Profile for an extra location", p: "from Rs 4,000 / month", d: "Setup, posts, reviews and Maps reporting per branch." },
  { t: "WhatsApp Business API setup", p: "from Rs 10,000", d: "Verification, templates, first automation flow and CRM link." },
  { t: "Website or Shopify build", p: "quoted per project", d: "Business sites from 3 weeks, e-commerce from 6 weeks." },
];

const FACTORS = [
  { icon: Megaphone, t: "Channels and ad spend", d: "Fees cover management; ad spend goes to Google or Meta from your own account. Larger spends need more testing and more creative, so management scales with it." },
  { icon: MapPin, t: "Locations and languages", d: "A clinic with three branches or a brand in Hindi and English needs more pages, profiles and creatives than a single-location business." },
  { icon: Layers, t: "Competition in your category", d: "Dental, real estate and coaching in Delhi NCR are crowded. Ranking or winning auctions there takes more content, links and creative than a niche B2B category." },
  { icon: Clock, t: "Speed and volume", d: "Daily posting, same-day trend creatives and weekly calls need more hands than a monthly cadence. You choose the pace." },
  { icon: Wrench, t: "State of your current setup", d: "Broken tracking, a slow website or a penalised account adds a few weeks of cleanup before growth work starts. The audit tells you upfront." },
];

const FAQS = [
  { q: "Are ad budgets included in the price?", a: "No. The prices are agency fees. Ad spend is paid directly to Google or Meta from your own account, so you always own your data." },
  { q: "Is GST extra?", a: "Yes, 18% GST applies on all packages." },
  { q: "Can I customise a package?", a: "Absolutely. Most clients end up with a custom mix. Tell us your goal and budget on the contact page." },
  { q: "What is the minimum commitment?", a: "3 months for SEO-inclusive plans because that is the time it takes to prove results. Ads-only and social plans are month to month." },
  { q: "Can I upgrade or downgrade mid-way?", a: "Yes, from the next billing month. Many clients start on Starter for one channel and move to Growth once cost per lead is proven." },
  { q: "How and when do I pay?", a: "Monthly in advance by bank transfer or UPI against a GST invoice. Project work such as websites is 50% to start and 50% on launch." },
  { q: "Do you offer one-time audits without a retainer?", a: "Yes. The SEO audit and roadmap is a paid one-time engagement you can execute in-house or with any agency." },
];

function CellValue({ v, featured }: { v: Cell; featured?: boolean }) {
  if (v === true) return <span className={`inline-grid place-items-center w-7 h-7 rounded-full ${featured ? "bg-brand text-white" : "bg-lime/15 text-lime"}`}><Check size={15} /></span>;
  if (v === false) return <span className="inline-grid place-items-center w-7 h-7 rounded-full bg-surface-2 text-muted"><Minus size={14} /></span>;
  return <span className="text-sm font-semibold">{v}</span>;
}

export default function Pricing() {
  return (
    <>
      <JsonLd data={[faqJsonLd(FAQS), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Pricing", path: "/pricing" }])]} />

      {/* hero */}
      <section className="relative overflow-hidden mesh">
        <div className="absolute inset-0 dots opacity-70" />
        <div className="blob w-[26rem] h-[26rem] bg-brand -top-32 -right-20" />
        <div className="container-x relative pt-14 md:pt-20 pb-6 text-center max-w-3xl">
          <Reveal>
            <p className="eyebrow justify-center">Pricing</p>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">Transparent packages. <span className="gradient-text">No hidden fees.</span></h1>
            <p className="text-muted text-lg mt-6">Pick a plan or ask for a custom quote. Every plan includes tracking, reporting and a real human who answers your WhatsApp.</p>
          </Reveal>
        </div>
        <div className="container-x relative grid md:grid-cols-3 gap-5 pt-10 pb-14 items-stretch">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div className={`card p-7 h-full flex flex-col ${p.featured ? "border-brand/60 bg-gradient-to-b from-brand/15 to-transparent" : ""}`}>
                <span className={`badge w-fit ${p.featured ? "bg-brand text-white" : "bg-surface-2 text-muted"}`}>{p.tag}</span>
                <h2 className="font-display text-2xl font-bold mt-4">{p.name}</h2>
                <p className="text-muted text-sm mt-1">{p.desc}</p>
                <p className="mt-5"><span className="text-sm text-muted">From </span><span className="font-display text-4xl font-bold">₹{p.price}</span><span className="text-muted text-sm">/month</span></p>
                <ul className="mt-6 space-y-2 text-sm flex-1">
                  {p.features.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="text-lime shrink-0 mt-0.5" />{f}</li>)}
                </ul>
                <Link href={`/contact?plan=${p.name}`} className={`btn mt-7 ${p.featured ? "btn-primary" : "btn-ghost"}`}>{p.cta} <ArrowRight size={16} /></Link>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="container-x relative text-center text-xs text-muted pb-10">Prices exclude GST and ad spend. Website design and branding are quoted per project.</p>
      </section>

      {/* comparison table */}
      <section className="container-x py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Compare plans</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">What is in each plan, line by line</h2>
          <p className="text-muted mt-4 text-lg">Scroll sideways on a phone. Anything not listed here is quoted as an add-on below, never slipped onto the invoice.</p>
        </Reveal>
        <Reveal delay={90} className="mt-10">
          <div className="card !transform-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="cmp min-w-[640px]">
                <thead>
                  <tr>
                    <th scope="col" className="w-[40%]">Feature</th>
                    {PLANS.map((p) => <th key={p.name} scope="col" className={p.featured ? "is-featured" : ""}>{p.name}<span className="block text-[11px] font-semibold text-muted">from ₹{p.price}/mo</span></th>)}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((g) => (
                    <Fragment key={g.group}>
                      <tr><td colSpan={4} className="!bg-surface-2/60 text-[11px] font-bold tracking-widest uppercase text-muted !py-2">{g.group}</td></tr>
                      {g.rows.map((r) => (
                        <tr key={r.f}>
                          <td className="font-medium">{r.f}</td>
                          {r.v.map((v, i) => <td key={i} className={PLANS[i].featured ? "is-featured" : ""}><CellValue v={v} featured={PLANS[i].featured} /></td>)}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                  <tr>
                    <td className="font-medium">Add-ons</td>
                    <td colSpan={3} className="!text-left text-sm text-muted">Any item below can be added to any plan. <a href="#addons" className="text-brand font-semibold">See add-ons</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      {/* add-ons */}
      <section id="addons" className="section-tint relative overflow-hidden py-16 md:py-24 scroll-mt-28">
        <div className="absolute inset-0 dots opacity-50" />
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">Add-ons</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Bolt on only what you need</h2>
            <p className="text-muted mt-4 text-lg">Indicative starting prices. Final quotes depend on scope and are confirmed in writing before any work starts.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {ADDONS.map((a, i) => (
              <Reveal key={a.t} delay={(i % 3) * 80}>
                <div className="card num-card p-6 h-full" data-num={`0${i + 1}`}>
                  <h3 className="font-display text-lg font-bold pr-10">{a.t}</h3>
                  <p className="text-brand font-bold mt-1">{a.p}</p>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{a.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* what affects your price */}
      <section className="container-x py-16 md:py-24">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          <Reveal variant="right">
            <span className="eyebrow">What affects your price</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Why two businesses on the same plan can pay differently</h2>
            <p className="text-muted mt-4 text-lg leading-relaxed">Packages are starting points. On the free call we scope the real work and give you one number, in writing, before you commit to anything.</p>
            <Link href="/contact" className="btn btn-primary mt-8">Get a written quote <ArrowRight size={18} /></Link>
          </Reveal>
          <div className="grid gap-4">
            {FACTORS.map((f, i) => (
              <Reveal key={f.t} delay={i * 70}>
                <div className="card p-5 flex gap-4 items-start">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand/10 text-brand shrink-0"><f.icon size={20} /></span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{f.t}</h3>
                    <p className="text-sm text-muted mt-1 leading-relaxed">{f.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* faq */}
      <section className="section-tint py-16 md:py-24">
        <div className="container-x max-w-3xl">
          <Reveal className="text-center">
            <span className="eyebrow">Pricing FAQs</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4">Questions about pricing</h2>
          </Reveal>
          <div className="mt-10"><FAQ items={FAQS} /></div>
        </div>
      </section>

      <RelatedWork items={WORK} limit={3} title="What these plans built" sub="Live sites, stores and campaigns delivered under Starter, Growth and project engagements. Open any of them." />

      <CTA title="Need a custom quote?" sub="Share your goals and budget. You will get a proposal within 24 hours." />
    </>
  );
}
