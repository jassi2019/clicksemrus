import Link from "next/link";
import { ArrowRight, Star, TrendingUp, Target, BarChart3, Zap, ShieldCheck, Flame } from "lucide-react";
import { SITE, SERVICES } from "@/lib/site";
import { pageMeta, faqJsonLd } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import { liveTrendPosts } from "@/lib/trending";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import BlogCard from "@/components/BlogCard";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export const metadata = pageMeta({
  title: `${SITE.name} | Digital Marketing Agency in Delhi NCR That Delivers ROI`,
  description: SITE.description,
  path: "",
  keywords: ["digital marketing agency delhi", "best digital marketing agency delhi ncr", "seo company delhi", "social media marketing gurugram", "performance marketing agency noida"],
});

const STATS = [
  { v: "3.2x", l: "Average ROAS on paid campaigns" },
  { v: "180%", l: "Average organic traffic growth in 6 months" },
  { v: "50+", l: "Brands scaled across India" },
  { v: "24h", l: "Trend-to-creative turnaround" },
];

const PROCESS = [
  { icon: Target, t: "Audit & Strategy", d: "We study your market, competitors and funnel, then build a 90-day growth plan with clear KPIs." },
  { icon: Zap, t: "Launch Fast", d: "Campaigns, content and tracking go live within 7 days. No month-long onboarding." },
  { icon: BarChart3, t: "Optimise Weekly", d: "Every week we cut what does not work and scale what does, with a live dashboard you can see anytime." },
  { icon: TrendingUp, t: "Scale Profitably", d: "Once cost per lead is proven, we scale budgets and channels to grow revenue, not just traffic." },
];

const TESTIMONIALS = [
  { n: "Rohit S.", r: "Founder, D2C skincare brand, Gurugram", q: "Our Meta Ads ROAS went from 1.4 to 3.8 in two months. The creative testing process is the real difference." },
  { n: "Dr. Neha K.", r: "Dental clinic, South Delhi", q: "We now get 60 to 80 calls a month from Google Maps alone. Local SEO done right." },
  { n: "Amit V.", r: "Real estate consultancy, Noida", q: "Transparent reporting and real leads. First agency that actually showed cost per site visit." },
];

const FAQS = [
  { q: "Which digital marketing services does ClickSemrus offer?", a: "SEO, social media marketing, Google Ads, Meta Ads, content marketing, web design and development, influencer marketing, WhatsApp and email marketing, and branding. Most clients combine two or three channels." },
  { q: "Do you work only with businesses in Delhi NCR?", a: "We are based in Delhi NCR and serve clients across India and abroad. Everything from strategy calls to reporting works remotely." },
  { q: "How soon can we see results?", a: "Paid ads generate leads within the first week. SEO typically shows measurable growth in 8 to 12 weeks and compounds after that." },
  { q: "What does it cost?", a: "Packages start at Rs 15,000 per month for single-channel services. See our pricing page for details or request a custom quote." },
  { q: "Is there a lock-in contract?", a: "No long lock-ins. We work month to month after an initial 3-month commitment for SEO, because that is how long it takes to prove results." },
];

export default async function Home() {
  const [posts, trends] = await Promise.all([getAllPosts(), liveTrendPosts("IN", 3)]);
  const latest = [...trends, ...posts].slice(0, 3);

  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="blob w-[28rem] h-[28rem] bg-brand -top-32 -left-32" />
        <div className="blob w-[24rem] h-[24rem] bg-brand-2 top-20 -right-24" style={{ animationDelay: "-5s" }} />
        <div className="blob w-72 h-72 bg-accent bottom-0 left-1/3" style={{ animationDelay: "-9s" }} />
        <div className="container-x relative pt-16 pb-20 md:pt-28 md:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow">Digital Marketing Agency, Delhi NCR</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] mt-4">
              We turn <span className="gradient-text">clicks</span> into customers.
            </h1>
            <p className="text-muted text-lg mt-6 max-w-xl leading-relaxed">
              SEO, social media, Google and Meta Ads, content and websites, engineered around one metric: revenue. Full transparency, weekly optimisation, no vanity reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/contact" className="btn btn-primary">Get a Free Growth Audit <ArrowRight size={18} /></Link>
              <Link href="/case-studies" className="btn btn-ghost">See Results</Link>
            </div>
            <div className="flex items-center gap-4 mt-8 text-sm text-muted">
              <div className="flex -space-x-2">
                {["R", "N", "A", "P", "S"].map((c, i) => (
                  <span key={i} className="w-8 h-8 rounded-full border-2 border-bg bg-gradient-to-br from-brand to-brand-2 grid place-items-center text-xs font-bold text-white">{c}</span>
                ))}
              </div>
              <div>
                <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                <p>Rated 4.9/5 by 50+ growing brands</p>
              </div>
            </div>
          </div>
          <Reveal className="relative">
            <div className="card p-6 md:p-8 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Live growth snapshot</p>
                <span className="badge bg-lime/20 text-lime">Last 90 days</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {STATS.map((s) => (
                  <div key={s.l} className="rounded-xl bg-surface-2 border border-border p-4">
                    <p className="font-display text-3xl font-bold gradient-text">{s.v}</p>
                    <p className="text-xs text-muted mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
              <svg viewBox="0 0 400 120" className="w-full mt-6" aria-hidden="true">
                <defs>
                  <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#7c5cff" stopOpacity=".6" />
                    <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 100 C40 95 60 80 100 78 S160 70 200 55 S260 40 300 30 S360 15 400 8 V120 H0 Z" fill="url(#g)" />
                <path d="M0 100 C40 95 60 80 100 78 S160 70 200 55 S260 40 300 30 S360 15 400 8" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
              </svg>
              <p className="text-xs text-muted mt-2">Representative client performance. Your numbers will depend on industry and budget.</p>
            </div>
          </Reveal>
        </div>
        {/* marquee */}
        <div className="border-y border-border bg-bg-2/60 py-4 overflow-hidden">
          <div className="marquee text-sm font-semibold text-muted uppercase tracking-widest">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex gap-12">
                {["SEO", "Social Media", "Google Ads", "Meta Ads", "Content", "Web Design", "Influencers", "WhatsApp Marketing", "Branding", "Moment Marketing"].map((t) => (
                  <span key={t} className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-brand-2" />{t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-x py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">What we do</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Every channel. One goal: growth.</h2>
          <p className="text-muted mt-4">Pick one service or let us run the full funnel. Every plan includes tracking, a live dashboard and a dedicated growth manager.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={i * 60}>
              <Link href={`/services/${s.slug}`} className="card p-6 block h-full group">
                <span className="inline-grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand/30 to-brand-2/20 border border-border text-brand-2 group-hover:scale-110 transition">
                  <ServiceIcon name={s.icon} />
                </span>
                <h3 className="font-display text-xl font-bold mt-5">{s.name}</h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{s.short}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-2 mt-4 group-hover:gap-2 transition-all">Learn more <ArrowRight size={14} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="bg-bg-2 border-y border-border py-24">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="eyebrow">Why ClickSemrus</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Marketing that reports in rupees, not likes.</h2>
            <p className="text-muted mt-4 leading-relaxed">Most agencies send you a PDF of impressions. We give you a live dashboard of leads, cost per lead and revenue, plus a weekly call about what we changed and why.</p>
            <ul className="mt-8 space-y-4">
              {[
                ["Conversion tracking on day one", "GA4, Google Tag Manager, pixel and CAPI configured before a rupee is spent."],
                ["Creative that tests, not guesses", "We ship 8 to 12 new creatives a month and let the data pick winners."],
                ["Trend-ready content team", "Our daily trend engine spots what India is talking about so your brand is first to post."],
                ["No lock-ins, no surprises", "Month-to-month after an initial sprint, with transparent pricing."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <ShieldCheck className="text-lime shrink-0 mt-0.5" size={20} />
                  <div><p className="font-semibold">{t}</p><p className="text-muted text-sm">{d}</p></div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-4">
              {PROCESS.map((p, i) => (
                <div key={p.t} className="card p-5 flex gap-4 items-start">
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand/20 text-brand-2 shrink-0"><p.icon size={20} /></span>
                  <div>
                    <p className="text-xs text-muted">Step {i + 1}</p>
                    <h3 className="font-bold">{p.t}</h3>
                    <p className="text-sm text-muted mt-1">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x py-24">
        <Reveal className="text-center max-w-2xl mx-auto">
          <p className="eyebrow justify-center">Client love</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Results our clients talk about</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.n} delay={i * 80}>
              <figure className="card p-6 h-full flex flex-col">
                <div className="flex text-yellow-400 mb-3">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                <blockquote className="text-fg leading-relaxed flex-1">“{t.q}”</blockquote>
                <figcaption className="mt-5 text-sm"><p className="font-semibold">{t.n}</p><p className="text-muted">{t.r}</p></figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BLOG */}
      <section className="container-x py-12">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <Reveal>
            <p className="eyebrow"><Flame size={14} /> Trending today in India</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">Fresh marketing angles on what India is searching</h2>
          </Reveal>
          <Link href="/blog" className="btn btn-ghost text-sm">All articles <ArrowRight size={16} /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {latest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}><BlogCard post={p} i={i} /></Reveal>
          ))}
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="audit" className="container-x py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <Reveal>
            <p className="eyebrow">Free growth audit</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Find out exactly where you are losing customers.</h2>
            <p className="text-muted mt-4 leading-relaxed">Within 48 hours you will get a written audit of your website, SEO, social and ads, with a prioritised 90-day plan. Worth Rs 10,000. Free for Delhi NCR businesses this month.</p>
            <ul className="mt-6 grid gap-2 text-sm">
              {["Website conversion and speed review", "Keyword gaps vs your top 3 competitors", "Ad account waste analysis", "Social content scorecard"].map((x) => (
                <li key={x} className="flex gap-2 items-center"><span className="w-5 h-5 rounded-full bg-lime/20 text-lime grid place-items-center text-xs">✓</span>{x}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}><div className="card p-6 md:p-8"><LeadForm source="/#audit" /></div></Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-12 max-w-3xl">
        <Reveal className="text-center">
          <p className="eyebrow justify-center">FAQs</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">Questions we hear every week</h2>
        </Reveal>
        <div className="mt-8"><FAQ items={FAQS} /></div>
      </section>

      <CTA />
    </>
  );
}
