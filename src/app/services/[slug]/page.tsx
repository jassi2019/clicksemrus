import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { SERVICES, SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import ServiceIcon from "@/components/ServiceIcon";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import BlogCard from "@/components/BlogCard";

export const revalidate = 3600;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return {};
  return pageMeta({
    title: `${s.name} in Delhi NCR | ${SITE.name}`,
    description: `${s.headline}. ${s.description}`.slice(0, 158),
    path: `/services/${s.slug}`,
    keywords: s.keywords,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) notFound();
  const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 4);
  const posts = (await getAllPosts()).filter((p) => p.content.toLowerCase().includes(s.name.split(" ")[0].toLowerCase())).slice(0, 3);

  return (
    <>
      <JsonLd data={[serviceJsonLd(s), faqJsonLd(s.faqs), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Services", path: "/services" }, { name: s.name, path: `/services/${s.slug}` }])]} />
      <section className="relative overflow-hidden">
        <div className="blob w-96 h-96 bg-brand -top-32 -right-20" />
        <div className="container-x relative pt-16 md:pt-24 pb-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-muted mb-4" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/services">Services</Link> / <span className="text-fg">{s.name}</span></nav>
            <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand/30 to-brand-2/20 border border-border text-brand-2"><ServiceIcon name={s.icon} size={26} /></span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-5 leading-tight">{s.headline}</h1>
            <p className="text-muted text-lg mt-5 leading-relaxed">{s.description}</p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-2">
              {s.benefits.map((b) => (
                <li key={b} className="flex gap-2 text-sm"><Check size={18} className="text-lime shrink-0" /> {b}</li>
              ))}
            </ul>
            <div className="flex gap-3 mt-8 flex-wrap">
              <a href="#quote" className="btn btn-primary">Get a Free {s.name.split(" ")[0]} Audit <ArrowRight size={18} /></a>
              <Link href="/pricing" className="btn btn-ghost">See Pricing</Link>
            </div>
          </div>
          <div id="quote" className="card p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold">Request a free audit</h2>
            <p className="text-muted text-sm mt-1 mb-5">We reply within 2 business hours.</p>
            <LeadForm compact source={`/services/${s.slug}`} />
          </div>
        </div>
      </section>

      <section className="container-x py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <p className="eyebrow">What you get</p>
          <h2 className="font-display text-3xl font-bold mt-3">Everything included in our {s.name.toLowerCase()} plans</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {s.deliverables.map((d, i) => (
              <div key={d} className="card p-5 flex gap-3 items-start">
                <span className="w-8 h-8 rounded-lg bg-brand/20 text-brand-2 grid place-items-center text-sm font-bold shrink-0">{i + 1}</span>
                <p className="font-medium">{d}</p>
              </div>
            ))}
          </div>
          <h2 className="font-display text-3xl font-bold mt-16">How we run {s.name.toLowerCase()}</h2>
          <ol className="mt-6 space-y-4 text-muted">
            <li><strong className="text-fg">Week 1: Audit and setup.</strong> Tracking, baselines, competitor benchmarks and a 90-day roadmap.</li>
            <li><strong className="text-fg">Weeks 2 to 4: Launch.</strong> First campaigns, content or fixes go live. You see early signals in the dashboard.</li>
            <li><strong className="text-fg">Month 2 onwards: Optimise and scale.</strong> Weekly reviews, monthly strategy call, and budget shifts to what is working.</li>
          </ol>
          <h2 className="font-display text-3xl font-bold mt-16">FAQs about {s.name.toLowerCase()}</h2>
          <div className="mt-6"><FAQ items={s.faqs} /></div>
        </div>
        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold">Pairs well with</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {others.map((o) => (
                <li key={o.slug}><Link href={`/services/${o.slug}`} className="flex items-center gap-2 text-muted hover:text-fg"><ServiceIcon name={o.icon} size={16} className="text-brand-2" />{o.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="card p-6 bg-gradient-to-br from-brand/20 to-transparent">
            <h3 className="font-bold">Talk to a strategist</h3>
            <p className="text-sm text-muted mt-2">Free 20-minute call. We will tell you honestly whether {s.name.toLowerCase()} is the right first step.</p>
            <Link href="/contact" className="btn btn-primary mt-4 w-full text-sm">Book a call</Link>
          </div>
        </aside>
      </section>

      {posts.length > 0 && (
        <section className="container-x py-8">
          <h2 className="font-display text-2xl font-bold">Related reading</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-6">{posts.map((p, i) => <BlogCard key={p.slug} post={p} i={i} />)}</div>
        </section>
      )}
      <CTA title={`Ready to grow with ${s.name.toLowerCase()}?`} />
    </>
  );
}
