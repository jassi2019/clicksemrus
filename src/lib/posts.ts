import { unstable_cache, revalidateTag } from "next/cache";
import { db } from "./db";
import { slugify } from "./markdown";
import { SEED_POSTS } from "@/content/seed-posts";

/**
 * Posts live in Upstash Redis. Reading them on every request (smembers + one get
 * per slug) burns thousands of Redis calls under crawler/visitor load and blew
 * the free-tier monthly limit, which 500'd the whole blog. These reads are wrapped
 * in Next's data cache (POSTS_TAG, 1-hour revalidate) so Redis is touched at most
 * once per hour per server instance; writes bust the tag so edits show immediately.
 */
export const POSTS_TAG = "posts";
const POSTS_TTL = 3600; // seconds

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

async function listDbPostsRaw(): Promise<Post[]> {
  const slugs = await db.smembers(INDEX);
  const posts = await Promise.all(slugs.map((s) => db.get<Post>(key(s))));
  return posts.filter(Boolean) as Post[];
}

/** Cached list of all DB posts (see POSTS_TAG note above). Shared by blog, home, sitemap, RSS. */
export const listDbPosts = unstable_cache(listDbPostsRaw, ["db-posts"], { revalidate: POSTS_TTL, tags: [POSTS_TAG] });

export async function getAllPosts(opts: { includeDrafts?: boolean } = {}): Promise<Post[]> {
  // If Redis is down or over quota, keep /blog, home, sitemap and llms.txt serving (with the
  // seed posts) instead of 500ing. The error is not cached: listDbPosts throws past unstable_cache.
  let dbPosts: Post[] = [];
  try { dbPosts = await listDbPosts(); } catch (e) { console.error("posts: Redis read failed, serving seeds only:", (e as Error).message.slice(0, 200)); }
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const seeds = SEED_POSTS.filter((p) => !dbSlugs.has(p.slug));
  const all = [...dbPosts, ...seeds].filter((p) => opts.includeDrafts || p.status === "published");
  return all.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

const getDbPostCached = unstable_cache(
  (slug: string) => db.get<Post>(key(slug)),
  ["db-post"],
  { revalidate: POSTS_TTL, tags: [POSTS_TAG] }
);

export async function getPost(slug: string, includeDrafts = false): Promise<Post | null> {
  const p = (await getDbPostCached(slug)) || SEED_POSTS.find((s) => s.slug === slug) || null;
  if (!p) return null;
  if (!includeDrafts && p.status !== "published") return null;
  return p;
}

export async function savePost(p: Post) {
  p.slug = p.slug ? slugify(p.slug) : slugify(p.title);
  p.updatedAt = new Date().toISOString();
  await db.set(key(p.slug), p);
  await db.sadd(INDEX, p.slug);
  bustPosts();
  return p;
}

export async function deletePost(slug: string) {
  await db.del(key(slug));
  await db.srem(INDEX, slug);
  bustPosts();
}

/** Drop the cached post reads after a write. No-op outside a request scope (e.g. during a render). */
function bustPosts() {
  try { revalidateTag(POSTS_TAG, "max"); } catch {}
}

export async function postExists(slug: string) {
  return Boolean(await getDbPostCached(slug)) || SEED_POSTS.some((s) => s.slug === slug);
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
  /** Visitor session id (cs_vid cookie) that converted, when known. */
  vid?: string;
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
  /** Owner's WhatsApp number for lead alerts (digits with country code). Overrides OWNER_WHATSAPP. */
  ownerWhatsapp?: string;
};

export async function getSettings(): Promise<Settings> {
  return (await db.get<Settings>("settings")) || { autoPublishTrends: true, trendGeo: "IN" };
}
export async function saveSettings(s: Settings) {
  await db.set("settings", s);
}
