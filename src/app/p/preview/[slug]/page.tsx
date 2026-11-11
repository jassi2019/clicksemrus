import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getLayout } from "@/lib/builderStore";
import BlockRenderer from "@/components/builder/BlockRenderer";

/**
 * Admin-only live preview of any layout (draft or published), rendered inside the real site chrome.
 * The builder's preview iframe points here so drafts of take-over pages (home, about, ...) can be seen
 * without making the public routes dynamic.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

export default async function BuilderPreview({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) notFound();
  const { slug } = await params;
  const layout = await getLayout(slug);
  if (!layout) notFound();
  return (
    <>
      <div className="bg-sun text-[#0b0b14] text-center text-xs font-bold py-1.5 px-4">
        Preview · {layout.status === "published" ? "published version" : "draft, not visible to visitors"} · {layout.blocks.length} blocks
      </div>
      <BlockRenderer blocks={layout.blocks} />
    </>
  );
}
