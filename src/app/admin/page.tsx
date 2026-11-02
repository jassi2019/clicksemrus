import Link from "next/link";
import { Eye, Users, FileText, TrendingUp, AlertTriangle, MessageCircle } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { getStats } from "@/lib/analytics";
import { getAllPosts, listLeads } from "@/lib/posts";
import { isPersistent } from "@/lib/db";
import Chart from "@/components/admin/Chart";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [stats, posts, leads] = await Promise.all([getStats(30), getAllPosts({ includeDrafts: true }), listLeads()]);
  const delta = stats.prev7 ? Math.round(((stats.last7 - stats.prev7) / stats.prev7) * 100) : 0;
  const tiles = [
    { l: "Views today", v: stats.today, i: Eye },
    { l: "Views (7 days)", v: stats.last7, i: TrendingUp, sub: stats.prev7 ? `${delta >= 0 ? "+" : ""}${delta}% vs previous 7 days` : "" },
    { l: "Leads", v: leads.length, i: Users, sub: `${leads.filter((l) => l.status === "new").length} new` },
    { l: "WhatsApp clicks", v: stats.events["whatsapp_click"] || 0, i: MessageCircle },
    { l: "Published posts", v: posts.filter((p) => p.status === "published").length, i: FileText, sub: `${posts.filter((p) => p.source === "trend").length} from trends` },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-muted text-sm">Traffic, leads and content at a glance.</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary text-sm">+ New post</Link>
      </div>
      {!isPersistent && (
        <div className="card p-4 border-yellow-500/40 bg-yellow-500/10 flex gap-3 text-sm">
          <AlertTriangle className="text-yellow-400 shrink-0" />
          <p><strong>Storage is temporary.</strong> Analytics, leads and posts reset when the server restarts. In Vercel go to Storage → Create → Upstash Redis (free) and connect it to this project; the site picks it up automatically.</p>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {tiles.map((t) => (
          <div key={t.l} className="card p-5">
            <div className="flex items-center justify-between text-muted text-xs"><span>{t.l}</span><t.i size={16} /></div>
            <p className="font-display text-3xl font-bold mt-2">{t.v.toLocaleString("en-IN")}</p>
            {t.sub && <p className="text-xs text-muted mt-1">{t.sub}</p>}
          </div>
        ))}
      </div>
      <div className="card p-5">
        <h2 className="font-semibold mb-4">Page views, last 30 days</h2>
        <Chart data={stats.series} />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { t: "Top pages", rows: stats.paths },
          { t: "Top referrers", rows: stats.refs },
          { t: "Countries", rows: stats.countries },
        ].map((b) => (
          <div key={b.t} className="card p-5">
            <h2 className="font-semibold mb-3">{b.t}</h2>
            <table className="table">
              <tbody>
                {b.rows.length === 0 && <tr><td className="text-muted">No data yet</td></tr>}
                {b.rows.map(([k, v]) => (
                  <tr key={k}><td className="truncate max-w-[200px]">{k}</td><td className="text-right font-semibold">{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-semibold mb-3">Devices</h2>
          <table className="table"><tbody>{stats.devices.map(([k, v]) => <tr key={k}><td className="capitalize">{k}</td><td className="text-right font-semibold">{v}</td></tr>)}</tbody></table>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold mb-3">Latest leads</h2>
          <table className="table">
            <tbody>
              {leads.slice(0, 5).map((l) => (
                <tr key={l.id}><td>{l.name}<br /><span className="text-muted text-xs">{l.service}</span></td><td className="text-right text-xs text-muted">{new Date(l.createdAt).toLocaleDateString("en-IN")}</td></tr>
              ))}
              {leads.length === 0 && <tr><td className="text-muted">No leads yet</td></tr>}
            </tbody>
          </table>
          <Link href="/admin/leads" className="text-sm text-brand-2 mt-3 inline-block">All leads →</Link>
        </div>
      </div>
    </div>
  );
}
