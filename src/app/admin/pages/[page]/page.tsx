import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { CONTENT_PAGES, blocksFor, getOverrides } from "@/lib/pageContent";
import PageContentForm from "@/components/admin/PageContentForm";

export const dynamic = "force-dynamic";

export default async function EditPageContent({ params }: { params: Promise<{ page: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { page } = await params;
  const meta = CONTENT_PAGES.find((p) => p.id === page);
  if (!meta) notFound();
  const [blocks, overrides] = [blocksFor(page), await getOverrides(page)];
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <Link href="/admin/pages" className="text-xs text-muted inline-flex items-center gap-1 hover:text-fg"><ArrowLeft size={14} /> All pages</Link>
          <h1 className="font-display text-3xl font-bold mt-1">{meta.label}</h1>
          <p className="text-muted text-sm">{meta.description}</p>
        </div>
        <a href={meta.path} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-sm"><ExternalLink size={16} /> Preview page</a>
      </div>
      <PageContentForm page={page} path={meta.path} blocks={blocks} overrides={overrides} />
    </div>
  );
}
