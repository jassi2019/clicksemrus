import Link from "next/link";
import { ArrowRight, Star, Zap, Target, BarChart3, TrendingUp, Flame, Sparkles, Play } from "lucide-react";
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
import Hero3DLoader from "@/components/Hero3DLoader";
import TiltCard from "@/components/TiltCard";
import Counter from "@/components/Counter";
import { Sphere, Ring, Pill, Cube } from "@/components/Shapes";

export const revalidate = 3600;

export const metadata = pageMeta({
  title: `${SITE.name} | Digital Marketing Agency in Delhi NCR That Delivers ROI`,
  description: SITE.description,
  path: "",
  keywords: ["digital marketing agency delhi", "best digital marketing agency delhi ncr", "seo company delhi", "social media marketing gurugram", "performance marketing agency noida"],
});

const PROCESS = [
  { icon: Target, t: "Audit & Strategy", d: "We study your market, competitors and funnel, then build a 90-day growth plan with clear KPIs.", c: "from-[#ff3cac] to-[#ff7a59]" },
  { icon: Zap, t: "Launch in 7 days", d: "Campaigns, content and tracking go live within a week. No month-long onboarding.", c: "from-[#ffb13b] to-[#ff3cac]" },
  { icon: BarChart3, t: "Optimise weekly", d: "Every week we cut what does not work and scale what does, with a live dashboard you can open anytime.", c: "from-[#2bd2ff] to-[#7a3cff]" },
  { icon: TrendingUp, t: "Scale profitably", d: "Once cost per lead is proven, we scale budgets and channels to grow revenue, not just traffic.", c: "from-[#4dff9e] to-[#2bd2ff]" },
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

const SERVICE_COLORS = ["from-[#ff3cac] to-[#7a3cff]", "from-[#2bd2ff] to-[#7a3cff]", "from-[#ffb13b] to-[#ff3cac]", "from-[#4dff9e] to-[#2bd2ff]", "from-[#7a3cff] to-[#2bd2ff]", "from-[#ff7a59] to-[#ffb13b]", "from-[#ff3cac] to-[#ffb13b]", "from-[#2bd2ff] to-[#4dff9e]", "from-[#7a3cff] to-[#ff3cac]"];

export default async function Home() {
  const [posts, trends] = await Promise.all([getAllPosts(), liveTrendPosts("IN", 3)]);
  const latest = [...trends, ...posts].slice(0, 3);

  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden mesh noise min-h-[92vh] flex items-center">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 lg:left-[42%]"><Hero3DLoader /></div>
        <div className="container-x relative py-20 md:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative z-10">
            <span className="eyebrow"><Sparkles size={12} /> Digital Marketing Agency · Delhi NCR</span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-[5.6rem] font-extrabold leading-[0.98] mt-6">
              Make your brand
              <br />
              <span className="gradient-text">impossible</span>
              <br />
              <span className="outline-text">to ignore.</span>
            </h1>
            <p className="text-muted text-lg md:text-xl mt-7 max-w-xl leading-relaxed">
              SEO, social media, Google &amp; Meta Ads, content and websites, engineered around one metric: revenue. Weekly optimisation, live dashboards, zero vanity reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-9">
              <Link href="/contact" className="btn btn-primary text-base !px-7 !py-4">Get a Free Growth Audit <ArrowRight size={18} /></Link>
              <Link href="/case-studies" className="btn btn-ghost text-base !px-7 !py-4"><Play size={16} /> See Results</Link>
            </div>
            <div className="flex items-center gap-4 mt-9">
              <div className="flex -space-x-3">
                {["#ff3cac", "#7a3cff", "#2bd2ff", "#ffb13b", "#4dff9e"].map((c, i) => (
                  <span key={i} className="w-10 h-10 rounded-full border-2 border-[#07041a] grid place-items-center text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, ${c}, #7a3cff)` }}>{"RNAPS"[i]}</span>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-sun">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                <p className="text-muted">Rated 4.9/5 by 50+ growing brands</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block h-[560px]" />
        </div>
        {/* floating stat chips */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="glass absolute right-[8%] top-[22%] rounded-2xl px-4 py-3 shape" style={{ animationDelay: "-2s" }}>
            <p className="text-xs text-muted">Avg ROAS</p><p className="font-display text-2xl font-extrabold text-lime">3.2x</p>
          </div>
          <div className="glass absolute right-[30%] bottom-[18%] rounded-2xl px-4 py-3 shape" style={{ animationDelay: "-5s" }}>
            <p className="text-xs text-muted">Organic growth</p><p className="font-display text-2xl font-extrabold text-brand-2">+180%</p>
          </div>
          <div className="glass absolute right-[6%] bottom-[30%] rounded-2xl px-4 py-3 shape" style={{ animationDelay: "-8s" }}>
            <p className="text-xs text-muted">Trend creatives</p><p className="font-display text-2xl font-extrabold text-accent">24h</p>
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="relative -mt-6 rotate-[-1.5deg] scale-[1.03] z-20">
        <div className="bg-gradient-to-r from-[#ff3cac] via-[#7a3cff] to-[#2bd2ff] py-4 overflow-hidden shadow-[0_20px_60px_-20px_rgba(122,60,255,.8)]">
          <div className="marquee text-sm font-extrabold text-white uppercase tracking-[.2em]">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex gap-12">
                {["SEO", "Social Media", "Google Ads", "Meta Ads", "Content", "Web Design", "Influencers", "WhatsApp Marketing", "Branding", "Moment Marketing"].map((t) => (
                  <span key={t} className="flex items-center gap-4"><Sparkles size={14} />{t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= STATS (light) ================= */}
      <section className="section-light relative overflow-hidden pt-28 pb-20">
        <Sphere className="w-40 h-40 -left-10 top-10" c1="#2bd2ff" c2="#7a3cff" />
        <Ring className="w-44 h-44 right-[-30px] top-24" delay={-3} />
        <Cube className="left-[12%] bottom-6" size={56} />
        <div className="container-x relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { v: 3.2, s: "x", d: 1, l: "Average ROAS on paid campaigns" },
            { v: 180, s: "%", d: 0, l: "Average organic traffic growth in 6 months" },
            { v: 50, s: "+", d: 0, l: "Brands scaled across India" },
            { v: 24, s: "h", d: 0, l: "Trend-to-creative turnaround" },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 80}>
              <TiltCard className="p-7 bg-white">
                <p className="font-display text-5xl font-extrabold gradient-text"><Counter to={s.v} suffix={s.s} decimals={s.d} /></p>
                <p className="text-muted mt-2 text-sm font-medium">{s.l}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <p className="container-x relative text-xs text-muted mt-6">Representative client performance. Your numbers depend on industry and budget.</p>
      </section>

      {/* ================= SERVICES (light) ================= */}
      <section className="section-light relative overflow-hidden pb-28">
        <Pill className="w-56 h-20 right-[-40px] top-10 rotate-[-25deg]" delay={-4} />
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">What we do</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold mt-5">Every channel.<br />One goal: <span className="gradient-text">growth.</span></h2>
            <p className="text-muted mt-5 text-lg">Pick one service or let us run the full funnel. Every plan includes tracking, a live dashboard and a dedicated growth manager.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60}>
                <Link href={`/services/${s.slug}`} className="block h-full group">
                  <TiltCard className="p-7 h-full bg-white">
                    <span className={`inline-grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br ${SERVICE_COLORS[i % SERVICE_COLORS.length]} text-white shadow-[0_14px_30px_-10px_rgba(122,60,255,.7)] group-hover:scale-110 transition`}>
                      <ServiceIcon name={s.icon} size={24} />
                    </span>
                    <h3 className="font-display text-2xl font-bold mt-6">{s.name}</h3>
                    <p className="text-muted mt-2 leading-relaxed">{s.short}</p>
                    <span className="inline-flex items-center gap-1 font-bold text-brand mt-5 group-hover:gap-3 transition-all">Explore <ArrowRight size={16} /></span>
                  </TiltCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESS (dark) ================= */}
      <section className="relative overflow-hidden py-28 mesh noise">
        <Sphere className="w-64 h-64 right-[-60px] top-[-40px] opacity-80" c1="#ffb13b" c2="#ff3cac" delay={-2} />
        <Sphere className="w-24 h-24 left-[6%] bottom-[12%]" c1="#4dff9e" c2="#2bd2ff" delay={-6} />
        <div className="container-x relative grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <span className="eyebrow">Why ClickSemrus</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">Marketing that reports in <span className="gradient-text">rupees</span>, not likes.</h2>
            <p className="text-muted mt-6 text-lg leading-relaxed">Most agencies send a PDF of impressions. We give you a live dashboard of leads, cost per lead and revenue, plus a weekly call about what we changed and why.</p>
            <Link href="/contact" className="btn btn-accent mt-8">Book a free strategy call <ArrowRight size={18} /></Link>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {PROCESS.map((p, i) => (
              <Reveal key={p.t} delay={i * 90}>
                <TiltCard className="p-6 h-full">
                  <span className={`grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br ${p.c} text-white shadow-lg`}><p.icon size={22} /></span>
                  <p className="text-xs text-muted mt-5 font-bold tracking-widest">STEP 0{i + 1}</p>
                  <h3 className="font-display text-xl font-bold mt-1">{p.t}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{p.d}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS (light) ================= */}
      <section className="section-light relative overflow-hidden py-28">
        <Ring className="w-32 h-32 left-[4%] top-10" delay={-1} />
        <Sphere className="w-28 h-28 right-[8%] bottom-10" c1="#7a3cff" c2="#2bd2ff" delay={-5} />
        <div className="container-x relative">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Client love</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold mt-5">Results our clients <span className="gradient-text">brag</span> about</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.n} delay={i * 90}>
                <TiltCard className="p-8 h-full bg-white flex flex-col">
                  <div className="flex text-sun mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                  <blockquote className="text-lg leading-relaxed flex-1 font-medium">“{t.q}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ff3cac] to-[#7a3cff] grid place-items-center text-white font-bold">{t.n[0]}</span>
                    <span><p className="font-bold">{t.n}</p><p className="text-muted text-sm">{t.r}</p></span>
                  </figcaption>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BLOG (dark) ================= */}
      <section className="relative py-24 overflow-hidden">
        <div className="blob w-96 h-96 bg-[#7a3cff] -left-32 top-0" />
        <div className="container-x relative">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <Reveal>
              <span className="eyebrow"><Flame size={12} /> Trending today in India</span>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold mt-5">Fresh marketing angles on what India is searching</h2>
            </Reveal>
            <Link href="/blog" className="btn btn-ghost">All articles <ArrowRight size={16} /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {latest.map((p, i) => <Reveal key={p.slug} delay={i * 80}><BlogCard post={p} i={i} /></Reveal>)}
          </div>
        </div>
      </section>

      {/* ================= LEAD FORM (light) ================= */}
      <section id="audit" className="section-light relative overflow-hidden py-28">
        <Pill className="w-64 h-24 left-[-60px] bottom-10 rotate-[20deg]" delay={-3} />
        <Cube className="right-[8%] top-10" size={64} />
        <div className="container-x relative grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <span className="eyebrow">Free growth audit</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">Find out exactly where you are <span className="gradient-text">losing</span> customers.</h2>
            <p className="text-muted mt-6 text-lg leading-relaxed">Within 48 hours you get a written audit of your website, SEO, social and ads, with a prioritised 90-day plan. Worth Rs 10,000. Free for Delhi NCR businesses this month.</p>
            <ul className="mt-8 grid gap-3">
              {["Website conversion and speed review", "Keyword gaps vs your top 3 competitors", "Ad account waste analysis", "Social content scorecard"].map((x) => (
                <li key={x} className="flex gap-3 items-center font-medium"><span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4dff9e] to-[#2bd2ff] text-[#07041a] grid place-items-center text-sm font-black">✓</span>{x}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}><div className="card p-7 md:p-9 bg-white"><LeadForm source="/#audit" /></div></Reveal>
        </div>
      </section>

      {/* ================= FAQ (dark) ================= */}
      <section className="container-x py-24 max-w-3xl">
        <Reveal className="text-center">
          <span className="eyebrow">FAQs</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mt-5">Questions we hear every week</h2>
        </Reveal>
        <div className="mt-10"><FAQ items={FAQS} /></div>
      </section>

      <CTA />
    </>
  );
}
