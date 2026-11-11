import { db } from "./db";
import { dayKey } from "./analytics";
import { listLeads } from "./posts";

/** One browser session, identified by the first-party `cs_vid` cookie (1 year). */
export type Visitor = {
  vid: string;
  firstSeen: string;
  lastSeen: string;
  /** Day key of lastSeen, used to count unique visitors per day. */
  lastDay?: string;
  pages: number;
  lastPath: string;
  referrer: string;
  utm: string;
  device: string;
  country: string;
  city: string;
  screen?: number;
  language?: string;
  leadName?: string;
};

export type VisitEvent = { at: string; vid: string; path: string; country: string; city?: string; device: string; referrer: string; utm?: string };

export type VisitInput = {
  vid: string;
  path: string;
  referrer: string;
  utm: string;
  device: string;
  country: string;
  city: string;
  screen?: number;
  language?: string;
};

const VID_RE = /^[a-z0-9_-]{8,64}$/i;
export const isValidVid = (v: unknown): v is string => typeof v === "string" && VID_RE.test(v);

const key = (vid: string) => `visitor:${vid}`;
const RECENT = "visitors:recent"; // list of vids, newest first
const LOG = "visits:log";
const DAILY = "visitors:daily"; // hash day -> unique visitors

export async function getVisitor(vid: string): Promise<Visitor | null> {
  return db.get<Visitor>(key(vid));
}

export async function recordVisit(input: VisitInput): Promise<void> {
  const now = new Date().toISOString();
  const today = dayKey();
  const existing = await getVisitor(input.vid);
  const v: Visitor = existing
    ? { ...existing, lastSeen: now, lastDay: today, pages: existing.pages + 1, lastPath: input.path, device: input.device || existing.device, country: existing.country === "unknown" ? input.country : existing.country, city: existing.city || input.city }
    : {
        vid: input.vid,
        firstSeen: now,
        lastSeen: now,
        lastDay: today,
        pages: 1,
        lastPath: input.path,
        referrer: input.referrer,
        utm: input.utm,
        device: input.device,
        country: input.country,
        city: input.city,
        screen: input.screen,
        language: input.language,
      };
  const event: VisitEvent = { at: now, vid: input.vid, path: input.path, country: input.country, city: input.city || undefined, device: input.device, referrer: input.referrer, utm: input.utm || undefined };
  const jobs: Promise<unknown>[] = [db.set(key(v.vid), v), db.lpush(LOG, event), db.ltrim(LOG, 0, 499)];
  if (!existing) jobs.push(db.lpush(RECENT, v.vid), db.ltrim(RECENT, 0, 299));
  if (!existing || existing.lastDay !== today) jobs.push(db.hincrby(DAILY, today, 1));
  await Promise.all(jobs);
}

/** Mark the visitor as converted so the admin can see who the lead was. */
export async function attachLeadToVisitor(vid: string, leadName: string): Promise<void> {
  const v = await getVisitor(vid);
  if (!v) return;
  await db.set(key(vid), { ...v, leadName });
}

export type VisitorOverview = {
  generatedAt: string;
  cards: { visitorsToday: number; pageviewsToday: number; online: number; leadsToday: number };
  activity: (VisitEvent & { lead?: string })[];
  visitors: Visitor[];
};

export async function getVisitorOverview(): Promise<VisitorOverview> {
  const today = dayKey();
  const [recentVids, activity, daily, views, leads] = await Promise.all([
    db.lrange<string>(RECENT, 0, 99),
    db.lrange<VisitEvent>(LOG, 0, 79),
    db.hgetall(DAILY),
    db.hgetall("views:daily"),
    listLeads(),
  ]);
  const uniqueVids = Array.from(new Set(recentVids.filter((x): x is string => typeof x === "string")));
  const visitors = (await Promise.all(uniqueVids.map((vid) => getVisitor(vid)))).filter((v): v is Visitor => Boolean(v));
  const leadByVid = new Map<string, string>();
  for (const l of leads) if (l.vid) leadByVid.set(l.vid, l.name);
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  return {
    generatedAt: new Date().toISOString(),
    cards: {
      visitorsToday: daily[today] || 0,
      pageviewsToday: views[today] || 0,
      online: visitors.filter((v) => new Date(v.lastSeen).getTime() > fiveMinAgo).length,
      leadsToday: leads.filter((l) => l.createdAt.slice(0, 10) === today).length,
    },
    activity: activity.map((e) => ({ ...e, lead: leadByVid.get(e.vid) })),
    visitors: visitors.map((v) => ({ ...v, leadName: v.leadName || leadByVid.get(v.vid) })),
  };
}
