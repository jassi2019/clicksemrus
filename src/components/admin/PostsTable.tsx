"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Post } from "@/lib/posts";

export default function PostsTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  async function del(slug: string) {
    if (!confirm(`Delete "${slug}"?`)) return;
    await fetch(`/api/admin/posts?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    router.refresh();
  }
  return (
    <div className="card overflow-x-auto">
      <table className="table">
        <thead><tr><th>Title</th><th>Category</th><th>Source</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.slug}>
              <td className="max-w-[360px]"><p className="font-medium truncate">{p.title}</p><p className="text-xs text-muted truncate">/blog/{p.slug}</p></td>
              <td>{p.category}</td>
              <td><span className={`badge ${p.source === "trend" ? "bg-accent/20 text-accent" : p.source === "seed" ? "bg-surface-2 text-muted" : "bg-brand/20 text-brand-2"}`}>{p.source}</span></td>
              <td><span className={`badge ${p.status === "published" ? "bg-lime/20 text-lime" : "bg-yellow-500/20 text-yellow-400"}`}>{p.status}</span></td>
              <td className="text-xs text-muted whitespace-nowrap">{new Date(p.publishedAt).toLocaleDateString("en-IN")}</td>
              <td>
                <div className="flex gap-2 justify-end">
                  <Link href={`/blog/${p.slug}`} target="_blank" className="p-1.5 rounded hover:bg-surface-2" aria-label="View"><ExternalLink size={16} /></Link>
                  <Link href={`/admin/posts/${p.slug}`} className="p-1.5 rounded hover:bg-surface-2" aria-label="Edit"><Pencil size={16} /></Link>
                  {p.source !== "seed" && <button onClick={() => del(p.slug)} className="p-1.5 rounded hover:bg-surface-2 text-accent" aria-label="Delete"><Trash2 size={16} /></button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
