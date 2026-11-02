import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export default function CTA({ title = "Ready to turn clicks into customers?", sub = "Get a free 20-minute strategy call and a written growth plan for your business. No pitch decks, just numbers." }: { title?: string; sub?: string }) {
  return (
    <section className="container-x my-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#1a1340] via-bg-2 to-[#0b2a33] p-10 md:p-16 text-center">
        <div className="blob w-72 h-72 bg-brand -top-20 -left-20" />
        <div className="blob w-72 h-72 bg-brand-2 -bottom-24 -right-10" style={{ animationDelay: "-6s" }} />
        <div className="relative">
          <h2 className="font-display text-3xl md:text-5xl font-bold max-w-3xl mx-auto">{title}</h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">{sub}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/contact" className="btn btn-primary">Get My Free Growth Plan <ArrowRight size={18} /></Link>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn btn-ghost"><Phone size={18} /> {SITE.phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
