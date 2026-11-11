import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { GH_BRANCH, GH_REPO, GhError, commitMessage, fileCommits, getFile, ghConfigured, isEditablePath, listEditableFiles, putFile, vercelDeployStatus } from "@/lib/github";

const unauthorized = () => NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
const fail = (e: unknown) => {
  const status = e instanceof GhError ? e.status : 500;
  return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Request failed" }, { status: status >= 400 && status < 600 ? status : 500 });
};

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return unauthorized();
  const q = req.nextUrl.searchParams;
  if (q.get("deploy")) return NextResponse.json({ ok: true, deploy: await vercelDeployStatus() });
  if (!ghConfigured()) return NextResponse.json({ ok: false, error: "GITHUB_TOKEN is not set" }, { status: 503 });
  try {
    const path = q.get("path") || "";
    if (q.get("list")) return NextResponse.json({ ok: true, repo: GH_REPO, branch: GH_BRANCH, files: await listEditableFiles() });
    if (!isEditablePath(path)) return NextResponse.json({ ok: false, error: "This file cannot be edited from the admin" }, { status: 403 });
    if (q.get("history")) return NextResponse.json({ ok: true, commits: await fileCommits(path) });
    const f = await getFile(path);
    return NextResponse.json({ ok: true, ...f });
  } catch (e) {
    return fail(e);
  }
}

type Body = { action?: unknown; path?: unknown; content?: unknown; sha?: unknown };

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return unauthorized();
  if (!ghConfigured()) return NextResponse.json({ ok: false, error: "GITHUB_TOKEN is not set" }, { status: 503 });
  const b = (await req.json().catch(() => ({}))) as Body;
  const path = typeof b.path === "string" ? b.path : "";
  if (!isEditablePath(path)) return NextResponse.json({ ok: false, error: "This file cannot be edited from the admin" }, { status: 403 });
  try {
    if (b.action === "revert") {
      // Restore the file to the version in the commit before the latest one that touched it.
      const commits = await fileCommits(path, 2);
      if (commits.length < 2) return NextResponse.json({ ok: false, error: "No previous version of this file in the history" }, { status: 404 });
      const [current, previous] = await Promise.all([getFile(path), getFile(path, commits[1].sha)]);
      if (current.content === previous.content) return NextResponse.json({ ok: false, error: "The previous version is identical to the current one" }, { status: 409 });
      const r = await putFile(path, previous.content, current.sha, `admin: revert ${path} to ${commits[1].sha.slice(0, 7)}\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`);
      return NextResponse.json({ ok: true, content: previous.content, sha: r.sha, commitSha: r.commitSha, url: r.url });
    }
    const content = typeof b.content === "string" ? b.content : null;
    const sha = typeof b.sha === "string" ? b.sha : "";
    if (content === null || !sha) return NextResponse.json({ ok: false, error: "Missing content or sha" }, { status: 400 });
    if (content.length > 1_000_000) return NextResponse.json({ ok: false, error: "File is too large" }, { status: 413 });
    const r = await putFile(path, content, sha, commitMessage(path));
    return NextResponse.json({ ok: true, sha: r.sha, commitSha: r.commitSha, url: r.url });
  } catch (e) {
    if (e instanceof GhError && e.status === 409) return NextResponse.json({ ok: false, error: "The file changed on GitHub since you opened it. Reload it and apply your edit again." }, { status: 409 });
    return fail(e);
  }
}
