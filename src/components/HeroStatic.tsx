import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Lightweight hero for mobile, reduced-motion and the first idle frame: same message as the 3D scene, no canvas. */
export default function HeroStatic() {
  return (
    <section className="relative overflow-hidden -mt-20 pt-32 pb-20 md:pt-44 md:pb-28 min-h-[100svh] flex items-center">
      <div className="absolute inset-0 dots" aria-hidden="true" />
      <div className="hero-blob hero-blob-a" aria-hidden="true" />
      <div className="hero-blob hero-blob-b" aria-hidden="true" />
      <div className="container-x relative">
        <div className="max-w-2xl">
          <span className="eyebrow">Digital Marketing Agency · Delhi NCR</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1] mt-5">
            Make your brand<br /><span className="gradient-text">impossible to ignore.</span>
          </h1>
          <p className="text-muted text-base md:text-xl mt-5 md:mt-6 leading-relaxed">SEO, social, ads, content and websites, built around one number: revenue. Reports in rupees, not likes.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-7 md:mt-8">
            <Link href="/contact" className="btn btn-primary text-base !px-7 !py-4">Get a Free Growth Audit <ArrowRight size={18} /></Link>
            <Link href="/case-studies" className="btn btn-ghost text-base !px-7 !py-4">See Results</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
