"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Flame, Users, Settings, LogOut, ExternalLink, Menu, Search } from "lucide-react";
import { useState } from "react";
import Logo from "../Logo";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/trending", label: "Trending Engine", icon: Flame },
  { href: "/admin/seo", label: "Search & Indexing", icon: Search },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (path === "/admin/login") return null;
  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }
  const nav = (
    <nav className="flex flex-col gap-1 mt-6">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={`admin-link ${path === l.href || (l.href !== "/admin" && path.startsWith(l.href)) ? "active" : ""}`} onClick={() => setOpen(false)}>
          <l.icon size={18} /> {l.label}
        </Link>
      ))}
      <a href="/" target="_blank" className="admin-link"><ExternalLink size={18} /> View site</a>
      <button onClick={logout} className="admin-link text-left"><LogOut size={18} /> Logout</button>
    </nav>
  );
  return (
    <>
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-border bg-bg p-5">
        <Logo />
        <p className="text-[10px] uppercase tracking-widest text-muted mt-2">Admin panel</p>
        {nav}
      </aside>
      <div className="md:hidden sticky top-0 z-40 bg-bg border-b border-border p-3 flex items-center justify-between">
        <Logo />
        <button onClick={() => setOpen(!open)} className="p-2" aria-label="Menu"><Menu /></button>
      </div>
      {open && <div className="md:hidden bg-bg border-b border-border p-4">{nav}</div>}
    </>
  );
}
