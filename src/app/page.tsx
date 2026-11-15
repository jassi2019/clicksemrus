import Link from "next/link";
import { ArrowRight, Zap, Target, BarChart3, TrendingUp, Flame, Star, Award } from "lucide-react";
import { SITE, SERVICES, INDUSTRIES, WORK, HOME_FAQS, serviceUrl } from "@/lib/site";
import { pageMeta, faqJsonLd, reviewJsonLd } from "@/lib/seo";
import { getAllPosts, getSettings } from "@/lib/posts";
import { getContent, parseStat, splitPair } from "@/lib/pageContent";
import { liveTrendPosts } from "@/lib/trending";
import { getReviews } from "@/lib/reviews";
import ServiceIcon from "@/components/ServiceIcon";
import ServiceArt from "@/components/ServiceArt";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import BlogCard from "@/components/BlogCard";
import JsonLd from "@/components/JsonLd";
import ScrollSceneLoader from "@/components/ScrollSceneLoader";
import ServiceTicker from "@/components/ServiceTicker";
import ReelsShowcase from "@/components/ReelsShowcase";
import AutoScrollRow from "@/components/AutoScrollRow";
import { getClientReels } from "@/lib/reels";
import { LOCAL_REELS } from "@/content/localReels";
import TiltCard from "@/components/TiltCard";
import Reviews from "@/components/Reviews";
import InstagramFeed from "@/components/InstagramFeed";
import { getInstagramFeed } from "@/lib/instagram";
import WorkGrid from "@/components/WorkGrid";
import { Pill, Cube } from "@/components/Shapes";
import { getPublishedLayout } from "@/lib/builderStore";
import { faqsFromBlocks } from "@/lib/builder";
import BlockRenderer from "@/components/builder/BlockRenderer";

export const revalidate = 3600;

export const metadata = pageMeta({
  title: `${SITE.name} | Digital Marketing Agency in Delhi NCR That Delivers ROI`,
  description: SITE.description,
  path: "",
  keywords: ["digital marketing agency delhi", "best digital marketing agency delhi ncr", "seo company delhi", "social media marketing gurugram", "performance marketing agency noida"],
});

const PROCESS = [
  { icon: Target, t: "Audit & Strategy", d: "We study your market, competitors and funnel, then build a 90-day growth plan with clear KPIs." },
  { icon: Zap, t: "Launch in 7 days", d: "Campaigns, content and tracking go live within a week. No month-long onboarding." },
  { icon: BarChart3, t: "Optimise weekly", d: "Every week we cut what does not work and scale what does, with a live dashboard you can open anytime." },
  { icon: TrendingUp, t: "Scale profitably", d: "Once cost per lead is proven, we scale budgets and channels to grow revenue, not just traffic." },
];

const WHY = [
  { t: "Reports in rupees, not impressions", d: "Every report starts with leads, cost per lead and revenue. Impressions and reach are footnotes." },
  { t: "7-day launch, no month-long onboarding", d: "Tracking, creatives and first campaigns go live within a week of signing. You see data in the dashboard from day one." },
  { t: "No long lock-ins", d: "Month to month after an initial 3-month SEO commitment. We keep clients by performing, not by contract." },
];

const FAQS = HOME_FAQS;

export default async function Home() {
  // Admin → Page builder can take over this route with a published layout.
  const layout = await getPublishedLayout("home");
  if (layout) {
    const faqs = faqsFromBlocks(layout.blocks);
    return (
      <>
        <JsonLd data={faqJsonLd(faqs.length ? faqs : FAQS)} />
        <BlockRenderer blocks={layout.blocks} />
      </>
    );
  }
  const [posts, trends, reviews, igPosts, blamelessReels, raazReels, settings, content] = await Promise.all([
    getAllPosts(),
    liveTrendPosts("IN", 3),
    getReviews(),
    getInstagramFeed(4),
    getClientReels("liv.blameless", 10, "latest", ["DbngL7gChby", "DaVIv4dFIEW", "DW9e9W3EifU", "DW0S8QlAu0I", "DVT3-_sEvAN", "DXa6xa4gS82", "DXD7e6NDnDk"]),
    getClientReels("kahiankahiraaz", 8, "likes"),
    getSettings().catch(() => ({} as Awaited<ReturnType<typeof getSettings>>)),
    getContent("home"),
  ]);
  const latest = [...trends, ...posts].slice(0, 3);
  const hero = {
    eyebrow: content.get("heroEyebrow"),
    headline: content.get("heroHeadline"),
    headlineAccent: content.get("heroHeadlineAccent"),
    sub: content.get("heroSub"),
    primaryCta: content.get("heroPrimaryCta"),
    secondaryCta: content.get("heroSecondaryCta"),
  };
  const stats = content.list("stats").slice(0, 4).map((item) => {
    const [value, label] = splitPair(item);
    const { value: v, suffix: s, decimals: d } = parseStat(value);
    return { v, s, d, l: label || value };
  });

  return (
    <>
      <JsonLd data={[faqJsonLd(FAQS), reviewJsonLd(reviews)]} />

      {/* 3D scroll-through hero */}
      <ScrollSceneLoader hero={hero} reel={{ thumb: LOCAL_REELS[0].thumb, video: LOCAL_REELS[0].video, likes: Math.max(...[...raazReels, ...blamelessReels].map((r) => r.likes), 0), comments: Math.max(...[...raazReels, ...blamelessReels].map((r) => r.comments), 0), caption: "Brand reel" }} />

      {/* service ticker */}
      <ServiceTicker />

      {/* client reels showcase (replaces the stats cards) */}
      <ReelsShowcase
        clients={[
          { key: "skincare", client: "brands", handle: "clicksemrus", profileUrl: SITE.instagram, caseStudyHref: "/case-studies", kind: "Reels", tagline: "Scripted, shot, edited and posted by ClickSemrus for D2C, retail, clinic and service brands. Tap any reel to play it.", reels: [...LOCAL_REELS, ...blamelessReels] },
          { key: "stories", client: "creators", handle: "clicksemrus", profileUrl: SITE.instagram, caseStudyHref: "/case-studies", kind: "AI videos", tagline: "Fully AI-generated videos: script, voice, visuals and edit by ClickSemrus. Ranked by likes, the top one crossed 1,000.", reels: raazReels },
        ]}
      />

      {/* services */}
      <section className="relative overflow-hidden py-24">
        <Pill className="w-56 h-20 right-[-40px] top-10 rotate-[-25deg]" delay={-4} />
        <Cube className="left-[6%] bottom-10" size={56} />
        <div className="container-x relative">
          <Reveal className="max-w-4xl">
            <span className="eyebrow">What we do</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-balance mt-5 leading-[1.02]">Every channel. One goal: <span className="gradient-text">growth.</span></h2>
            <p className="text-muted mt-5 text-lg">Pick one service or let us run the full funnel. Every plan includes tracking, a live dashboard and a dedicated growth manager.</p>
          </Reveal>
          <AutoScrollRow className="svc-row grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-10 sm:mt-14" speed={30}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 90}>
                <Link href={serviceUrl(s.slug)} className="block h-full group">
                  <TiltCard className="p-4 sm:p-7 h-full overflow-hidden">
                    <span className="hidden sm:block"><ServiceArt slug={s.slug} /></span>
                    <span className="inline-grid place-items-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#0b0b14] text-white group-hover:bg-brand transition shadow-[0_14px_30px_-14px_rgba(11,11,20,.6)]">
                      <ServiceIcon name={s.icon} size={20} />
                    </span>
                    <h3 className="font-display text-base sm:text-2xl font-bold mt-3 sm:mt-6 leading-snug">{s.name}</h3>
                    <p className="text-muted mt-2 leading-relaxed hidden sm:block">{s.short}</p>
                    <span className="inline-flex items-center gap-1 font-bold text-brand text-sm sm:text-base mt-3 sm:mt-5 group-hover:gap-3 transition-all">Explore <ArrowRight size={16} /></span>
                  </TiltCard>
                </Link>
              </Reveal>
            ))}
          </AutoScrollRow>
        </div>
      </section>

      {/* why us */}
      <section className="relative overflow-hidden py-24 bg-bg-2 border-y border-border">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <Reveal variant="right">
            <span className="eyebrow">Why ClickSemrus</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-balance mt-5 leading-[1.05]">The ClickSemrus <span className="gradient-text">difference</span></h2>
            <p className="text-muted mt-5 text-lg">We built the agency we wished we could hire: fast, transparent and judged on revenue.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <span className="card !transform-none px-5 py-3 inline-flex items-center gap-2 font-bold"><Star size={18} className="text-sun" fill="currentColor" /> {reviews.rating.toFixed(1)} ★ client rating</span>
              <span className="card !transform-none px-5 py-3 inline-flex items-center gap-2 font-bold"><Award size={18} className="text-brand" /> 50+ brands scaled</span>
            </div>
          </Reveal>
          <div className="grid gap-4">
            {WHY.map((w, i) => (
              <Reveal key={w.t} delay={i * 90}>
                <div className="card p-6 flex gap-5 items-start">
                  <span className="font-display text-3xl font-extrabold text-brand/40 leading-none">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold">{w.t}</h3>
                    <p className="text-muted mt-1 leading-relaxed text-sm">{w.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* work */}
      <section className="relative overflow-hidden py-24">
        <div className="container-x">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <Reveal className="max-w-4xl">
              <span className="eyebrow">Our work</span>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold text-balance mt-5 leading-[1.02]">Work we&apos;re proud of</h2>
            </Reveal>
            <Link href="/case-studies" className="btn btn-ghost">View all work <ArrowRight size={16} /></Link>
          </div>
          <Reveal delay={90} className="mt-12">
            <WorkGrid items={WORK} limit={6} showTabs={false} />
          </Reveal>
        </div>
      </section>

      {/* industries */}
      <section className="relative overflow-hidden py-24 bg-bg-2 border-y border-border">
        <div className="container-x">
          <Reveal className="max-w-4xl">
            <span className="eyebrow">Industries</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-balance mt-5 leading-[1.02]">Built for businesses across every sector</h2>
            <p className="text-muted mt-5 text-lg">Playbooks, benchmarks and creative formats that already work in your category.</p>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-10 sm:mt-14">
            {INDUSTRIES.map((ind, i) => (
              <Reveal key={ind.slug} delay={(i % 3) * 90}>
                <Link href={`/industries/${ind.slug}`} className="card p-4 sm:p-7 h-full flex flex-col group">
                  <span className="font-display text-xs sm:text-sm font-bold text-brand tracking-widest">0{i + 1}</span>
                  <h3 className="font-display text-base sm:text-2xl font-bold mt-2 sm:mt-3 leading-snug">{ind.name}</h3>
                  <p className="text-muted mt-2 text-sm flex-1 hidden sm:block">{ind.short}</p>
                  <span className="inline-flex items-center gap-1 font-bold text-brand mt-5 group-hover:gap-3 transition-all">See playbook <ArrowRight size={16} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* process (dark) */}
      <section className="section-dark relative overflow-hidden py-28">
        <div className="absolute inset-0 dots" />
        <div className="blob w-[28rem] h-[28rem] bg-[#4f46e5] -right-40 -top-20" />
        <div className="container-x relative grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <span className="eyebrow">How we work</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-balance mt-5 leading-[1.05]">From audit to scale in <span className="text-[#8b84ff]">four steps.</span></h2>
            <p className="text-muted mt-6 text-lg leading-relaxed">Most agencies send a PDF of impressions. We give you a live dashboard of leads, cost per lead and revenue, plus a weekly call about what we changed and why.</p>
            <Link href="/contact" className="btn btn-primary mt-8">Book a free strategy call <ArrowRight size={18} /></Link>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {PROCESS.map((p, i) => (
              <Reveal key={p.t} delay={i * 90}>
                <TiltCard className="p-6 h-full glass">
                  <span className="grid place-items-center w-12 h-12 rounded-xl bg-white text-[#0b0b14]"><p.icon size={22} /></span>
                  <p className="text-xs text-muted mt-5 font-bold tracking-widest">STEP 0{i + 1}</p>
                  <h3 className="font-display text-xl font-bold mt-1">{p.t}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{p.d}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* google reviews */}
      <Reviews data={reviews} />

      {/* instagram live feed */}
      <InstagramFeed posts={igPosts} />

      {/* blog */}
      <section className="relative py-16">
        <div className="container-x relative">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <Reveal>
              <span className="eyebrow"><Flame size={12} /> Trending today in India</span>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold text-balance mt-5">Fresh marketing angles on what India is searching</h2>
            </Reveal>
            <Link href="/blog" className="btn btn-ghost">All articles <ArrowRight size={16} /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {latest.map((p, i) => <Reveal key={p.slug} delay={i * 90} className="h-full"><BlogCard post={p} i={i} /></Reveal>)}
          </div>
        </div>
      </section>

      {/* lead form */}
      <section id="audit" className="relative overflow-hidden py-28 bg-bg-2 border-y border-border">
        <Pill className="w-64 h-24 left-[-60px] bottom-10 rotate-[20deg]" delay={-3} />
        <div className="container-x relative grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <span className="eyebrow">Free growth audit</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-balance mt-5 leading-[1.02]">Find out exactly where you are losing customers.</h2>
            <p className="text-muted mt-6 text-lg leading-relaxed">Within 48 hours you get a written audit of your website, SEO, social and ads, with a prioritised 90-day plan. Worth Rs 10,000. Free for Delhi NCR businesses this month.</p>
            <ul className="mt-8 grid gap-3">
              {["Website conversion and speed review", "Keyword gaps vs your top 3 competitors", "Ad account waste analysis", "Social content scorecard"].map((x) => (
                <li key={x} className="flex gap-3 items-center font-medium"><span className="w-7 h-7 rounded-full bg-[#0b0b14] text-white grid place-items-center text-sm font-black">✓</span>{x}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={90}><div className="card p-7 md:p-9 !transform-none"><LeadForm source="/#audit" /></div></Reveal>
        </div>
      </section>

      {/* faq */}
      <section className="container-x py-16 max-w-3xl">
        <Reveal className="text-center">
          <span className="eyebrow">FAQs</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-balance mt-5">Questions we hear every week</h2>
        </Reveal>
        <div className="mt-10"><FAQ items={FAQS} /></div>
      </section>

      <CTA />
    </>
  );
}
