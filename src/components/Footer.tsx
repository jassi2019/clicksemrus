import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Instagram from "./InstagramIcon";
import { SITE, SERVICE_CATEGORIES, NAV, LOCATIONS, INDUSTRIES } from "@/lib/site";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const hasPhone = !SITE.phone.includes("00000");
  return (
    <footer className="section-dark border-t border-border">
      <div className="container-x pt-16 pb-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="text-muted text-sm mt-4 leading-relaxed max-w-sm">
              {SITE.name} is a performance-driven digital marketing agency in {SITE.city}. We turn clicks into customers with SEO, social media, paid ads, content and design.
            </p>
            <div className="mt-6">
              <p className="font-semibold text-sm">Growth ideas, twice a month</p>
              <p className="text-muted text-xs mt-1 mb-3">Trend-based marketing angles for Indian businesses. No spam.</p>
              <NewsletterForm />
            </div>
            <div className="flex gap-3 mt-6">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-lg bg-surface hover:bg-surface-2 border border-border">
                <Instagram size={18} />
              </a>
              <a href={`mailto:${SITE.email}`} aria-label="Email" className="p-2 rounded-lg bg-surface hover:bg-surface-2 border border-border">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_CATEGORIES.map((c) => (
              <div key={c.slug}>
                <h3 className="font-semibold mb-3 text-sm"><Link href={`/services/${c.slug}`} className="hover:text-[#8b84ff]">{c.name}</Link></h3>
                <ul className="space-y-1.5 text-xs text-muted">
                  {c.subs.slice(0, 5).map((s) => (
                    <li key={s.slug}><Link className="hover:text-fg" href={`/services/${c.slug}/${s.slug}`}>{s.name}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="font-semibold mb-3 text-sm">Company</h3>
              <ul className="space-y-1.5 text-xs text-muted">
                {NAV.map((n) => (
                  <li key={n.href}><Link className="hover:text-fg" href={n.href}>{n.label}</Link></li>
                ))}
                <li><Link className="hover:text-fg" href="/blog/category/trending">Trending Today</Link></li>
                <li><Link className="hover:text-fg" href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link className="hover:text-fg" href="/terms">Terms</Link></li>
              </ul>
              <h3 className="font-semibold mb-3 mt-6 text-sm">Industries</h3>
              <ul className="space-y-1.5 text-xs text-muted">
                {INDUSTRIES.map((i) => (
                  <li key={i.slug}><Link className="hover:text-fg" href={`/industries/${i.slug}`}>{i.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-3 text-sm">Locations</h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
              {LOCATIONS.map((l) => (
                <li key={l.slug}><Link className="hover:text-fg inline-flex items-center gap-1" href={`/locations/${l.slug}`}><MapPin size={11} /> {l.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Contact</h3>
            <ul className="space-y-2 text-xs text-muted">
              <li className="flex gap-2"><MapPin size={14} className="mt-0.5 text-[#8b84ff]" /> {SITE.address}</li>
              {hasPhone && <li className="flex gap-2"><Phone size={14} className="mt-0.5 text-[#8b84ff]" /> <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-fg">{SITE.phone}</a></li>}
              <li className="flex gap-2"><Mail size={14} className="mt-0.5 text-[#8b84ff]" /> <a href={`mailto:${SITE.email}`} className="hover:text-fg">{SITE.email}</a></li>
            </ul>
          </div>
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
