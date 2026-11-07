import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageCircle, ArrowRight, PhoneCall, FileSearch, CalendarCheck } from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import { SITE, LOCATIONS } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import LeadForm from "@/components/LeadForm";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";

export const metadata = pageMeta({
  title: `Contact ${SITE.name} | Free Digital Marketing Audit in Delhi NCR`,
  description: `Get a free digital marketing audit and growth plan. Call, WhatsApp or email ${SITE.name}, Delhi NCR. We reply within 2 business hours.`,
  path: "/contact",
});

const NEXT = [
  { icon: PhoneCall, t: "A strategist calls you", when: "Within 2 business hours", d: "Not a sales rep. Someone who has already looked at your website and Google presence and has first observations ready." },
  { icon: FileSearch, t: "Written audit and plan", when: "Within 48 hours", d: "Website, SEO, social and ads reviewed against your competitors, with a prioritised 90-day plan and a one-page quote." },
  { icon: CalendarCheck, t: "You decide", when: "No pressure", d: "Keep the plan and run it yourself, or start with us. Month to month after the first 90 days, and you own every account." },
];

export default function Contact() {
  const tel = SITE.phone.replace(/\s/g, "");
  const wa = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi ClickSemrus! I would like a free marketing audit.")}`;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Contact", path: "/contact" }])} />

      <section className="relative overflow-hidden mesh">
        <div className="absolute inset-0 dots opacity-70" />
        <div className="blob w-[26rem] h-[26rem] bg-brand-2 -top-20 -left-20" />
        <div className="container-x relative pt-14 md:pt-20 pb-12">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Contact</p>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">Let us build your <span className="gradient-text">growth plan.</span></h1>
            <p className="text-muted mt-5 text-lg leading-relaxed">Fill the form and a strategist will call you within 2 business hours with first observations about your website and marketing. Prefer to talk now? Call or WhatsApp us directly.</p>
          </Reveal>
        </div>

        <div className="container-x relative pb-20 grid lg:grid-cols-5 gap-8 items-start">
          {/* form */}
          <Reveal className="lg:col-span-3">
            <div className="card p-6 md:p-8 !transform-none">
              <h2 className="font-display text-2xl font-bold">Request a free audit</h2>
              <p className="text-muted text-sm mt-1 mb-6">We reply within 2 business hours. Worth Rs 10,000, free for Delhi NCR businesses this month.</p>
              <LeadForm source="/contact" />
            </div>
          </Reveal>

          {/* right column */}
          <div className="lg:col-span-2 grid gap-5">
            <Reveal delay={60}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <a href={`tel:${tel}`} className="card p-5 flex gap-4 items-center group">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#0b0b14] text-white group-hover:bg-brand transition shrink-0"><Phone size={20} /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold tracking-widest uppercase text-muted">Call</span>
                    <span className="block font-bold truncate">{SITE.phone}</span>
                  </span>
                </a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="card p-5 flex gap-4 items-center group">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#25D366] text-white shrink-0"><MessageCircle size={20} /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold tracking-widest uppercase text-muted">WhatsApp</span>
                    <span className="block font-bold truncate">Chat with a strategist</span>
                  </span>
                </a>
                <a href={`mailto:${SITE.email}`} className="card p-5 flex gap-4 items-center group">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#0b0b14] text-white group-hover:bg-brand transition shrink-0"><Mail size={20} /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold tracking-widest uppercase text-muted">Email</span>
                    <span className="block font-bold truncate">{SITE.email}</span>
                  </span>
                </a>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="card p-5 flex gap-4 items-center group">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#0b0b14] text-white group-hover:bg-brand transition shrink-0"><InstagramIcon size={20} /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold tracking-widest uppercase text-muted">Instagram</span>
                    <span className="block font-bold truncate">@clicksemrus</span>
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="card p-5 !transform-none">
                <h3 className="font-bold flex items-center gap-2"><Clock size={16} className="text-brand" /> Office hours</h3>
                <ul className="mt-3 text-sm space-y-1.5">
                  <li className="flex justify-between gap-4"><span className="text-muted">Monday to Saturday</span><span className="font-semibold">10:00 am to 7:00 pm IST</span></li>
                  <li className="flex justify-between gap-4"><span className="text-muted">Sunday</span><span className="font-semibold">WhatsApp only</span></li>
                  <li className="flex justify-between gap-4"><span className="text-muted">Form and WhatsApp replies</span><span className="font-semibold">Within 2 business hours</span></li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="card p-5 !transform-none">
                <h3 className="font-bold flex items-center gap-2"><MapPin size={16} className="text-brand" /> Delhi NCR, in person or online</h3>
                <p className="text-sm text-muted mt-2">Based in {SITE.address}. Strategy sessions and reel shoots across:</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {LOCATIONS.map((l) => (
                    <li key={l.slug}><Link href={`/locations/${l.slug}`} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-2 border border-border hover:bg-[#0b0b14] hover:text-white transition">{l.name}</Link></li>
                  ))}
                </ul>
                <p className="text-xs text-muted mt-3">Also serving clients across India and abroad over video calls.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* what happens next */}
      <section className="section-tint relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 dots opacity-50" />
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">What happens next</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">Three steps, no pitch deck</h2>
          </Reveal>
          <ol className="timeline mt-12" style={{ "--steps": 3 } as React.CSSProperties}>
            {NEXT.map((n, i) => (
              <li key={n.t} className="timeline-step">
                <span className="timeline-dot">{i + 1}</span>
                <Reveal delay={i * 90}>
                  <div className="card p-6 h-full">
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/10 text-brand"><n.icon size={20} /></span>
                      <span className="text-xs font-bold text-muted tracking-widest uppercase">{n.when}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold mt-4">{n.t}</h3>
                    <p className="text-sm text-muted mt-2 leading-relaxed">{n.d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted mt-10">Looking for prices first? See <Link href="/pricing" className="text-brand font-semibold underline underline-offset-2 inline-flex items-center gap-1">packages and add-ons <ArrowRight size={14} /></Link></p>
        </div>
      </section>
    </>
  );
}
