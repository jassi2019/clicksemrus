import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, personJsonLd, profilePageJsonLd } from "@/lib/seo";
import { AUTHORS, getAuthor, postsByAuthor } from "@/lib/authors";
import { getAllPosts, isDmPost } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";
import AuthorAvatar from "@/components/AuthorAvatar";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getAuthor(slug);
  if (!a) return {};
  return pageMeta({
    title: `${a.name} — ${a.role}`,
    description: a.short,
    path: `/authors/${a.slug}`,
    keywords: a.expertise,
  });
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const all = (await getAllPosts()).filter(isDmPost);
  const posts = postsByAuthor(all, slug).slice(0, 24);

  return (
    <>
      <JsonLd data={[
        personJsonLd(author),
        profilePageJsonLd(author),
        breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Blog", path: "/blog" }, { name: author.name, path: `/authors/${author.slug}` }]),
      ]} />

      <section className="container-x pt-16 md:pt-24 pb-8">
        <nav className="text-xs text-muted" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / {author.name}</nav>
        <div className="mt-6 flex flex-col sm:flex-row sm:items-start gap-5 max-w-3xl">
          <AuthorAvatar name={author.name} size={72} className="!text-2xl" />
          <div>
            <p className="eyebrow">{author.role}</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mt-2 leading-tight">{author.name}</h1>
            <p className="text-muted text-lg mt-4 leading-relaxed">{author.bio}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {author.expertise.map((e) => (
                <span key={e} className="px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-border text-muted">{e}</span>
              ))}
            </div>
            {author.link && (
              <a href={author.link} target="_blank" rel="noopener noreferrer me" className="inline-flex items-center gap-1 text-sm font-bold text-brand mt-5">
                Follow {SITE.name} <ArrowRight size={14} />
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="container-x pb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold">Articles by {author.name}</h2>
        {posts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {posts.map((p, i) => <BlogCard key={p.slug} post={p} i={i} />)}
          </div>
        ) : (
          <p className="text-muted mt-4">New articles from this desk are published regularly. <Link href="/blog" className="text-brand font-semibold underline underline-offset-2">Browse the blog</Link>.</p>
        )}
      </section>

      <section className="container-x pb-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">More from the ClickSemrus desks</p>
        <div className="flex flex-wrap gap-2">
          {AUTHORS.filter((a) => a.slug !== author.slug).map((a) => (
            <Link key={a.slug} href={`/authors/${a.slug}`} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-surface hover:bg-surface-2">
              {a.name}
            </Link>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
