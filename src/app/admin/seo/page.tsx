import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getGscSnapshot } from "@/lib/gsc";
import { indexLog, indexNowKey } from "@/lib/indexing";
import { hasGoogleAuth } from "@/lib/google";
import { hasAiWriter } from "@/lib/llm";
import { coverProvider } from "@/lib/coverGen";
import SeoPanel from "@/components/admin/SeoPanel";

export const dynamic = "force-dynamic";

export default async function SeoAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [snapshot, log] = await Promise.all([getGscSnapshot(), indexLog(60)]);
  const config = { google: hasGoogleAuth(), indexnow: Boolean(indexNowKey()), ai: hasAiWriter(), covers: coverProvider() };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Search &amp; indexing</h1>
        <p className="text-muted text-sm">Search Console keyword opportunities, one-click keyword articles, and instant indexing pings for every published URL.</p>
      </div>
      <SeoPanel snapshot={snapshot} log={log} config={config} />
    </div>
  );
}
