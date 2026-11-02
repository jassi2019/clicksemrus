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
    <header className={`sticky top-0 z-50 transition-all ${scrolled || open ? "bg-bg/80 backdrop-blur-xl border-b border-border" : "bg-transparent"}`}>
      <div className="container-x flex items-center justify-between h-16 md:h-20">
        <Link href="/" aria-label="ClickSemrus home" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3.5 py-2 rounded-full text-sm font-medium transition ${path === n.href || (n.href !== "/" && path?.startsWith(n.href)) ? "text-fg bg-surface-2" : "text-muted hover:text-fg hover:bg-surface"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/contact" className="btn btn-primary text-sm !py-2.5">
            Get Free Audit <ArrowRight size={16} />
          </Link>
        </div>
        <button className="md:hidden p-2 rounded-lg hover:bg-surface" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-xl">
          <nav className="container-x py-4 flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="px-3 py-3 rounded-lg text-base font-medium text-fg hover:bg-surface">
                {n.label}
              </Link>
            ))}
            <Link href="/contact" className="btn btn-primary mt-2">
              Get Free Audit <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
