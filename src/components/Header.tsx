"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { NAV, SERVICE_CATEGORIES } from "@/lib/site";
import Logo from "./Logo";
import ServiceIcon from "./ServiceIcon";

const QUICK_LINKS = [
  { href: "/case-studies", label: "Results" },
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Free audit" },
];

function MegaMenu({ open, onClose, id }: { open: boolean; onClose: () => void; id: string }) {
  const [active, setActive] = useState(0);
  const cat = SERVICE_CATEGORIES[active];
  return (
    <div
      id={id}
      role="region"
      aria-label="Services menu"
      className={`absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[min(960px,calc(100vw-2rem))] transition-all duration-200 ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
    >
      <div className="mega-panel rounded-3xl overflow-hidden shadow-[0_40px_80px_-30px_rgba(11,11,20,.45)]">
        <div className="grid grid-cols-[280px_1fr]">
          <ul className="p-3 border-r border-border bg-surface-2/60">
            {SERVICE_CATEGORIES.map((c, i) => (
              <li key={c.slug}>
                <Link
                  href={`/services/${c.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${active === i ? "bg-[#0b0b14] text-white" : "hover:bg-surface-2"}`}
                >
                  <ServiceIcon name={c.icon} size={16} className={active === i ? "text-[#8b84ff]" : "text-brand"} />
                  <span className="flex-1">
                    {c.name}
                    <span className={`block text-[11px] font-medium ${active === i ? "text-white/60" : "text-muted"}`}>{c.subs.length} services</span>
                  </span>
                  <ChevronRight size={14} className="opacity-60" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="p-6">
            <p className="eyebrow">{cat.name}</p>
            <p className="font-display text-xl font-bold mt-3">{cat.tagline}</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1 mt-4">
              {cat.subs.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${cat.slug}/${s.slug}`} onClick={onClose} className="block py-1.5 text-sm text-muted hover:text-fg">{s.name}</Link>
                </li>
              ))}
              <li>
                <Link href={`/services/${cat.slug}`} onClick={onClose} className="inline-flex items-center gap-1 py-1.5 text-sm font-bold text-brand">View all <ArrowRight size={14} /></Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border px-6 py-3 flex items-center gap-2 flex-wrap bg-surface-2/60">
          <span className="text-xs text-muted mr-2">Quick links</span>
          {QUICK_LINKS.map((q) => (
            <Link key={q.href} href={q.href} onClick={onClose} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-surface hover:bg-surface-2">{q.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [acc, setAcc] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const megaId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    const t = setTimeout(f, 0);
    window.addEventListener("scroll", f, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", f); };
  }, []);

  // Close everything on route change (state adjusted during render, no effect needed).
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
    setMega(false);
  }

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMega(false); };
    const onClick = (e: MouseEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setMega(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [mega]);

  if (path?.startsWith("/admin")) return null;

  const openMega = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setMega(true); };
  const closeMegaSoon = () => { closeTimer.current = setTimeout(() => setMega(false), 150); };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-3 px-3 md:px-6 pointer-events-none">
      <div className={`container-x pointer-events-auto rounded-full transition-all duration-300 flex items-center justify-between h-16 !px-4 md:!px-6 ${scrolled || open || mega ? "glass" : "bg-transparent"}`}>
        <Link href="/" aria-label="ClickSemrus home"><Logo /></Link>
        <nav ref={navRef} className="hidden md:flex items-center gap-1 relative" aria-label="Main" onMouseLeave={closeMegaSoon}>
          {NAV.map((n) => {
            const active = path === n.href || (n.href !== "/" && path?.startsWith(n.href));
            const isServices = n.href === "/services";
            return (
              <div key={n.href} className={isServices ? "relative" : ""} onMouseEnter={isServices ? openMega : undefined}>
                {isServices ? (
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={mega}
                    aria-controls={megaId}
                    onClick={() => setMega((m) => !m)}
                    onFocus={openMega}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition inline-flex items-center gap-1 ${active || mega ? "bg-[#0b0b14] text-white" : "text-fg/70 hover:text-fg hover:bg-surface-2"}`}
                  >
                    {n.label} <ChevronDown size={14} className={`transition ${mega ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link href={n.href} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${active ? "bg-[#0b0b14] text-white" : "text-fg/70 hover:text-fg hover:bg-surface-2"}`}>
                    {n.label}
                  </Link>
                )}
              </div>
            );
          })}
          <div onMouseEnter={openMega} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMegaSoon(); }}>
            <MegaMenu open={mega} onClose={() => setMega(false)} id={megaId} />
          </div>
        </nav>
        <Link href="/contact" className="hidden md:inline-flex btn btn-primary text-sm !py-2.5">Get Free Audit <ArrowRight size={16} /></Link>
        <button className="md:hidden p-2 rounded-full hover:bg-surface-2" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden pointer-events-auto mt-2 container-x rounded-3xl mega-panel max-h-[calc(100vh-6rem)] overflow-y-auto">
          <nav className="py-4 flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((n) =>
              n.href === "/services" ? (
                <div key={n.href}>
                  <div className="flex items-center">
                    <Link href="/services" className="flex-1 px-3 py-3 rounded-xl text-base font-semibold hover:bg-surface-2">Services</Link>
                    <button type="button" aria-label="Toggle services" aria-expanded={acc === "services"} onClick={() => setAcc(acc === "services" ? null : "services")} className="p-3 rounded-xl hover:bg-surface-2">
                      <ChevronDown size={18} className={`transition ${acc === "services" ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {acc === "services" && (
                    <ul className="pl-3 pb-2">
                      {SERVICE_CATEGORIES.map((c) => (
                        <li key={c.slug}>
                          <div className="flex items-center">
                            <Link href={`/services/${c.slug}`} className="flex-1 flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-xl hover:bg-surface-2"><ServiceIcon name={c.icon} size={15} className="text-brand" />{c.name}</Link>
                            <button type="button" aria-label={`Toggle ${c.name}`} aria-expanded={acc === c.slug || false} onClick={() => setAcc(c.slug)} className="p-2.5 rounded-xl hover:bg-surface-2"><ChevronRight size={16} /></button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {acc && acc !== "services" && SERVICE_CATEGORIES.some((c) => c.slug === acc) && (
                    <ul className="pl-3 pb-2">
                      <li>
                        <button type="button" onClick={() => setAcc("services")} className="px-3 py-2 text-xs font-bold text-brand inline-flex items-center gap-1">← All services</button>
                      </li>
                      {SERVICE_CATEGORIES.find((c) => c.slug === acc)?.subs.map((s) => (
                        <li key={s.slug}><Link href={`/services/${acc}/${s.slug}`} className="block px-3 py-2.5 text-sm rounded-xl hover:bg-surface-2">{s.name}</Link></li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link key={n.href} href={n.href} className="px-3 py-3 rounded-xl text-base font-semibold hover:bg-surface-2">{n.label}</Link>
              )
            )}
            <Link href="/contact" className="btn btn-primary mt-2">Get Free Audit <ArrowRight size={16} /></Link>
          </nav>
        </div>
      )}
    </header>
  );
}
