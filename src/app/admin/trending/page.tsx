import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { fetchTrends, classify } from "@/lib/trending";
import TrendPanel from "@/components/admin/TrendPanel";
import { hasAiWriter, aiProviderLabel } from "@/lib/llm";

export const dynamic = "force-dynamic";

export default async function TrendingAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const trends = await fetchTrends("IN");
  const rows = trends.map((t) => ({ title: t.title, traffic: t.traffic, kind: classify(t).kind, category: classify(t).category, sources: t.news.map((n) => n.source).slice(0, 3), picture: t.picture }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Trending engine</h1>
        <p className="text-muted text-sm">Live from Google Trends India. Generate a blog post for any topic with one click. {hasAiWriter() ? `AI writer: on (${aiProviderLabel()}).` : "AI writer: off (template writer in use). Add GEMINI_API_KEY (free), GROQ_API_KEY or ANTHROPIC_API_KEY in Vercel to enable."}</p>
      </div>
      <TrendPanel rows={rows} />
    </div>
  );
}
