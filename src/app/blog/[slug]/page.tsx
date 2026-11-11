import { coverFor, usesOriginalCover } from "@/lib/cover";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Flame, ExternalLink, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getAllPosts, getPost, related, type Post } from "@/lib/posts";
import { liveTrendPosts } from "@/lib/trending";
import { renderMarkdown, extractHeadings, readingTime, slugify } from "@/lib/markdown";
import BlogCard from "@/components/BlogCard";
import LeadForm from "@/components/LeadForm";
import JsonLd from "@/components/JsonLd";
import CTA from "@/components/CTA";

export const revalidate = 1800;

async function resolve(slug: string): Promise<{ post: Post | null; all: Post[] }> {
  const [stored, live] = await Promise.all([getAllPosts(), liveTrendPosts("IN", 6)]);
  const all = [...live.filter((l) => !stored.some((s) => s.slug === l.slug)), ...stored];
  const post = (await getPost(slug)) || live.find((p) => p.slug === slug) || null;
  return { post, all };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { post } = await resolve(slug);
  if (!post) return {};
  return pageMeta({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    image: coverFor(post, SITE.url),
    keywords: post.tags,
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { post, all } = await resolve(slug);
  if (!post) notFound();
  const html = renderMarkdown(post.content);
  const toc = extractHeadings(post.content);
  const rel = related(all, post, 3);
  const date = new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <JsonLd data={[articleJsonLd(post), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])]} />
      <article className="container-x pt-12 md:pt-20">
        <nav className="text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / <Link href={`/blog/category/${slugify(post.category)}`}>{post.category}</Link>
        </nav>
        <header className="max-w-3xl mt-4">
          <div className="flex gap-2 items-center flex-wrap">
            <span className="badge bg-surface-2 text-fg border border-border">{post.category}</span>
            {post.source === "trend" && <span className="badge bg-accent text-white flex items-center gap-1"><Flame size={10} /> Trending now{post.trendTraffic ? ` · ${post.trendTraffic} searches` : ""}</span>}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold mt-4 leading-tight">{post.title}</h1>
          <p className="text-muted text-lg mt-4">{post.excerpt}</p>
          <p className="text-sm text-muted mt-4 flex items-center gap-4 flex-wrap">
            <span>By {post.author}</span><span>{date}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {readingTime(post.content)} min read</span>
          </p>
        </header>
        <figure className="mt-8 rounded-2xl overflow-hidden border border-border max-w-4xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverFor(post)} alt={post.title} className="w-full max-h-[420px] object-cover" />
          {usesOriginalCover(post) && post.coverCredit && <figcaption className="text-xs text-muted px-4 py-2">Image: {post.coverCredit}</figcaption>}
        </figure>
        <div className="grid lg:grid-cols-[1fr_300px] gap-10 mt-10">
          <div>
            {toc.length > 2 && (
              <nav className="card p-5 mb-8" aria-label="Table of contents">
                <p className="font-semibold text-sm mb-2">In this article</p>
                <ol className="text-sm text-muted space-y-1 list-decimal pl-5">
                  {toc.map((h) => <li key={h.id}><a href={`#${h.id}`} className="hover:text-brand-2">{h.text}</a></li>)}
                </ol>
              </nav>
            )}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
            {post.outbound && post.outbound.length > 0 && (
              <section className="mt-10 card p-5">
                <h2 className="font-semibold">Sources and further reading</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {post.outbound.map((o) => (
                    <li key={o.url}><a href={o.url} target="_blank" rel="noopener noreferrer" className="text-brand-2 hover:underline inline-flex items-center gap-1">{o.title} <ExternalLink size={12} /></a> <span className="text-muted">— {o.source}</span></li>
                  ))}
                </ul>
              </section>
            )}
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((t) => <span key={t} className="px-3 py-1 rounded-full text-xs bg-surface border border-border text-muted">#{t}</span>)}
            </div>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            <div className="card p-5 bg-gradient-to-br from-brand/20 to-transparent">
              <h3 className="font-display text-xl font-bold">Get a free marketing audit</h3>
              <p className="text-sm text-muted mt-1 mb-4">See exactly how your brand can use ideas like these.</p>
              <LeadForm compact source={`/blog/${post.slug}`} />
            </div>
            <div className="card p-5">
              <h3 className="font-semibold">Explore services</h3>
              <ul className="mt-3 text-sm space-y-2">
                {[["SEO Services", "/services/seo"], ["Social Media Marketing", "/services/social-media-marketing"], ["Meta Ads", "/services/meta-ads"], ["Google Ads", "/services/google-ads-ppc"], ["Content Marketing", "/services/content-marketing"]].map(([n, h]) => (
                  <li key={h}><Link href={h} className="flex items-center justify-between text-muted hover:text-fg">{n} <ArrowRight size={14} /></Link></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
      {rel.length > 0 && (
        <section className="container-x mt-20">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Related reads</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-6">{rel.map((p, i) => <BlogCard key={p.slug} post={p} i={i} />)}</div>
        </section>
      )}
      <CTA title={`Want ${SITE.name} to run this playbook for you?`} />
    </>
  );
}
