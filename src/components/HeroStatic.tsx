import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type HeroContent = {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  sub: string;
  primaryCta: string;
  secondaryCta: string;
};

export const HERO_DEFAULT: HeroContent = {
  eyebrow: "Digital Marketing Agency · Delhi NCR",
  headline: "Make your brand",
  headlineAccent: "impossible to ignore.",
  sub: "SEO, social, ads, content and websites, built around one number: revenue. Reports in rupees, not likes.",
  primaryCta: "Get a Free Growth Audit",
  secondaryCta: "See Results",
};

/** Lightweight hero for mobile, reduced-motion and the first idle frame: same message as the 3D scene, no canvas. */
export default function HeroStatic({ hero = HERO_DEFAULT }: { hero?: HeroContent }) {
  return (
    <section className="relative overflow-hidden -mt-20 pt-32 pb-20 md:pt-44 md:pb-28 min-h-[100svh] flex items-center">
      <div className="absolute inset-0 dots" aria-hidden="true" />
      <div className="hero-blob hero-blob-a" aria-hidden="true" />
      <div className="hero-blob hero-blob-b" aria-hidden="true" />
      <div className="container-x relative">
        <div className="max-w-2xl">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1] mt-5">
            {hero.headline}<br /><span className="gradient-text">{hero.headlineAccent}</span>
          </h1>
          <p className="text-muted text-base md:text-xl mt-5 md:mt-6 leading-relaxed">{hero.sub}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-7 md:mt-8">
            <Link href="/contact" className="btn btn-primary text-base !px-7 !py-4">{hero.primaryCta} <ArrowRight size={18} /></Link>
            <Link href="/case-studies" className="btn btn-ghost text-base !px-7 !py-4">{hero.secondaryCta}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
