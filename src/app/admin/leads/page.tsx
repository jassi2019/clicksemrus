import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listLeads } from "@/lib/posts";
import { listWaLog, whatsappStatus } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function LeadsAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [leads, waLog] = await Promise.all([listLeads(), listWaLog(20)]);
  const wa = whatsappStatus();
  const svc = (l: (typeof leads)[number]) => (l.services?.length ? l.services.join(", ") : l.service || "");
  const csv = ["Name,Phone,Email,Company,Website,Services,Budget,Source,Page,Date,Message", ...leads.map((l) => [l.name, l.phone, l.email, l.company, l.website, svc(l), l.budget, l.source, l.page, l.createdAt, (l.message || "").replace(/\n/g, " ")].map((x) => `"${String(x || "").replace(/"/g, '""')}"`).join(","))].join("\n");
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Leads</h1>
          <p className="text-muted text-sm">{leads.length} enquiries from website forms.</p>
        </div>
        <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download="clicksemrus-leads.csv" className="btn btn-ghost text-sm">Download CSV</a>
      </div>
      <div className="card overflow-x-auto">
        <table className="table">
          <thead><tr><th>Lead</th><th>Company</th><th>Services / Budget</th><th>Message</th><th>Source</th><th>Date</th></tr></thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td><p className="font-medium">{l.name}</p><a href={`tel:${l.phone}`} className="text-xs text-brand-2 block">{l.phone}</a><a href={`mailto:${l.email}`} className="text-xs text-muted block">{l.email}</a></td>
                <td className="text-sm">{l.company}{l.website && <a href={l.website.startsWith("http") ? l.website : `https://${l.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-2 block">{l.website}</a>}</td>
                <td className="text-sm">{svc(l)}<br /><span className="text-xs text-muted">{l.budget}</span></td>
                <td className="text-xs text-muted max-w-[280px] whitespace-pre-wrap">{l.message}</td>
                <td className="text-xs text-muted">{l.source && l.source !== "form" && <span className="badge bg-brand text-white mr-1">{l.source}</span>}{l.page}</td>
                <td className="text-xs text-muted whitespace-nowrap">{new Date(l.createdAt).toLocaleString("en-IN")}</td>
              </tr>
            ))}
            {leads.length === 0 && <tr><td colSpan={6} className="text-muted">No leads yet. Share the site and watch this space.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card !transform-none">
        <div className="p-4 sm:p-5 pb-0 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold">WhatsApp notification log</h2>
            <p className="text-xs text-muted">Last 20 sends. Provider: {wa.label}.</p>
          </div>
          <a href="/admin/settings" className="text-sm text-brand-2">WhatsApp settings</a>
        </div>
        <div className="overflow-x-auto p-2 sm:p-3">
          <table className="table min-w-[640px]">
            <thead><tr><th>When</th><th>Type</th><th>To</th><th>Status</th><th>Message</th></tr></thead>
            <tbody>
              {waLog.map((e, i) => (
                <tr key={`${e.at}-${i}`}>
                  <td className="text-xs text-muted whitespace-nowrap">{new Date(e.at).toLocaleString("en-IN")}</td>
                  <td className="text-xs">{e.kind}</td>
                  <td className="text-xs whitespace-nowrap">{e.to}</td>
                  <td className="text-xs">{e.ok ? <span className="badge bg-lime text-[#0b0b14]">sent</span> : <span className="badge bg-accent/15 text-accent" title={e.reason}>failed</span>}<span className="block text-muted mt-1">{e.provider}{!e.ok && e.reason ? `: ${e.reason.slice(0, 80)}` : ""}</span></td>
                  <td className="text-xs text-muted max-w-[320px] truncate" title={e.preview}>{e.preview}</td>
                </tr>
              ))}
              {waLog.length === 0 && <tr><td colSpan={5} className="text-muted">No WhatsApp messages sent yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
