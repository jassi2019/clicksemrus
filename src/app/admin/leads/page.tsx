import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listLeads } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function LeadsAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const leads = await listLeads();
  const csv = ["Name,Phone,Email,Service,Budget,Page,Date,Message", ...leads.map((l) => [l.name, l.phone, l.email, l.service, l.budget, l.page, l.createdAt, (l.message || "").replace(/\n/g, " ")].map((x) => `"${String(x || "").replace(/"/g, '""')}"`).join(","))].join("\n");
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
          <thead><tr><th>Lead</th><th>Service / Budget</th><th>Message</th><th>Source page</th><th>Date</th></tr></thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td><p className="font-medium">{l.name}</p><a href={`tel:${l.phone}`} className="text-xs text-brand-2 block">{l.phone}</a><a href={`mailto:${l.email}`} className="text-xs text-muted block">{l.email}</a></td>
                <td className="text-sm">{l.service}<br /><span className="text-xs text-muted">{l.budget}</span></td>
                <td className="text-xs text-muted max-w-[280px] whitespace-pre-wrap">{l.message}</td>
                <td className="text-xs text-muted">{l.page}</td>
                <td className="text-xs text-muted whitespace-nowrap">{new Date(l.createdAt).toLocaleString("en-IN")}</td>
              </tr>
            ))}
            {leads.length === 0 && <tr><td colSpan={5} className="text-muted">No leads yet. Share the site and watch this space.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
