import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMeta({
  title: "Results & Case Studies | Digital Marketing Agency Delhi NCR",
  description: `See how ${SITE.name} grows brands in Delhi NCR: SEO traffic growth, Meta Ads ROAS, Google Ads cost per lead and social media results across industries.`,
  path: "/case-studies",
});

const CASES = [
  { industry: "D2C Skincare, Gurugram", service: "Meta Ads + Creative", metric: "3.8x", label: "ROAS in 60 days", story: "Replaced stock creatives with a weekly UGC-style testing framework, rebuilt the funnel with Advantage+ shopping and retargeting, and fixed Conversions API tracking.", slug: "meta-ads" },
  { industry: "Dental Clinic, South Delhi", service: "Local SEO + Google Ads", metric: "74", label: "calls per month from Google", story: "Google Business Profile overhaul, 40 reviews in 90 days, location pages and a tight Search campaign on emergency keywords.", slug: "seo" },
  { industry: "Real Estate Consultancy, Noida", service: "Google Ads + Landing Pages", metric: "-52%", label: "cost per site visit", story: "Restructured the account by project, added negative keywords, built dedicated landing pages and WhatsApp lead routing.", slug: "google-ads-ppc" },
  { industry: "Coaching Institute, Delhi", service: "Social Media + Reels", metric: "210K", label: "followers in 8 months", story: "Daily reels with teacher-led hooks, exam-season moment marketing and WhatsApp funnels that filled batches.", slug: "social-media-marketing" },
  { industry: "B2B SaaS, Gurugram", service: "SEO + Content", metric: "+312%", label: "organic traffic in 6 months", story: "Topic clusters around buyer-intent keywords, programmatic comparison pages and digital PR links.", slug: "content-marketing" },
  { industry: "Home Interiors, Faridabad", service: "Website + Meta Ads", metric: "4.1%", label: "landing page conversion rate", story: "New Next.js website with 95+ PageSpeed, portfolio-led design and a Meta lead-form funnel.", slug: "web-design-development" },
];

export default function CaseStudies() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Results", path: "/case-studies" }])} />
      <section className="container-x pt-16 md:pt-24 pb-10 max-w-3xl">
        <p className="eyebrow">Results</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">Numbers our clients love to share</h1>
        <p className="text-muted text-lg mt-5">Representative results from recent engagements across Delhi NCR. Client names are kept private; full case decks are shared on request.</p>
      </section>
      <section className="container-x grid md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
        {CASES.map((c, i) => (
          <Reveal key={c.industry} delay={i * 60}>
            <article className="card p-6 h-full flex flex-col">
              <p className="text-xs text-muted">{c.industry}</p>
              <p className="text-sm font-semibold text-brand-2 mt-1">{c.service}</p>
              <p className="font-display text-5xl font-bold gradient-text mt-5">{c.metric}</p>
              <p className="font-semibold flex items-center gap-1 mt-1"><TrendingUp size={16} className="text-lime" /> {c.label}</p>
              <p className="text-sm text-muted mt-4 flex-1">{c.story}</p>
              <Link href={`/services/${c.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-2 mt-5">How we do it <ArrowRight size={14} /></Link>
            </article>
          </Reveal>
        ))}
      </section>
      <CTA title="Want results like these?" sub="Book a free strategy call. We will show you the exact playbook for your industry." />
    </>
  );
}
