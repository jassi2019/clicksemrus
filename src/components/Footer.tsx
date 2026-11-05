import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Instagram from "./InstagramIcon";
import { SITE, SERVICES, NAV } from "@/lib/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-2">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="text-muted text-sm mt-4 leading-relaxed">
            {SITE.name} is a performance-driven digital marketing agency in {SITE.city}. We turn clicks into customers with SEO, social media, paid ads, content and design.
          </p>
          <div className="flex gap-3 mt-5">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-lg bg-surface hover:bg-surface-2 border border-border">
              <Instagram size={18} />
            </a>
            <a href={`mailto:${SITE.email}`} aria-label="Email" className="p-2 rounded-lg bg-surface hover:bg-surface-2 border border-border">
              <Mail size={18} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm text-muted">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link className="hover:text-fg" href={`/services/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-muted">
            {NAV.map((n) => (
              <li key={n.href}><Link className="hover:text-fg" href={n.href}>{n.label}</Link></li>
            ))}
            <li><Link className="hover:text-fg" href="/blog/category/trending">Trending Today</Link></li>
            <li><Link className="hover:text-fg" href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="hover:text-fg" href="/terms">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 text-brand-2" /> {SITE.address}</li>
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 text-brand-2" /> <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-fg">{SITE.phone}</a></li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 text-brand-2" /> <a href={`mailto:${SITE.email}`} className="hover:text-fg">{SITE.email}</a></li>
          </ul>
          <Link href="/contact" className="btn btn-primary mt-6 text-sm !py-2.5">Book a Free Strategy Call</Link>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
          <p>Serving Delhi, Gurugram, Noida, Faridabad, Ghaziabad and all of India.</p>
        </div>
      </div>
    </footer>
  );
}
