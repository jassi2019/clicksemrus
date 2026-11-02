import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Instagram from "@/components/InstagramIcon";
import { SITE } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import LeadForm from "@/components/LeadForm";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMeta({
  title: `Contact ${SITE.name} | Free Digital Marketing Audit in Delhi NCR`,
  description: `Get a free digital marketing audit and growth plan. Call, WhatsApp or email ${SITE.name}, Delhi NCR. We reply within 2 business hours.`,
  path: "/contact",
});

export default function Contact() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Contact", path: "/contact" }])} />
      <section className="relative overflow-hidden">
        <div className="blob w-96 h-96 bg-brand-2 -top-20 -left-20" />
        <div className="container-x relative pt-16 md:pt-24 pb-20 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <p className="eyebrow">Contact</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-3">Let us build your growth plan.</h1>
            <p className="text-muted mt-4 leading-relaxed">Fill the form and a strategist (not a sales rep) will call you within 2 business hours with first observations about your website and marketing.</p>
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex gap-3"><Phone className="text-brand-2 shrink-0" size={20} /><a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-brand-2">{SITE.phone}</a></li>
              <li className="flex gap-3"><Mail className="text-brand-2 shrink-0" size={20} /><a href={`mailto:${SITE.email}`} className="hover:text-brand-2">{SITE.email}</a></li>
              <li className="flex gap-3"><MapPin className="text-brand-2 shrink-0" size={20} />{SITE.address}</li>
              <li className="flex gap-3"><Clock className="text-brand-2 shrink-0" size={20} />Mon to Sat, 10am to 7pm IST</li>
              <li className="flex gap-3"><Instagram className="text-brand-2 shrink-0" size={20} /><a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-2">@clicksemrus</a></li>
            </ul>
          </div>
          <div className="lg:col-span-3 card p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold">Get your free audit</h2>
            <p className="text-muted text-sm mt-1 mb-6">Takes 30 seconds. Worth Rs 10,000.</p>
            <LeadForm source="/contact" />
          </div>
        </div>
      </section>
    </>
  );
}
