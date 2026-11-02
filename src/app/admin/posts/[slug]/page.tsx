import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getPost } from "@/lib/posts";
import PostEditor from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;
  const post = slug === "new" ? null : await getPost(slug, true);
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">{post ? "Edit post" : "New post"}</h1>
      <PostEditor post={post} />
    </div>
  );
}
