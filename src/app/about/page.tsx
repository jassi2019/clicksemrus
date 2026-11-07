import Link from "next/link";
import { ArrowRight, IndianRupee, Zap, Eye, Palette, MessageCircle, FileText, Users, Lock } from "lucide-react";
import { SITE, WORK, INDUSTRIES } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import Counter from "@/components/Counter";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import RelatedWork from "@/components/RelatedWork";
import InstagramIcon from "@/components/InstagramIcon";

export const metadata = pageMeta({
  title: `About ${SITE.name} | Digital Marketing Agency in Delhi NCR`,
  description: `${SITE.name} is a Delhi NCR digital marketing agency built by performance marketers. Learn our story, values and how we work with brands across India.`,
  path: "/about",
});

const VALUES = [
  { icon: IndianRupee, t: "Revenue first", d: "Every report starts with leads, cost per lead and sales. Impressions, reach and follower counts are footnotes, never the headline." },
  { icon: Zap, t: "Speed", d: "Campaigns live in 7 days. Trend creatives in 24 hours. Replies within 2 business hours. Slow agencies cost clients money." },
  { icon: Eye, t: "Radical transparency", d: "You own the ad accounts, pixels and dashboards. You see the invoices from Google and Meta. There is no black box." },
  { icon: Palette, t: "Craft", d: "Design, copy and code we would be proud of even without the numbers. The numbers tend to follow." },
];

const HOW = [
  { when: "Day 0", t: "Free strategy call", d: "Thirty minutes, no pitch deck. We look at your site, Google presence and ad accounts and tell you honestly where the fastest payback is." },
  { when: "Day 1 to 7", t: "Audit and launch", d: "Tracking first, then the work. Campaigns, content or fixes are live within the week and you can see data in the dashboard." },
  { when: "Every week", t: "Short written update", d: "What we changed, why, and what it did to cost per lead. Five minutes to read, no 40-slide deck." },
  { when: "Every month", t: "Strategy call", d: "Results against the plan, what we are testing next and where the budget should move. You decide, with data." },
];

const PRINCIPLES = [
  { icon: MessageCircle, t: "One named growth manager", d: "You message one person who knows your account, not a ticket queue." },
  { icon: FileText, t: "Plain-language proposals", d: "Scope, price and timeline on one page. If we cannot explain it simply, we do not sell it." },
  { icon: Users, t: "Senior people on the work", d: "We take a limited number of new clients each month so the people on the call are the people doing the work." },
  { icon: Lock, t: "Your data stays yours", d: "Accounts, domains and dashboards are created in your name. Leave any time with everything intact." },
];

export default function About() {
  const industries = Array.from(new Set(WORK.map((w) => w.industry)));
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "About", path: "/about" }])} />

      {/* hero */}
      <section className="relative overflow-hidden mesh">
        <div className="absolute inset-0 dots opacity-70" />
        <div className="blob w-[26rem] h-[26rem] bg-brand -top-32 -right-20" />
        <div className="container-x relative pt-14 md:pt-20 pb-14">
          <Reveal className="max-w-3xl">
            <span className="eyebrow">About us</span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">A growth team, <span className="gradient-text">not a vendor.</span></h1>
            <p className="text-muted text-lg mt-6 leading-relaxed">{SITE.name} is a digital marketing agency in Delhi NCR that runs SEO, social media, paid ads, content, web development and automation for brands across India. We are judged on leads and revenue, and we report that way.</p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <Link href="/contact" className="btn btn-primary">Book a free call <ArrowRight size={18} /></Link>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><InstagramIcon size={16} /> Follow our work</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* story */}
      <section className="container-x py-16 md:py-24 grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
        <Reveal variant="right">
          <span className="eyebrow">Our story</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Why we started {SITE.name}</h2>
        </Reveal>
        <Reveal delay={90}>
          <div className="prose">
            <p>Before {SITE.name}, we sat on the client side of agency meetings in Delhi and Gurugram. Every month a beautiful PDF arrived: impressions up, reach up, engagement up. Every month the cost per lead quietly went up too, and nobody on the agency side could say which campaign had brought the last ten customers.</p>
            <p>So in {SITE.foundingYear} we built the agency we wished we could have hired. One where tracking goes live before the first rupee is spent. One where the weekly update is a short note about what changed and what it did to cost per lead. One that launches in a week instead of spending a month on onboarding decks, and that keeps clients by performing rather than by contract.</p>
            <p>Today we work with clinics in South Delhi and Faridabad, D2C brands shipping across India, a NEET-prep app, a clean-beauty label and businesses across {INDUSTRIES.length} industries. The work is different every time; the rules are the same: own the numbers, move fast, tell the truth.</p>
          </div>
        </Reveal>
      </section>

      {/* values */}
      <section className="section-tint relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 dots opacity-50" />
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">Values</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Four rules we do not break</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 80}>
                <div className="card num-card p-6 h-full" data-num={`0${i + 1}`}>
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#0b0b14] text-white"><v.icon size={20} /></span>
                  <h3 className="font-display text-xl font-bold mt-5">{v.t}</h3>
                  <p className="text-muted text-sm mt-2 leading-relaxed">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* how we work with you */}
      <section className="container-x py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">How we work with you</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">What working with us actually feels like</h2>
          <p className="text-muted mt-4 text-lg">The same rhythm on every account, from a single-channel Starter plan to a full-funnel retainer.</p>
        </Reveal>
        <ol className="timeline mt-12" style={{ "--steps": 4 } as React.CSSProperties}>
          {HOW.map((h, i) => (
            <li key={h.t} className="timeline-step">
              <span className="timeline-dot">{i + 1}</span>
              <Reveal delay={i * 90}>
                <div className="card p-6 h-full">
                  <p className="text-xs font-bold text-muted tracking-widest uppercase">{h.when}</p>
                  <h3 className="font-display text-xl font-bold mt-2">{h.t}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{h.d}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* principles + stats band */}
      <section className="section-dark relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 dots" />
        <div className="blob w-[28rem] h-[28rem] bg-[#4f46e5] -right-40 -top-20" />
        <div className="container-x relative grid lg:grid-cols-2 gap-12 items-center">
          <Reveal variant="right">
            <span className="eyebrow">Team principles</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Small team, <span className="text-[#8b84ff]">senior hands</span></h2>
            <p className="text-muted mt-5 text-lg leading-relaxed">Strategists who have run budgets in-house, creators who ship daily, and certified Google and Meta specialists, technical SEOs and developers. Everyone on your account can explain every number in your report.</p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { v: 7, s: "", l: "days from signing to live campaigns" },
                { v: 2, s: "h", l: "reply time on business days" },
                { v: 24, s: "h", l: "from trend to published creative" },
                { v: WORK.length, s: "", l: "live projects you can open on this site" },
              ].map((x) => (
                <div key={x.l} className="glass rounded-2xl p-4">
                  <p className="font-display text-3xl md:text-4xl font-extrabold"><Counter to={x.v} suffix={x.s} /></p>
                  <p className="text-xs text-muted mt-1 leading-snug">{x.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={i * 80}>
                <TiltCard className="p-6 h-full glass" max={6}>
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-white text-[#0b0b14]"><p.icon size={20} /></span>
                  <h3 className="font-display text-lg font-bold mt-4">{p.t}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{p.d}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <RelatedWork items={WORK} limit={3} title="Brands we have grown" sub={`Live projects across ${industries.join(", ").toLowerCase()}. Open any of them to see the work.`} />

      <section className="container-x pb-8 max-w-3xl">
        <p className="text-muted">We take on a limited number of new clients each month so every account gets senior attention. <Link href="/contact" className="text-brand font-semibold underline underline-offset-2">Start with a free audit</Link> or explore our <Link href="/services" className="text-brand font-semibold underline underline-offset-2">services</Link>.</p>
      </section>

      <CTA />
    </>
  );
}
