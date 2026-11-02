import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "cs_admin";
const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "clicksemrus-dev-secret";

export function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function makeToken() {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const p = `admin.${exp}`;
  return `${p}.${sign(p)}`;
}

export function verifyToken(token?: string | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [u, exp, sig] = parts;
  const expected = sign(`${u}.${exp}`);
  if (sig.length !== expected.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  return Number(exp) > Date.now();
}

export function checkPassword(pw: string) {
  const real = process.env.ADMIN_PASSWORD || "admin123";
  if (pw.length !== real.length) return false;
  return timingSafeEqual(Buffer.from(pw), Buffer.from(real));
}

export async function isAdmin() {
  const c = await cookies();
  return verifyToken(c.get(ADMIN_COOKIE)?.value);
}
