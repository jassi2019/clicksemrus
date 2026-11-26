import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllPosts, isDmPost } from "@/lib/posts";
import { getShareKit } from "@/lib/social";
import ShareKitPanel from "@/components/admin/ShareKitPanel";

export const dynamic = "force-dynamic";

export default async function ShareKitAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const posts = (await getAllPosts()).filter(isDmPost).slice(0, 40);
  const rows = await Promise.all(posts.map(async (p) => ({ slug: p.slug, title: p.title, publishedAt: p.publishedAt, kit: await getShareKit(p.slug) })));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Share kit</h1>
        <p className="text-muted text-sm">Ready-to-paste LinkedIn, Instagram, WhatsApp and X posts for every article. Links carry UTM tags, so GA4 shows which channel sent each visit. New articles get a kit automatically when they are published.</p>
      </div>
      <ShareKitPanel rows={rows} />
    </div>
  );
}
