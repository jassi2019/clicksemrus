"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { NAV } from "@/lib/site";
import Logo from "./Logo";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => setOpen(false), [path]);
  if (path?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 pt-3 px-3 md:px-6 pointer-events-none">
      <div className={`container-x pointer-events-auto rounded-full transition-all duration-300 flex items-center justify-between h-16 md:h-[4.5rem] !px-4 md:!px-6 ${scrolled || open ? "bg-[#0e0a2b]/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,.7)]" : "bg-transparent border border-transparent"}`}>
        <Link href="/" aria-label="ClickSemrus home"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-1 text-white" aria-label="Main">
          {NAV.map((n) => {
            const active = path === n.href || (n.href !== "/" && path?.startsWith(n.href));
            return (
              <Link key={n.href} href={n.href} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${active ? "bg-white/15" : "text-white/75 hover:text-white hover:bg-white/10"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/contact" className="hidden md:inline-flex btn btn-primary text-sm !py-2.5">Get Free Audit <ArrowRight size={16} /></Link>
        <button className="md:hidden p-2 rounded-full text-white hover:bg-white/10" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden pointer-events-auto mt-2 container-x rounded-3xl bg-[#0e0a2b]/95 backdrop-blur-2xl border border-white/10 text-white">
          <nav className="py-4 flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="px-3 py-3 rounded-xl text-base font-semibold hover:bg-white/10">{n.label}</Link>
            ))}
            <Link href="/contact" className="btn btn-primary mt-2">Get Free Audit <ArrowRight size={16} /></Link>
          </nav>
        </div>
      )}
    </header>
  );
}
