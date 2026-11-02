import { db } from "./db";

export type Hit = { path: string; ref?: string; utm?: string; device?: string; country?: string };

export const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

export async function recordHit(h: Hit) {
  const today = dayKey();
  const path = h.path.split("?")[0].slice(0, 200);
  await Promise.all([
    db.hincrby("views:daily", today, 1),
    db.hincrby(`views:paths:${today}`, path, 1),
    db.hincrby("views:paths:all", path, 1),
    db.hincrby("views:refs", (h.ref || "direct").slice(0, 120), 1),
    db.hincrby("views:devices", h.device || "unknown", 1),
    db.hincrby("views:countries", h.country || "unknown", 1),
    h.utm ? db.hincrby("views:utm", h.utm.slice(0, 120), 1) : Promise.resolve(),
  ]);
}

export async function recordEvent(name: string) {
  await Promise.all([db.hincrby("events", name, 1), db.hincrby(`events:${dayKey()}`, name, 1)]);
}

export async function getStats(days = 30) {
  const daily = await db.hgetall("views:daily");
  const series: { date: string; views: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = dayKey(new Date(Date.now() - i * 864e5));
    series.push({ date: key, views: daily[key] || 0 });
  }
  const top = (o: Record<string, number>, n = 10) =>
    Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
  const [paths, refs, devices, countries, events, utm] = await Promise.all([
    db.hgetall("views:paths:all"),
    db.hgetall("views:refs"),
    db.hgetall("views:devices"),
    db.hgetall("views:countries"),
    db.hgetall("events"),
    db.hgetall("views:utm"),
  ]);
  const total = Object.values(daily).reduce((a, b) => a + b, 0);
  const last7 = series.slice(-7).reduce((a, b) => a + b.views, 0);
  const prev7 = series.slice(-14, -7).reduce((a, b) => a + b.views, 0);
  return {
    series,
    total,
    last7,
    prev7,
    today: daily[dayKey()] || 0,
    paths: top(paths),
    refs: top(refs),
    devices: top(devices, 5),
    countries: top(countries, 8),
    events,
    utm: top(utm),
  };
}
