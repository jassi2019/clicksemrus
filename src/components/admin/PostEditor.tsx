"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import type { Post } from "@/lib/posts";
import { BLOG_CATEGORIES } from "@/lib/site";

export default function PostEditor({ post }: { post: Post | null }) {
  const router = useRouter();
  const [p, setP] = useState<Partial<Post> & { tagsText?: string }>({
    title: "", slug: "", excerpt: "", content: "", category: "SEO", status: "published", cover: "", seoTitle: "", seoDescription: "", author: "ClickSemrus Team",
    ...post,
    tagsText: post?.tags?.join(", ") || "",
  });
  const [preview, setPreview] = useState(false);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: unknown) => setP((s) => ({ ...s, [k]: v }));

  async function save(status?: "draft" | "published") {
    setSaving(true);
    setMsg("");
    const body = { ...p, status: status || p.status, tags: (p.tagsText || "").split(",").map((t) => t.trim()).filter(Boolean) };
    const res = await fetch("/api/admin/posts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const j = await res.json();
    setSaving(false);
    if (j.ok) {
      setMsg("Saved");
      if (!post || post.slug !== j.post.slug) router.replace(`/admin/posts/${j.post.slug}`);
      router.refresh();
    } else setMsg(j.error || "Error");
  }

  const seoLen = (s = "", max: number) => <span className={`text-xs ${s.length > max ? "text-accent" : "text-muted"}`}>{s.length}/{max}</span>;

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-4">
        <input className="input text-lg font-semibold" placeholder="Post title" value={p.title} onChange={(e) => set("title", e.target.value)} />
        <div className="flex gap-2 text-xs">
          <button className={`px-3 py-1 rounded-full border border-border ${!preview ? "bg-surface-2" : ""}`} onClick={() => setPreview(false)}>Markdown</button>
          <button className={`px-3 py-1 rounded-full border border-border ${preview ? "bg-surface-2" : ""}`} onClick={() => setPreview(true)}>Preview</button>
        </div>
        {preview ? (
          <div className="card p-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(p.content || "") as string }} />
        ) : (
          <textarea className="input min-h-[520px] font-mono text-sm" placeholder={"Write in Markdown. Use ## for sections.\n\nTip: mention SEO, social media, Meta Ads etc. and they auto-link to service pages."} value={p.content} onChange={(e) => set("content", e.target.value)} />
        )}
        <div>
          <label className="text-xs text-muted">Excerpt {seoLen(p.excerpt, 160)}</label>
          <textarea className="input" rows={2} value={p.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        </div>
      </div>
      <aside className="space-y-4">
        <div className="card p-4 space-y-3">
          <div className="flex gap-2">
            <button onClick={() => save("published")} disabled={saving} className="btn btn-primary text-sm flex-1">{saving ? "Saving..." : "Publish"}</button>
            <button onClick={() => save("draft")} disabled={saving} className="btn btn-ghost text-sm">Draft</button>
          </div>
          {msg && <p className="text-xs text-lime">{msg}</p>}
          <label className="block text-xs text-muted">Slug<input className="input mt-1" value={p.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" /></label>
          <label className="block text-xs text-muted">Category
            <select className="input mt-1" value={p.category} onChange={(e) => set("category", e.target.value)}>{BLOG_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          </label>
          <label className="block text-xs text-muted">Tags (comma separated)<input className="input mt-1" value={p.tagsText} onChange={(e) => set("tagsText", e.target.value)} /></label>
          <label className="block text-xs text-muted">Cover image URL<input className="input mt-1" value={p.cover || ""} onChange={(e) => set("cover", e.target.value)} /></label>
          <label className="block text-xs text-muted">Author<input className="input mt-1" value={p.author} onChange={(e) => set("author", e.target.value)} /></label>
        </div>
        <div className="card p-4 space-y-3">
          <p className="font-semibold text-sm">SEO</p>
          <label className="block text-xs text-muted">Meta title {seoLen(p.seoTitle, 60)}<input className="input mt-1" value={p.seoTitle || ""} onChange={(e) => set("seoTitle", e.target.value)} /></label>
          <label className="block text-xs text-muted">Meta description {seoLen(p.seoDescription, 155)}<textarea className="input mt-1" rows={3} value={p.seoDescription || ""} onChange={(e) => set("seoDescription", e.target.value)} /></label>
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-[#8ab4f8] text-sm truncate">{p.seoTitle || p.title || "Title preview"}</p>
            <p className="text-[#bdc1c6] text-xs line-clamp-2">{p.seoDescription || p.excerpt || "Description preview"}</p>
          </div>
        </div>
        {post?.outbound && post.outbound.length > 0 && (
          <div className="card p-4">
            <p className="font-semibold text-sm mb-2">Outbound sources</p>
            <ul className="text-xs text-muted space-y-1">{post.outbound.map((o) => <li key={o.url} className="truncate">{o.source}: {o.title}</li>)}</ul>
          </div>
        )}
      </aside>
    </div>
  );
}
