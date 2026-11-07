import { db } from "./db";
import { SITE } from "./site";
import { googleAccessToken, hasGoogleAuth } from "./google";

/**
 * Push new/updated URLs to search engines the moment they are published.
 *  - Google Indexing API (needs GOOGLE_SERVICE_ACCOUNT_JSON; the service account must be an Owner in Search Console)
 *  - IndexNow (Bing, Yandex, Seznam, Naver): needs INDEXNOW_KEY, served from /indexnow/key
 * Every attempt is logged to Redis (index:log) so the admin panel can show what happened.
 */

export type IndexLogEntry = { at: string; url: string; google: string; indexnow: string };
const LOG = "index:log";

export function indexNowKey() {
  return (process.env.INDEXNOW_KEY || "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 128);
}

async function googleNotify(url: string): Promise<string> {
  if (!hasGoogleAuth()) return "not configured";
  const token = await googleAccessToken(["https://www.googleapis.com/auth/indexing"]);
  if (!token) return "auth failed";
  const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });
  if (res.ok) return "ok";
  const t = await res.text().catch(() => "");
  return `error ${res.status}: ${t.slice(0, 140)}`;
}

async function indexNowNotify(urls: string[]): Promise<string> {
  const key = indexNowKey();
  if (!key) return "not configured";
  const host = new URL(SITE.url).host;
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, urlList: urls }),
  });
  return res.ok || res.status === 202 ? "ok" : `error ${res.status}`;
}

/** Notify search engines about URLs (absolute or site-relative). Never throws. */
export async function notifyIndex(paths: string[]): Promise<IndexLogEntry[]> {
  const urls = Array.from(new Set(paths.map((p) => (p.startsWith("http") ? p : `${SITE.url}${p.startsWith("/") ? p : `/${p}`}`))));
  if (!urls.length) return [];
  const entries: IndexLogEntry[] = [];
  let indexnow = "skipped";
  try { indexnow = await indexNowNotify(urls); } catch (e) { indexnow = `error: ${(e as Error).message.slice(0, 80)}`; }
  for (const url of urls) {
    let google = "skipped";
    try { google = await googleNotify(url); } catch (e) { google = `error: ${(e as Error).message.slice(0, 80)}`; }
    const entry = { at: new Date().toISOString(), url, google, indexnow };
    entries.push(entry);
    try { await db.lpush(LOG, entry); await db.ltrim(LOG, 0, 199); } catch {}
  }
  return entries;
}

/** Submit the sitemap to Google Search Console (needs the service account as Owner). */
export async function submitSitemap(): Promise<string> {
  if (!hasGoogleAuth()) return "not configured";
  const token = await googleAccessToken(["https://www.googleapis.com/auth/webmasters"]);
  if (!token) return "auth failed";
  const siteUrl = process.env.GSC_SITE_URL || `${SITE.url}/`;
  const feed = `${SITE.url}/sitemap.xml`;
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(feed)}`, { method: "PUT", headers: { authorization: `Bearer ${token}` } });
  return res.ok ? "ok" : `error ${res.status}: ${(await res.text().catch(() => "")).slice(0, 120)}`;
}

export async function indexLog(limit = 50): Promise<IndexLogEntry[]> {
  try { return await db.lrange<IndexLogEntry>(LOG, 0, limit - 1); } catch { return []; }
}

/** Google's URL Inspection API: live index status for one URL (read-only, needs Search Console access). */
export async function inspectUrl(url: string): Promise<{ verdict: string; coverage: string; lastCrawl: string } | null> {
  if (!hasGoogleAuth()) return null;
  const token = await googleAccessToken(["https://www.googleapis.com/auth/webmasters.readonly"]);
  if (!token) return null;
  const siteUrl = process.env.GSC_SITE_URL || `${SITE.url}/`;
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl, languageCode: "en-IN" }),
  });
  if (!res.ok) return null;
  const j = (await res.json()) as { inspectionResult?: { indexStatusResult?: { verdict?: string; coverageState?: string; lastCrawlTime?: string } } };
  const r = j.inspectionResult?.indexStatusResult;
  return { verdict: r?.verdict || "UNKNOWN", coverage: r?.coverageState || "", lastCrawl: r?.lastCrawlTime || "" };
}
