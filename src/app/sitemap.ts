import type { MetadataRoute } from "next";
import { SITE, SERVICES, BLOG_CATEGORIES, INDUSTRIES, WORK } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";
import { liveTrendPosts } from "@/lib/trending";
import { slugify } from "@/lib/markdown";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [stored, live] = await Promise.all([getAllPosts(), liveTrendPosts("IN", 6)]);
  const posts = [...live.filter((l) => !stored.some((s) => s.slug === l.slug)), ...stored];
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...SERVICES.map((s) => ({ url: `${SITE.url}/services/${s.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 })),
    { url: `${SITE.url}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...WORK.map((w) => ({ url: `${SITE.url}/case-studies/${w.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: `${SITE.url}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...INDUSTRIES.map((i) => ({ url: `${SITE.url}/industries/${i.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...BLOG_CATEGORIES.map((c) => ({ url: `${SITE.url}/blog/category/${slugify(c)}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "weekly" as const, priority: p.source === "trend" ? 0.8 : 0.7 })),
    { url: `${SITE.url}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
