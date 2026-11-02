import Link from "next/link";
import { Flame } from "lucide-react";
import { SITE, BLOG_CATEGORIES } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import { liveTrendPosts } from "@/lib/trending";
import { slugify } from "@/lib/markdown";
import BlogCard from "@/components/BlogCard";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export const metadata = pageMeta({
  title: "Digital Marketing Blog | Trending Topics, SEO, Social & Ads Tips",
  description: `Daily marketing insights from ${SITE.name}: what is trending in India today, SEO guides, social media playbooks, Google and Meta Ads tips for business owners.`,
  path: "/blog",
  keywords: ["digital marketing blog india", "trending topics today india marketing", "seo tips", "social media tips"],
});

export default async function Blog({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const [stored, live] = await Promise.all([getAllPosts(), liveTrendPosts("IN", 6)]);
  const storedSlugs = new Set(stored.map((p) => p.slug));
  let posts = [...live.filter((p) => !storedSlugs.has(p.slug)), ...stored];
  if (q) {
    const s = q.toLowerCase();
    posts = posts.filter((p) => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s) || p.tags.some((t) => t.includes(s)));
  }
  const [first, ...rest] = posts;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Blog", path: "/blog" }])} />
      <section className="container-x pt-16 md:pt-24 pb-8">
        <p className="eyebrow"><Flame size={14} /> Updated daily from Google Trends India</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">Marketing insights on what India is talking about</h1>
        <p className="text-muted text-lg mt-4 max-w-2xl">Trending topics turned into marketing playbooks, plus evergreen guides on SEO, social media and paid ads.</p>
        <form className="mt-6 flex gap-2 max-w-md" action="/blog">
          <input name="q" defaultValue={q} placeholder="Search articles" className="input" aria-label="Search articles" />
          <button className="btn btn-ghost">Search</button>
        </form>
        <div className="flex flex-wrap gap-2 mt-6">
          {BLOG_CATEGORIES.map((c) => (
            <Link key={c} href={`/blog/category/${slugify(c)}`} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-surface hover:bg-surface-2">{c}</Link>
          ))}
        </div>
      </section>
      <section className="container-x pb-12">
        {first && <BlogCard post={first} featured />}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {rest.map((p, i) => <BlogCard key={p.slug} post={p} i={i + 1} />)}
        </div>
        {posts.length === 0 && <p className="text-muted">No articles found.</p>}
      </section>
      <CTA title="Want this kind of content for your brand?" sub="Our content team publishes SEO and trend-based articles for clients every day." />
    </>
  );
}
