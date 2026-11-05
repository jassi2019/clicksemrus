import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { SITE, WORK, serviceUrl } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import WorkGrid from "@/components/WorkGrid";

export const metadata = pageMeta({
  title: "Our Work & Results | Digital Marketing Agency Delhi NCR",
  description: `See how ${SITE.name} grows brands in Delhi NCR: websites, ad creatives and reels with real outcomes across SEO, Meta Ads, Google Ads and social media.`,
  path: "/case-studies",
  keywords: ["digital marketing case studies delhi", "marketing agency portfolio", "website design portfolio delhi ncr"],
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
        <p className="eyebrow">Our work</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">Work we&apos;re proud of</h1>
        <p className="text-muted text-lg mt-5">Websites, ad creatives and reels for businesses across Delhi NCR. Client names are shortened on request; full decks are shared on a call.</p>
      </section>
      <section className="container-x pb-16">
        <WorkGrid items={WORK} />
      </section>

      <section className="bg-bg-2 border-y border-border py-20">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Results</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Numbers our clients love to share</h2>
            <p className="text-muted mt-4">Representative results from recent engagements across Delhi NCR.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {CASES.map((c, i) => (
              <Reveal key={c.industry} delay={(i % 3) * 90}>
                <article className="card p-6 h-full flex flex-col">
                  <p className="text-xs text-muted">{c.industry}</p>
                  <p className="text-sm font-semibold text-brand mt-1">{c.service}</p>
                  <p className="font-display text-5xl font-bold gradient-text mt-5">{c.metric}</p>
                  <p className="font-semibold flex items-center gap-1 mt-1"><TrendingUp size={16} className="text-lime" /> {c.label}</p>
                  <p className="text-sm text-muted mt-4 flex-1">{c.story}</p>
                  <Link href={serviceUrl(c.slug)} className="inline-flex items-center gap-1 text-sm font-semibold text-brand mt-5">How we do it <ArrowRight size={14} /></Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTA title="Want results like these?" sub="Book a free strategy call. We will show you the exact playbook for your industry." />
    </>
  );
}
