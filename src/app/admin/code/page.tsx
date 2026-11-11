import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { GH_BRANCH, GH_REPO, ghConfigured, vercelConfigured } from "@/lib/github";
import CodeEditor from "@/components/admin/CodeEditor";

export const dynamic = "force-dynamic";

export default async function CodeAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  if (!ghConfigured()) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-display text-3xl font-bold">Code editor</h1>
          <p className="text-muted text-sm">Edit the site&apos;s source files from the admin. Every save becomes a commit on GitHub, and Vercel deploys it automatically.</p>
        </div>
        <div className="card p-6 !transform-none space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><KeyRound size={18} className="text-brand" /> One-time setup: connect GitHub</h2>
          <p className="text-sm text-muted">The editor needs a GitHub token with permission to read and write files in <span className="font-mono">{GH_REPO}</span>.</p>
          <ol className="text-sm space-y-3 list-decimal pl-5">
            <li>
              On GitHub open <strong>Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token</strong>
              {" "}(<span className="font-mono text-xs">github.com/settings/personal-access-tokens/new</span>).
            </li>
            <li>Name it <em>clicksemrus admin editor</em>, pick an expiry (one year is fine), and under <strong>Repository access</strong> choose <strong>Only select repositories → {GH_REPO}</strong>.</li>
            <li>Under <strong>Permissions → Repository permissions</strong> set <strong>Contents: Read and write</strong>. Metadata (read) is added automatically. Nothing else is needed.</li>
            <li>Generate the token and copy it (it starts with <span className="font-mono">github_pat_</span>).</li>
            <li>
              In Vercel open the project → <strong>Settings → Environment Variables</strong> and add <span className="font-mono">GITHUB_TOKEN</span> with that value (Production, Preview and Development).
              Optional: <span className="font-mono">GITHUB_REPO</span> (default <span className="font-mono">{GH_REPO}</span>) and <span className="font-mono">GITHUB_BRANCH</span> (default <span className="font-mono">{GH_BRANCH}</span>).
            </li>
            <li>Redeploy once (Deployments → ⋯ → Redeploy) so the new variable is picked up, then reload this page.</li>
          </ol>
          <div className="rounded-xl border border-border bg-surface-2/60 p-4 text-sm">
            <p className="font-semibold">Optional: live deploy status</p>
            <p className="text-muted mt-1">
              To see the Vercel build result after each save, also add <span className="font-mono">VERCEL_TOKEN</span> (Vercel → Account Settings → Tokens), <span className="font-mono">VERCEL_PROJECT_ID</span> (Project → Settings → General → Project ID) and, for a team account, <span className="font-mono">VERCEL_TEAM_ID</span> (Team → Settings → General → Team ID). Without them the editor just reports that the commit was pushed.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return <CodeEditor repo={GH_REPO} branch={GH_BRANCH} vercel={vercelConfigured()} />;
}
