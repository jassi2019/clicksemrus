import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";

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

const FAQS = [
  { q: "Are ad budgets included in the price?", a: "No. The prices are agency fees. Ad spend is paid directly to Google or Meta from your own account, so you always own your data." },
  { q: "Is GST extra?", a: "Yes, 18% GST applies on all packages." },
  { q: "Can I customise a package?", a: "Absolutely. Most clients end up with a custom mix. Tell us your goal and budget on the contact page." },
  { q: "What is the minimum commitment?", a: "3 months for SEO-inclusive plans because that is the time it takes to prove results. Ads-only and social plans are month to month." },
];

export default function Pricing() {
  return (
    <>
      <JsonLd data={[faqJsonLd(FAQS), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Pricing", path: "/pricing" }])]} />
      <section className="container-x pt-16 md:pt-24 pb-10 text-center max-w-3xl">
        <p className="eyebrow justify-center">Pricing</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">Transparent packages. No hidden fees.</h1>
        <p className="text-muted text-lg mt-5">Pick a plan or ask for a custom quote. Every plan includes tracking, reporting and a real human who answers your WhatsApp.</p>
      </section>
      <section className="container-x grid md:grid-cols-3 gap-5 py-10 items-stretch">
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
      </section>
      <p className="container-x text-center text-xs text-muted">Prices exclude GST and ad spend. Website design and branding are quoted per project.</p>
      <section className="container-x py-16 max-w-3xl">
        <h2 className="font-display text-3xl font-bold text-center">Pricing FAQs</h2>
        <div className="mt-8"><FAQ items={FAQS} /></div>
      </section>
      <CTA title="Need a custom quote?" sub="Share your goals and budget. You will get a proposal within 24 hours." />
    </>
  );
}
