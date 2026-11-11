import { cache } from "react";
import { db } from "./db";
import { normalizeLayout, type PageLayout } from "./builder";

/**
 * Redis storage for page-builder layouts.
 * - `layout:<slug>`  -> PageLayout
 * - `layouts:index`  -> set of slugs
 */
const key = (slug: string) => `layout:${slug}`;
const INDEX = "layouts:index";

/** Memoised per request so a page and its metadata share one Redis read. */
export const getLayout = cache(async (slug: string): Promise<PageLayout | null> => {
  try {
    const raw = await db.get<unknown>(key(slug));
    if (!raw) return null;
    const l = normalizeLayout(raw);
    // normalizeLayout stamps updatedAt; keep the stored one.
    if (l && typeof (raw as { updatedAt?: unknown }).updatedAt === "string") l.updatedAt = (raw as { updatedAt: string }).updatedAt;
    return l;
  } catch {
    return null;
  }
});

/** Published layout only; what public routes use. */
export async function getPublishedLayout(slug: string): Promise<PageLayout | null> {
  const l = await getLayout(slug);
  return l && l.status === "published" ? l : null;
}

export async function saveLayout(layout: PageLayout): Promise<PageLayout> {
  await db.set(key(layout.slug), layout);
  await db.sadd(INDEX, layout.slug);
  return layout;
}

export async function deleteLayout(slug: string): Promise<void> {
  await db.del(key(slug));
  await db.srem(INDEX, slug);
}

export type LayoutSummary = Pick<PageLayout, "slug" | "title" | "status" | "updatedAt"> & { blocks: number };

export async function listLayouts(): Promise<LayoutSummary[]> {
  let slugs: string[] = [];
  try {
    slugs = await db.smembers(INDEX);
  } catch {
    return [];
  }
  const all = await Promise.all(slugs.map((s) => getLayout(s)));
  return all
    .filter((l): l is PageLayout => Boolean(l))
    .map((l) => ({ slug: l.slug, title: l.title, status: l.status, updatedAt: l.updatedAt, blocks: l.blocks.length }))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}
