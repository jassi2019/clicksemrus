import Link from "next/link";
import { Flame } from "lucide-react";
import { SITE, BLOG_CATEGORIES } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import { getAllPosts, isDmPost } from "@/lib/posts";
import { slugify } from "@/lib/markdown";
import BlogCard from "@/components/BlogCard";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export const metadata = pageMeta({
  title: "Digital Marketing Blog & Trending News India | SEO, Social & Ads",
  description: `Digital marketing blog and trending news India from ${SITE.name}: what is trending today across sports, entertainment, business and tech, plus SEO guides, social media playbooks and Google and Meta Ads tips.`,
  path: "/blog",
  keywords: ["digital marketing blog india", "trending news india", "trending topics today india", "seo tips", "social media tips", "marketing blog"],
});

export default async function Blog({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const stored = (await getAllPosts()).filter(isDmPost); // trend news is noindexed and not listed
  const storedSlugs = new Set(stored.map((p) => p.slug));
  let posts = [...stored];
  if (q) {
    const s = q.toLowerCase();
    posts = posts.filter((p) => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s) || p.tags.some((t) => t.includes(s)));
  }
  const [first, ...rest] = posts;
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.category, (counts.get(p.category) || 0) + 1);
  const topics = [...BLOG_CATEGORIES]
    .filter((c) => (counts.get(c) || 0) > 0)
    .sort((a, b) => (counts.get(b) || 0) - (counts.get(a) || 0));

  // Topical clusters: group posts by category for a dense internal link graph (item #11).
  const latest = posts.slice(0, 7);
  const clusterable = posts.filter((p) => !latest.some((l) => l.slug === p.slug));
  const byCategory = new Map<string, typeof posts>();
  for (const p of clusterable) {
    const list = byCategory.get(p.category) || [];
    list.push(p);
    byCategory.set(p.category, list);
  }
  const clusters = [...BLOG_CATEGORIES]
    .map((c) => ({ name: c, posts: byCategory.get(c) || [] }))
    .filter((c) => c.posts.length > 0)
    .sort((a, b) => b.posts.length - a.posts.length);
  const showClusters = !q;

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
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Browse by topic</p>
          <div className="flex flex-wrap gap-2">
            {(topics.length ? topics : [...BLOG_CATEGORIES]).map((c) => (
              <Link key={c} href={`/blog/category/${slugify(c)}`} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-surface hover:bg-surface-2">
                {c}{counts.get(c) ? <span className="text-muted font-normal"> · {counts.get(c)}</span> : null}
              </Link>
            ))}
          </div>
        </div>
      </section>
      {showClusters ? (
        <>
          <section className="container-x pb-12">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-6">Latest news &amp; insights</h2>
            {first && <BlogCard post={first} featured />}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {latest.slice(1).map((p, i) => <BlogCard key={p.slug} post={p} i={i + 1} />)}
            </div>
          </section>
          {clusters.map((cl) => (
            <section key={cl.name} className="container-x pb-12">
              <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
                <h2 className="font-display text-2xl md:text-3xl font-extrabold">{cl.name}</h2>
                <Link href={`/blog/category/${slugify(cl.name)}`} className="text-sm font-bold text-brand inline-flex items-center gap-1">See all {cl.name} <span aria-hidden="true">→</span></Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cl.posts.slice(0, 6).map((p, i) => <BlogCard key={p.slug} post={p} i={i} />)}
              </div>
            </section>
          ))}
          {posts.length === 0 && <section className="container-x pb-12"><p className="text-muted">No articles found.</p></section>}
        </>
      ) : (
        <section className="container-x pb-12">
          {first && <BlogCard post={first} featured />}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {rest.map((p, i) => <BlogCard key={p.slug} post={p} i={i + 1} />)}
          </div>
          {posts.length === 0 && <p className="text-muted">No articles found.</p>}
        </section>
      )}
      <CTA title="Want this kind of content for your brand?" sub="Our content team publishes SEO and trend-based articles for clients every day." />
    </>
  );
}
