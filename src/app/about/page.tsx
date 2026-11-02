import Link from "next/link";
import { SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMeta({
  title: `About ${SITE.name} | Digital Marketing Agency in Delhi NCR`,
  description: `${SITE.name} is a Delhi NCR digital marketing agency built by performance marketers. Learn our story, values and how we work with brands across India.`,
  path: "/about",
});

const VALUES = [
  ["Revenue first", "Every report starts with leads and sales, not impressions."],
  ["Speed", "Campaigns live in 7 days. Trend creatives in 24 hours."],
  ["Radical transparency", "You see the ad accounts, the dashboards and the invoices. No black boxes."],
  ["Craft", "Design and copy that would make us proud even without the numbers."],
];

export default function About() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "About", path: "/about" }])} />
      <section className="container-x pt-16 md:pt-24 pb-12 max-w-4xl">
        <p className="eyebrow">About us</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">A growth team, not a vendor.</h1>
        <p className="text-muted text-lg mt-6 leading-relaxed">
          {SITE.name} started in Delhi NCR with a simple frustration: agencies that sent beautiful reports while cost per lead quietly went up. We built the agency we wished we could hire, one that treats your ad budget like its own money and reports in rupees.
        </p>
        <p className="text-muted text-lg mt-4 leading-relaxed">
          Today we run SEO, social media, paid media, content and web for brands across real estate, healthcare, education, D2C and B2B services in Delhi, Gurugram, Noida and beyond. Follow our work on <a className="text-brand-2 underline" href={SITE.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>.
        </p>
      </section>
      <section className="container-x grid sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-16">
        {VALUES.map(([t, d], i) => (
          <Reveal key={t} delay={i * 60}>
            <div className="card p-6 h-full">
              <p className="font-display text-3xl font-bold gradient-text">0{i + 1}</p>
              <h2 className="font-bold mt-3">{t}</h2>
              <p className="text-muted text-sm mt-2">{d}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <section className="bg-bg-2 border-y border-border py-16">
        <div className="container-x grid md:grid-cols-3 gap-8">
          {[
            ["Strategists", "Ex-brand and agency marketers who own your numbers."],
            ["Creators", "Designers, editors and writers who ship daily, including a trend desk that watches what India is searching."],
            ["Specialists", "Certified Google and Meta ads managers, technical SEOs and developers."],
          ].map(([t, d]) => (
            <div key={t}>
              <h2 className="font-display text-2xl font-bold">{t}</h2>
              <p className="text-muted mt-2">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-x py-16 max-w-3xl">
        <h2 className="font-display text-3xl font-bold">Want to work with us?</h2>
        <p className="text-muted mt-3">We take on a limited number of new clients each month so every account gets senior attention. <Link href="/contact" className="text-brand-2 underline">Start with a free audit</Link> or explore our <Link href="/services" className="text-brand-2 underline">services</Link>.</p>
      </section>
      <CTA />
    </>
  );
}
