import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { Sphere, Ring } from "./Shapes";

export default function CTA({ title = "Ready to turn clicks into customers?", sub = "Get a free 20-minute strategy call and a written growth plan for your business. No pitch decks, just numbers." }: { title?: string; sub?: string }) {
  return (
    <section className="container-x my-24">
      <div className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-20 text-center text-white bg-gradient-to-br from-[#ff3cac] via-[#7a3cff] to-[#2bd2ff] shadow-[0_40px_90px_-30px_rgba(122,60,255,.9)]">
        <Sphere className="w-40 h-40 -left-10 -top-10" c1="#ffb13b" c2="#ff3cac" />
        <Ring className="w-52 h-52 -right-16 -bottom-20" delay={-4} />
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="relative">
          <h2 className="font-display text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.02]">{title}</h2>
          <p className="text-white/85 mt-5 max-w-xl mx-auto text-lg">{sub}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-9">
            <Link href="/contact" className="btn btn-dark text-base !px-7 !py-4">Get My Free Growth Plan <ArrowRight size={18} /></Link>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn bg-white/15 border border-white/30 text-white backdrop-blur text-base !px-7 !py-4 hover:bg-white/25"><Phone size={18} /> {SITE.phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
