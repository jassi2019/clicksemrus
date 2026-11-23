import { Redis } from "@upstash/redis";
import { revalidateTag, revalidatePath } from "next/cache";
import { POSTS_TAG } from "./posts";

/**
 * One-way merge from the previous Upstash database (UPSTASH_OLD_REDIS_REST_URL/TOKEN) into the
 * live one. Only keys missing in the live DB are copied, so it is idempotent and safe to run daily:
 * while the old DB is still over its monthly quota every command throws and the run is skipped;
 * once the quota resets the old posts, settings, content overrides, covers and leads come back.
 * Both clients use raw strings (no auto JSON) so values are copied byte-for-byte.
 */
const PRIORITY = ["posts:index", "settings", "post:", "content:", "cover:", "reviews", "leads", "lead:", "builder:", "wa:", "index:", "gsc:"];

function client(url?: string, token?: string) {
  return url && token ? new Redis({ url, token, automaticDeserialization: false, cache: "default" }) : null;
}

export function hasOldRedis() {
  return Boolean(process.env.UPSTASH_OLD_REDIS_REST_URL && process.env.UPSTASH_OLD_REDIS_REST_TOKEN);
}

export async function mergeOldRedis(opts: { maxKeys?: number; budgetMs?: number } = {}) {
  const old = client(process.env.UPSTASH_OLD_REDIS_REST_URL, process.env.UPSTASH_OLD_REDIS_REST_TOKEN);
  const live = client(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL, process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN);
  if (!old || !live) return { status: "not configured" as const };
  const started = Date.now();
  const maxKeys = opts.maxKeys ?? 400;
  const budgetMs = opts.budgetMs ?? 60_000;

  let keys: string[];
  try {
    keys = await old.keys("*");
  } catch (e) {
    return { status: "old db unavailable" as const, error: (e as Error).message.slice(0, 160) };
  }
  const rank = (k: string) => { const i = PRIORITY.findIndex((p) => k.startsWith(p)); return i === -1 ? PRIORITY.length : i; };
  keys.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));

  let copied = 0, skipped = 0, failed = 0, postsCopied = 0;
  const done: string[] = [];
  for (const k of keys) {
    if (copied >= maxKeys || Date.now() - started > budgetMs) break;
    try {
      if (await live.exists(k)) { skipped++; continue; }
      const type = await old.type(k);
      if (type === "string") {
        const v = await old.get<string>(k);
        if (v != null) await live.set(k, v);
      } else if (type === "set") {
        const m = await old.smembers(k);
        if (m.length) await live.sadd(k, m[0], ...m.slice(1));
      } else if (type === "hash") {
        const h = await old.hgetall<Record<string, string>>(k);
        if (h && Object.keys(h).length) await live.hset(k, h);
      } else if (type === "list") {
        const l = await old.lrange<string>(k, 0, -1);
        if (l.length) await live.rpush(k, l[0], ...l.slice(1));
      } else { skipped++; continue; }
      copied++;
      if (k.startsWith("post:")) postsCopied++;
      if (done.length < 40) done.push(k);
    } catch (e) {
      failed++;
      if (failed > 5) return { status: "aborted" as const, copied, skipped, failed, error: (e as Error).message.slice(0, 160) };
    }
  }
  // posts:index may already exist in the live DB (new cron posts); union the old slugs into it.
  try {
    const oldSlugs = await old.smembers("posts:index");
    if (oldSlugs.length) await live.sadd("posts:index", oldSlugs[0], ...oldSlugs.slice(1));
  } catch {}
  if (copied) {
    try { revalidateTag(POSTS_TAG, "max"); } catch {}
    try { revalidatePath("/"); revalidatePath("/blog"); revalidatePath("/sitemap.xml"); } catch {}
  }
  return { status: "ok" as const, total: keys.length, copied, postsCopied, skipped, failed, remaining: Math.max(0, keys.length - copied - skipped), sample: done };
}
