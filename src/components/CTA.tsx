import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import { Ring } from "./Shapes";

export default function CTA({
  title = "Ready to grow your business?",
  sub = "Book a free 30-minute strategy call. You leave with a written plan and real numbers for your industry, no pitch deck.",
}: {
  title?: string;
  sub?: string;
}) {
  const wa = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi ClickSemrus! I want to book a free strategy call.")}`;
  return (
    <section className="section-dark relative overflow-hidden mt-24">
      <div className="absolute inset-0 dots" />
      <div className="blob w-96 h-96 bg-[#4f46e5] -left-24 -top-24 opacity-50" />
      <Ring className="w-52 h-52 -right-16 -bottom-20 opacity-60" delay={-4} />
      <div className="container-x relative py-20 md:py-28 text-center">
        <span className="eyebrow">Let&apos;s talk</span>
        <h2 className="font-display text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.02] mt-5">{title}</h2>
        <p className="text-muted mt-5 max-w-xl mx-auto text-lg">{sub}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-9">
          <Link href="/contact" className="btn btn-sun text-base !px-7 !py-4">Book a free call <ArrowRight size={18} /></Link>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-base !px-7 !py-4"><MessageCircle size={18} /> WhatsApp us</a>
        </div>
      </div>
    </section>
  );
}
