import { db } from "./db";

/**
 * Image uploads from the page builder, stored in Redis as base64 chunks.
 * - `upload:<id>`      -> UploadMeta
 * - `upload:<id>:<n>`  -> base64 chunk n (kept under ~600 KB so each Redis request stays small)
 * - `uploads:index`    -> set of ids
 * Served by /api/uploads/[id] with immutable caching.
 */
export type UploadMeta = { id: string; type: string; name: string; size: number; chunks: number; createdAt: string };

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const CHUNK = 600_000;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"]);
const metaKey = (id: string) => `upload:${id}`;
const chunkKey = (id: string, n: number) => `upload:${id}:${n}`;

export const isAllowedImageType = (t: string) => ALLOWED.has(t);
export const isUploadId = (id: string) => /^[a-z0-9]{10,24}$/.test(id);

export function newUploadId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export async function saveUpload(input: { type: string; name: string; bytes: Buffer }): Promise<UploadMeta> {
  const id = newUploadId();
  const b64 = input.bytes.toString("base64");
  const chunks = Math.ceil(b64.length / CHUNK);
  for (let i = 0; i < chunks; i++) await db.set(chunkKey(id, i), b64.slice(i * CHUNK, (i + 1) * CHUNK));
  const meta: UploadMeta = { id, type: input.type, name: input.name.slice(0, 120), size: input.bytes.length, chunks, createdAt: new Date().toISOString() };
  await db.set(metaKey(id), meta);
  await db.sadd("uploads:index", id);
  return meta;
}

export async function readUpload(id: string): Promise<{ meta: UploadMeta; bytes: Buffer } | null> {
  if (!isUploadId(id)) return null;
  const meta = await db.get<UploadMeta>(metaKey(id));
  if (!meta) return null;
  const parts = await Promise.all(Array.from({ length: meta.chunks }, (_, i) => db.get<string>(chunkKey(id, i))));
  if (parts.some((p) => typeof p !== "string")) return null;
  return { meta, bytes: Buffer.from(parts.join(""), "base64") };
}

export async function deleteUpload(id: string): Promise<void> {
  const meta = await db.get<UploadMeta>(metaKey(id));
  if (meta) for (let i = 0; i < meta.chunks; i++) await db.del(chunkKey(id, i));
  await db.del(metaKey(id));
  await db.srem("uploads:index", id);
}

export async function listUploads(): Promise<UploadMeta[]> {
  const ids = await db.smembers("uploads:index").catch(() => [] as string[]);
  const metas = await Promise.all(ids.map((id) => db.get<UploadMeta>(metaKey(id))));
  return metas.filter((m): m is UploadMeta => Boolean(m)).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
