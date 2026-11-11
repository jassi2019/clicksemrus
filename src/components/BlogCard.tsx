import Link from "next/link";
import { Flame, Clock } from "lucide-react";
import type { Post } from "@/lib/posts";
import { readingTime } from "@/lib/markdown";
import { coverFor } from "@/lib/cover";

const GRADIENTS = [
  "from-[#e9e9f3] to-[#c9cce0]", "from-[#dcdbff] to-[#b9b4ff]", "from-[#d9f1ff] to-[#b6e3ff]", "from-[#efeff5] to-[#d2d4e3]",
];

export default function BlogCard({ post, i = 0, featured = false }: { post: Post; i?: number; featured?: boolean }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return (
    <Link href={`/blog/${post.slug}`} className={`card overflow-hidden group flex flex-col ${featured ? "md:flex-row" : ""}`}>
      <div className={`relative ${featured ? "md:w-1/2 min-h-56" : "h-44"} bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} overflow-hidden`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverFor(post)} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge bg-bg/70 backdrop-blur text-fg border border-border">{post.category}</span>
          {post.source === "trend" && (
            <span className="badge bg-accent text-white flex items-center gap-1"><Flame size={10} /> Trending</span>
          )}
        </div>
      </div>
      <div className={`p-5 flex flex-col gap-2 ${featured ? "md:w-1/2 md:p-8" : ""}`}>
        <p className="text-xs text-muted flex items-center gap-3">
          <span>{date}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {readingTime(post.content)} min read</span>
        </p>
        <h3 className={`font-display font-bold leading-snug group-hover:text-brand-2 transition ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>{post.title}</h3>
        <p className="text-sm text-muted line-clamp-3">{post.excerpt}</p>
      </div>
    </Link>
  );
}
