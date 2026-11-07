import { createSign } from "crypto";

/**
 * Google service-account auth without extra dependencies.
 * Set GOOGLE_SERVICE_ACCOUNT_JSON to the service account JSON (raw or base64).
 * The same account must be added as an Owner in Search Console for the property.
 */

type ServiceAccount = { client_email: string; private_key: string; token_uri?: string };

export function serviceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const text = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const j = JSON.parse(text) as ServiceAccount;
    if (!j.client_email || !j.private_key) return null;
    return j;
  } catch {
    return null;
  }
}

export const hasGoogleAuth = () => Boolean(serviceAccount());

const b64url = (s: string | Buffer) => Buffer.from(s).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

const cache = new Map<string, { token: string; exp: number }>();

/** OAuth2 access token for the given scopes via a signed JWT (RS256). Cached until shortly before expiry. */
export async function googleAccessToken(scopes: string[]): Promise<string | null> {
  const sa = serviceAccount();
  if (!sa) return null;
  const key = scopes.join(" ");
  const hit = cache.get(key);
  if (hit && hit.exp > Date.now() + 60_000) return hit.token;

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({ iss: sa.client_email, scope: key, aud: sa.token_uri || "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const sig = b64url(signer.sign(sa.private_key));
  const assertion = `${header}.${claim}.${sig}`;

  const res = await fetch(sa.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!res.ok) return null;
  const j = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!j.access_token) return null;
  cache.set(key, { token: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 });
  return j.access_token;
}
