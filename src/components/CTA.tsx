import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { Ring } from "./Shapes";

export default function CTA({ title = "Ready to turn clicks into customers?", sub = "Get a free 20-minute strategy call and a written growth plan for your business. No pitch decks, just numbers." }: { title?: string; sub?: string }) {
  return (
    <section className="container-x my-24">
      <div className="section-dark relative overflow-hidden rounded-[2.5rem] p-10 md:p-20 text-center shadow-[0_40px_90px_-40px_rgba(11,11,20,.8)]">
        <div className="absolute inset-0 dots" />
        <div className="blob w-80 h-80 bg-[#4f46e5] -left-20 -top-20 opacity-50" />
        <Ring className="w-52 h-52 -right-16 -bottom-20 opacity-60" delay={-4} />
        <div className="relative">
          <h2 className="font-display text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.02]">{title}</h2>
          <p className="text-muted mt-5 max-w-xl mx-auto text-lg">{sub}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-9">
            <Link href="/contact" className="btn btn-primary text-base !px-7 !py-4">Get My Free Growth Plan <ArrowRight size={18} /></Link>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn btn-ghost text-base !px-7 !py-4"><Phone size={18} /> {SITE.phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
