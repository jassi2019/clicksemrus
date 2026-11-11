import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, FileEdit } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { CONTENT_PAGES, blocksFor, getOverrides } from "@/lib/pageContent";

export const dynamic = "force-dynamic";

export default async function PagesAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const overrides = await Promise.all(CONTENT_PAGES.map((p) => getOverrides(p.id)));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Pages</h1>
        <p className="text-muted text-sm">Edit the headlines, intros and key text on each page. Layout and design stay as they are; leave a field empty to use the default.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {CONTENT_PAGES.map((p, i) => {
          const edited = Object.keys(overrides[i]).length;
          return (
            <div key={p.id} className="card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{p.label}</h2>
                  <p className="text-xs text-muted mt-1">{p.description}</p>
                </div>
                <span className={`badge shrink-0 ${edited ? "bg-brand text-white" : "bg-surface-2 text-muted"}`}>{edited ? `${edited} edited` : "default"}</span>
              </div>
              <p className="text-xs text-muted">{blocksFor(p.id).length} editable fields</p>
              <div className="flex gap-2 mt-auto">
                <Link href={`/admin/pages/${p.id}`} className="btn btn-primary text-sm !py-2"><FileEdit size={16} /> Edit</Link>
                <a href={p.path} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-sm !py-2"><ExternalLink size={16} /> Preview</a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
