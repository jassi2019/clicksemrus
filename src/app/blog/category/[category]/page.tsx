import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_CATEGORIES, SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import { liveTrendPosts } from "@/lib/trending";
import { slugify } from "@/lib/markdown";
import BlogCard from "@/components/BlogCard";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ category: slugify(c) }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const name = BLOG_CATEGORIES.find((c) => slugify(c) === category);
  if (!name) return {};
  return pageMeta({ title: `${name} Articles | ${SITE.name} Blog`, description: `${name} insights, guides and trending marketing ideas from ${SITE.name}, Delhi NCR.`, path: `/blog/category/${category}` });
}

export default async function Category({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const name = BLOG_CATEGORIES.find((c) => slugify(c) === category);
  if (!name) notFound();
  const [stored, live] = await Promise.all([getAllPosts(), liveTrendPosts("IN", 6)]);
  const posts = [...live.filter((l) => !stored.some((s) => s.slug === l.slug)), ...stored].filter((p) => p.category === name);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Blog", path: "/blog" }, { name, path: `/blog/category/${category}` }])} />
      <section className="container-x pt-16 md:pt-24 pb-8">
        <nav className="text-xs text-muted" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / {name}</nav>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">{name}</h1>
        <div className="flex flex-wrap gap-2 mt-6">
          {BLOG_CATEGORIES.map((c) => (
            <Link key={c} href={`/blog/category/${slugify(c)}`} className={`px-3 py-1.5 rounded-full text-xs font-semibold border border-border ${c === name ? "bg-brand text-white" : "bg-surface hover:bg-surface-2"}`}>{c}</Link>
          ))}
        </div>
      </section>
      <section className="container-x grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
        {posts.map((p, i) => <BlogCard key={p.slug} post={p} i={i} />)}
        {posts.length === 0 && <p className="text-muted">No articles in this category yet. Check back tomorrow.</p>}
      </section>
      <CTA />
    </>
  );
}
