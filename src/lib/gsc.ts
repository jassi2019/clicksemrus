import { db } from "./db";
import { SITE } from "./site";
import { googleAccessToken, hasGoogleAuth } from "./google";

/**
 * Search Console intelligence.
 * Pulls the last 28 days of query/page data and turns it into keyword opportunities:
 *  - striking distance: queries ranking 4-30 with impressions (one push away from page one)
 *  - rising: queries whose impressions grew in the last 7 days vs the previous 21
 *  - uncovered: queries landing on the blog index or home instead of a dedicated post
 * Stored in Redis (gsc:opportunities) for the cron writer and the admin panel.
 */

export type Opportunity = {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  recentImpressions: number;
  kind: "striking" | "rising" | "uncovered";
  score: number;
};

export type GscSnapshot = { at: string; days: number; totalClicks: number; totalImpressions: number; opportunities: Opportunity[]; topQueries: Opportunity[] };

const KEY = "gsc:opportunities";
const SCOPE = ["https://www.googleapis.com/auth/webmasters.readonly"];

type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

async function query(token: string, body: Record<string, unknown>): Promise<Row[]> {
  const siteUrl = process.env.GSC_SITE_URL || `${SITE.url}/`;
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GSC ${res.status}: ${(await res.text()).slice(0, 160)}`);
  const j = (await res.json()) as { rows?: Row[] };
  return j.rows || [];
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

export async function refreshGsc(): Promise<GscSnapshot | null> {
  if (!hasGoogleAuth()) return null;
  const token = await googleAccessToken(SCOPE);
  if (!token) return null;
  const end = new Date(Date.now() - 2 * 86400e3); // GSC data lags ~2 days
  const start28 = new Date(end.getTime() - 27 * 86400e3);
  const start7 = new Date(end.getTime() - 6 * 86400e3);

  const [all, recent] = await Promise.all([
    query(token, { startDate: iso(start28), endDate: iso(end), dimensions: ["query", "page"], rowLimit: 1000, dataState: "all" }),
    query(token, { startDate: iso(start7), endDate: iso(end), dimensions: ["query"], rowLimit: 1000, dataState: "all" }),
  ]);
  const recentMap = new Map(recent.map((r) => [r.keys[0], r.impressions]));
  const totalClicks = all.reduce((a, r) => a + r.clicks, 0);
  const totalImpressions = all.reduce((a, r) => a + r.impressions, 0);

  const opps: Opportunity[] = [];
  for (const r of all) {
    const [q, page] = r.keys;
    if (!q || /clicksemrus|click semrus/i.test(q)) continue; // skip brand queries
    const recentImp = recentMap.get(q) || 0;
    const prior = Math.max(0, r.impressions - recentImp) / 3; // per-week average of prior 3 weeks
    const base = { query: q, page, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position, recentImpressions: recentImp };
    const isHub = /\/blog\/?$|\/blog\/category\/|^https?:\/\/[^/]+\/?$/.test(page);
    if (isHub && r.impressions >= 10) opps.push({ ...base, kind: "uncovered", score: r.impressions * 1.5 + recentImp });
    else if (r.position >= 4 && r.position <= 30 && r.impressions >= 15) opps.push({ ...base, kind: "striking", score: r.impressions * (1 / Math.max(1, r.position / 8)) + recentImp });
    else if (recentImp >= 8 && recentImp > prior * 1.6) opps.push({ ...base, kind: "rising", score: recentImp * 2 });
  }
  opps.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const unique = opps.filter((o) => (seen.has(o.query) ? false : (seen.add(o.query), true))).slice(0, 80);
  const topQueries = [...all].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 25).map((r) => ({
    query: r.keys[0], page: r.keys[1], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position, recentImpressions: recentMap.get(r.keys[0]) || 0, kind: "striking" as const, score: 0,
  }));
  const snap: GscSnapshot = { at: new Date().toISOString(), days: 28, totalClicks, totalImpressions, opportunities: unique, topQueries };
  await db.set(KEY, snap);
  return snap;
}

export async function getGscSnapshot(): Promise<GscSnapshot | null> {
  try { return await db.get<GscSnapshot>(KEY); } catch { return null; }
}
