/**
 * GitHub Contents API + Vercel deployments API helpers for the admin code editor.
 * Server-only. Env: GITHUB_TOKEN (required), GITHUB_REPO, GITHUB_BRANCH, VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID.
 */
export const GH_REPO = process.env.GITHUB_REPO || "jassi2019/clicksemrus";
export const GH_BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN || "";

export const ghConfigured = () => Boolean(TOKEN);
export const vercelConfigured = () => Boolean(process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID);

/* ---------------------------------------------------------------- allowed paths */
const EXACT = new Set(["src/lib/site.ts", "src/lib/pageContent.ts", "src/app/globals.css", "README.md"]);
const PREFIXES = ["src/app/", "src/components/"];
const EXT = /\.(tsx?|css|md|json)$/;

/** Only these files can be read or written from the admin. */
export function isEditablePath(p: string): boolean {
  if (!p || p.startsWith("/") || p.includes("..") || p.includes("\\") || p.length > 300) return false;
  if (EXACT.has(p)) return true;
  return PREFIXES.some((pre) => p.startsWith(pre)) && EXT.test(p);
}

/* ---------------------------------------------------------------- GitHub */
class GhError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
export { GhError };

async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!TOKEN) throw new GhError(503, "GITHUB_TOKEN is not set");
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "clicksemrus-admin",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { message?: string };
    throw new GhError(res.status, j.message || `GitHub API ${res.status}`);
  }
  return (await res.json()) as T;
}

export type RepoFile = { path: string; size: number; sha: string };

export async function listEditableFiles(): Promise<RepoFile[]> {
  const t = await gh<{ tree: { path: string; type: string; size?: number; sha: string }[]; truncated: boolean }>(`/repos/${GH_REPO}/git/trees/${encodeURIComponent(GH_BRANCH)}?recursive=1`);
  return t.tree
    .filter((n) => n.type === "blob" && isEditablePath(n.path))
    .map((n) => ({ path: n.path, size: n.size ?? 0, sha: n.sha }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

type ContentsResponse = { content?: string; encoding?: string; sha: string; size: number; download_url?: string | null };

export async function getFile(path: string, ref = GH_BRANCH): Promise<{ path: string; content: string; sha: string; size: number }> {
  const f = await gh<ContentsResponse>(`/repos/${GH_REPO}/contents/${encodePath(path)}?ref=${encodeURIComponent(ref)}`);
  let content = "";
  if (f.content && f.encoding === "base64") content = Buffer.from(f.content.replace(/\n/g, ""), "base64").toString("utf8");
  else if (f.download_url) content = await (await fetch(f.download_url, { cache: "no-store" })).text();
  return { path, content, sha: f.sha, size: f.size };
}

export async function putFile(path: string, content: string, sha: string, message: string): Promise<{ sha: string; commitSha: string; url: string }> {
  const r = await gh<{ content: { sha: string }; commit: { sha: string; html_url: string } }>(`/repos/${GH_REPO}/contents/${encodePath(path)}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: Buffer.from(content, "utf8").toString("base64"), sha, branch: GH_BRANCH }),
  });
  return { sha: r.content.sha, commitSha: r.commit.sha, url: r.commit.html_url };
}

export type FileCommit = { sha: string; message: string; date: string; url: string; author: string };

export async function fileCommits(path: string, n = 6): Promise<FileCommit[]> {
  const list = await gh<{ sha: string; html_url: string; commit: { message: string; author?: { date?: string; name?: string } } }[]>(
    `/repos/${GH_REPO}/commits?path=${encodePath(path)}&sha=${encodeURIComponent(GH_BRANCH)}&per_page=${n}`
  );
  return list.map((c) => ({ sha: c.sha, message: c.commit.message.split("\n")[0], date: c.commit.author?.date ?? "", url: c.html_url, author: c.commit.author?.name ?? "" }));
}

function encodePath(p: string) {
  return p.split("/").map(encodeURIComponent).join("/");
}

export const commitMessage = (path: string) => `admin: edit ${path}\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`;

/* ---------------------------------------------------------------- Vercel */
export type DeployStatus = {
  configured: boolean;
  state?: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED" | string;
  url?: string;
  createdAt?: number;
  commitSha?: string;
  commitMessage?: string;
  inspectorUrl?: string;
  error?: string;
};

export async function vercelDeployStatus(): Promise<DeployStatus> {
  const token = process.env.VERCEL_TOKEN;
  const project = process.env.VERCEL_PROJECT_ID;
  const team = process.env.VERCEL_TEAM_ID;
  if (!token || !project) return { configured: false };
  const q = new URLSearchParams({ projectId: project, limit: "1" });
  if (team) q.set("teamId", team);
  try {
    const res = await fetch(`https://api.vercel.com/v6/deployments?${q}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) return { configured: true, error: `Vercel API ${res.status}` };
    const j = (await res.json()) as { deployments?: { uid: string; state?: string; readyState?: string; url?: string; created?: number; createdAt?: number; inspectorUrl?: string; meta?: Record<string, string> }[] };
    const d = j.deployments?.[0];
    if (!d) return { configured: true, error: "No deployments yet" };
    return {
      configured: true,
      state: d.readyState || d.state || "UNKNOWN",
      url: d.url ? `https://${d.url}` : undefined,
      createdAt: d.createdAt ?? d.created,
      commitSha: d.meta?.githubCommitSha,
      commitMessage: d.meta?.githubCommitMessage,
      inspectorUrl: d.inspectorUrl,
    };
  } catch (e) {
    return { configured: true, error: e instanceof Error ? e.message : "Vercel request failed" };
  }
}
