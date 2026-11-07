import { Redis } from "@upstash/redis";

/**
 * Storage adapter.
 * - If Upstash / Vercel KV env vars exist -> persistent Redis.
 * - Otherwise -> in-memory store (works locally and on Vercel, but resets on cold start).
 * Add "Upstash Redis" from the Vercel Storage tab to make everything persistent.
 */
export type Store = {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  hincrby(key: string, field: string, by: number): Promise<void>;
  hgetall(key: string): Promise<Record<string, number>>;
  sadd(key: string, member: string): Promise<void>;
  srem(key: string, member: string): Promise<void>;
  smembers(key: string): Promise<string[]>;
  lpush(key: string, value: unknown): Promise<void>;
  lrange<T>(key: string, start: number, stop: number): Promise<T[]>;
  ltrim(key: string, start: number, stop: number): Promise<void>;
  /** Atomic counter that expires `ttlSec` after its first increment. Returns the new value. */
  incr(key: string, ttlSec: number): Promise<number>;
};

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const isPersistent = Boolean(url && token);

function parse<T>(v: unknown): T | null {
  if (v == null) return null;
  if (typeof v === "string") {
    try { return JSON.parse(v) as T; } catch { return v as unknown as T; }
  }
  return v as T;
}

function redisStore(): Store {
  // cache: "default" keeps Redis reads from marking every route dynamic (the SDK defaults to no-store on Next).
  const r = new Redis({ url: url!, token: token!, cache: "default" });
  return {
    get: async (k) => parse(await r.get(k)),
    set: async (k, v) => { await r.set(k, JSON.stringify(v)); },
    del: async (k) => { await r.del(k); },
    hincrby: async (k, f, by) => { await r.hincrby(k, f, by); },
    hgetall: async (k) => {
      const o = (await r.hgetall<Record<string, string | number>>(k)) || {};
      return Object.fromEntries(Object.entries(o).map(([a, b]) => [a, Number(b)]));
    },
    sadd: async (k, m) => { await r.sadd(k, m); },
    srem: async (k, m) => { await r.srem(k, m); },
    smembers: async (k) => (await r.smembers(k)) as string[],
    lpush: async (k, v) => { await r.lpush(k, JSON.stringify(v)); },
    lrange: async (k, a, b) => ((await r.lrange(k, a, b)) as unknown[]).map((x) => parse(x)) as never,
    ltrim: async (k, a, b) => { await r.ltrim(k, a, b); },
    incr: async (k, ttl) => {
      const n = await r.incr(k);
      if (n === 1) await r.expire(k, ttl);
      return n;
    },
  };
}

type Mem = { kv: Map<string, unknown>; h: Map<string, Map<string, number>>; s: Map<string, Set<string>>; l: Map<string, unknown[]>; c: Map<string, { n: number; exp: number }> };
const g = globalThis as unknown as { __cs_mem?: Mem };
const mem: Mem = g.__cs_mem || (g.__cs_mem = { kv: new Map(), h: new Map(), s: new Map(), l: new Map(), c: new Map() });

function memStore(): Store {
  return {
    get: async (k) => (mem.kv.has(k) ? (structuredClone(mem.kv.get(k)) as never) : null),
    set: async (k, v) => { mem.kv.set(k, structuredClone(v)); },
    del: async (k) => { mem.kv.delete(k); },
    hincrby: async (k, f, by) => {
      const h = mem.h.get(k) || new Map<string, number>();
      h.set(f, (h.get(f) || 0) + by);
      mem.h.set(k, h);
    },
    hgetall: async (k) => Object.fromEntries(mem.h.get(k) || []),
    sadd: async (k, m) => { const s = mem.s.get(k) || new Set<string>(); s.add(m); mem.s.set(k, s); },
    srem: async (k, m) => { mem.s.get(k)?.delete(m); },
    smembers: async (k) => Array.from(mem.s.get(k) || []),
    lpush: async (k, v) => { const l = mem.l.get(k) || []; l.unshift(structuredClone(v)); mem.l.set(k, l); },
    lrange: async (k, a, b) => { const l = mem.l.get(k) || []; return structuredClone(l.slice(a, b === -1 ? undefined : b + 1)) as never; },
    ltrim: async (k, a, b) => { const l = mem.l.get(k) || []; mem.l.set(k, l.slice(a, b === -1 ? undefined : b + 1)); },
    incr: async (k, ttl) => {
      const now = Date.now();
      const cur = mem.c.get(k);
      const next = cur && cur.exp > now ? { n: cur.n + 1, exp: cur.exp } : { n: 1, exp: now + ttl * 1000 };
      mem.c.set(k, next);
      return next.n;
    },
  };
}

export const db: Store = isPersistent ? redisStore() : memStore();
