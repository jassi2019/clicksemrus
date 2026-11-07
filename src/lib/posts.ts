import { db } from "./db";
import { slugify } from "./markdown";
import { SEED_POSTS } from "@/content/seed-posts";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  category: string;
  tags: string[];
  cover?: string;
  coverCredit?: string;
  status: "published" | "draft";
  publishedAt: string; // ISO
  updatedAt: string;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
  source: "manual" | "trend" | "seed" | "keyword";
  trendTopic?: string;
  trendTraffic?: string;
  outbound?: { title: string; url: string; source: string }[];
};

const INDEX = "posts:index"; // set of slugs
const key = (slug: string) => `post:${slug}`;

export async function listDbPosts(): Promise<Post[]> {
  const slugs = await db.smembers(INDEX);
  const posts = await Promise.all(slugs.map((s) => db.get<Post>(key(s))));
  return posts.filter(Boolean) as Post[];
}

export async function getAllPosts(opts: { includeDrafts?: boolean } = {}): Promise<Post[]> {
  const dbPosts = await listDbPosts();
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const seeds = SEED_POSTS.filter((p) => !dbSlugs.has(p.slug));
  const all = [...dbPosts, ...seeds].filter((p) => opts.includeDrafts || p.status === "published");
  return all.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export async function getPost(slug: string, includeDrafts = false): Promise<Post | null> {
  const p = (await db.get<Post>(key(slug))) || SEED_POSTS.find((s) => s.slug === slug) || null;
  if (!p) return null;
  if (!includeDrafts && p.status !== "published") return null;
  return p;
}

export async function savePost(p: Post) {
  p.slug = p.slug ? slugify(p.slug) : slugify(p.title);
  p.updatedAt = new Date().toISOString();
  await db.set(key(p.slug), p);
  await db.sadd(INDEX, p.slug);
  return p;
}

export async function deletePost(slug: string) {
  await db.del(key(slug));
  await db.srem(INDEX, slug);
}

export async function postExists(slug: string) {
  return Boolean(await db.get(key(slug))) || SEED_POSTS.some((s) => s.slug === slug);
}

export function related(all: Post[], current: Post, n = 3) {
  const score = (p: Post) =>
    (p.category === current.category ? 2 : 0) + p.tags.filter((t) => current.tags.includes(t)).length;
  return all
    .filter((p) => p.slug !== current.slug)
    .sort((a, b) => score(b) - score(a) || (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, n);
}

export type Lead = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  company?: string;
  website?: string;
  services?: string[];
  service?: string;
  budget?: string;
  message?: string;
  consent?: boolean;
  source?: string;
  page?: string;
  createdAt: string;
  status: "new" | "contacted" | "won" | "lost";
};

export async function saveLead(l: Lead) {
  await db.lpush("leads", l);
  await db.ltrim("leads", 0, 999);
}
export async function listLeads(): Promise<Lead[]> {
  return db.lrange<Lead>("leads", 0, -1);
}

export type Settings = {
  gaId?: string;
  metaPixel?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  announcement?: string;
  autoPublishTrends?: boolean;
  trendGeo?: string;
  showStatsNote?: boolean;
  keywordPostsPerDay?: number;
};

export async function getSettings(): Promise<Settings> {
  return (await db.get<Settings>("settings")) || { autoPublishTrends: true, trendGeo: "IN" };
}
export async function saveSettings(s: Settings) {
  await db.set("settings", s);
}
