import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllPosts } from "@/lib/posts";
import PostsTable from "@/components/admin/PostsTable";

export const dynamic = "force-dynamic";

export default async function PostsAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const posts = await getAllPosts({ includeDrafts: true });
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Posts</h1>
          <p className="text-muted text-sm">{posts.length} posts. Seed posts can be overridden by saving a post with the same slug.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/trending" className="btn btn-ghost text-sm">Generate from trends</Link>
          <Link href="/admin/posts/new" className="btn btn-primary text-sm">+ New post</Link>
        </div>
      </div>
      <PostsTable posts={posts} />
    </div>
  );
}
