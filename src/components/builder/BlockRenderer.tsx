import Link from "next/link";
import Image from "next/image";
import { marked } from "marked";
import { ArrowRight, MessageCircle, Quote } from "lucide-react";
import { SERVICES, SITE, WORK, serviceUrl } from "@/lib/site";
import { asItems, bool, num, sanitizeHtml, str, strList, withDefaults, type Block } from "@/lib/builder";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import Counter from "@/components/Counter";
import FAQ from "@/components/FAQ";
import LeadForm from "@/components/LeadForm";
import RelatedWork from "@/components/RelatedWork";
import ServiceIcon from "@/components/ServiceIcon";
import ServiceArt from "@/components/ServiceArt";
import BuilderIcon from "./BuilderIcon";

/**
 * Server component: turns a list of builder blocks into the site's own markup.
 * Every block renders inside an element whose id is the block id, so the editor can deep-link to it.
 */

type Bg = "none" | "tint" | "dark";

function md(src: string): string {
  if (!src.trim()) return "";
  return sanitizeHtml(marked.parse(src, { gfm: true, breaks: false, async: false }) as string);
}

function waHref(text = "Hi ClickSemrus! I want to book a free strategy call.") {
  return `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

/** Link that handles internal paths, external URLs and the `whatsapp` shortcut. */
function Btn({ href, label, className }: { href: string; label: string; className: string }) {
  if (!label.trim()) return null;
  const h = href.trim() || "/contact";
  if (h === "whatsapp") {
    return (
      <a href={waHref()} target="_blank" rel="noopener noreferrer" className={className}>
        <MessageCircle size={18} /> {label}
      </a>
    );
  }
  if (/^https?:\/\//i.test(h)) {
    return (
      <a href={h} target="_blank" rel="noopener noreferrer" className={className}>
        {label} <ArrowRight size={18} />
      </a>
    );
  }
  if (/^(tel:|mailto:)/i.test(h)) {
    return <a href={h} className={className}>{label} <ArrowRight size={18} /></a>;
  }
  return (
    <Link href={h.startsWith("/") || h.startsWith("#") ? h : `/${h}`} className={className}>
      {label} <ArrowRight size={18} />
    </Link>
  );
}

function Band({ id, bg, className = "", children }: { id: string; bg: Bg; className?: string; children: React.ReactNode }) {
  const cls = bg === "tint" ? "section-tint" : bg === "dark" ? "section-dark" : "";
  return (
    <section id={id} className={`relative overflow-hidden scroll-mt-24 ${cls} ${className}`}>
      {bg !== "none" && <div className="absolute inset-0 dots opacity-50" />}
      <div className="relative">{children}</div>
    </section>
  );
}

function Heading({ eyebrow, heading, sub, center = false, size = "lg" }: { eyebrow: string; heading: string; sub?: string; center?: boolean; size?: "lg" | "md" }) {
  if (!eyebrow && !heading && !sub) return null;
  return (
    <Reveal className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <span className={`eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</span>}
      {heading && <h2 className={`font-display font-extrabold mt-4 leading-[1.05] ${size === "lg" ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl"}`}>{heading}</h2>}
      {sub && <p className="text-muted mt-4 text-lg">{sub}</p>}
    </Reveal>
  );
}

const asBg = (v: unknown): Bg => (v === "tint" || v === "dark" ? v : "none");

/* ---------------------------------------------------------------- blocks */

type HeroProps = { eyebrow: string; headline: string; headlineAccent: string; sub: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string; align: string; background: string; image: string; imageAlt: string; tag: string };
function Hero({ id, props }: { id: string; props: Record<string, unknown> }) {
  const p = withDefaults<HeroProps>("hero", props);
  const center = p.align === "center";
  const bg = p.background === "dark" ? "section-dark" : p.background === "mesh" ? "mesh" : "";
  const Tag: "h1" | "h2" = p.tag === "h2" ? "h2" : "h1";
  const image = str(p.image);
  return (
    <section id={id} className={`relative overflow-hidden scroll-mt-24 ${bg}`}>
      <div className="absolute inset-0 dots opacity-70" />
      {p.background !== "light" && <div className={`blob w-[26rem] h-[26rem] -top-32 -right-20 ${p.background === "dark" ? "bg-[#4f46e5]" : "bg-brand"}`} />}
      <div className={`container-x relative pt-14 md:pt-20 pb-14 ${image ? "grid lg:grid-cols-2 gap-10 items-center" : ""}`}>
        <Reveal className={center && !image ? "max-w-3xl mx-auto text-center" : "max-w-3xl"}>
          {p.eyebrow && <span className={`eyebrow ${center && !image ? "justify-center" : ""}`}>{p.eyebrow}</span>}
          <Tag className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-[1.02]">
            {p.headline} {p.headlineAccent && <span className={p.background === "dark" ? "text-[#8b84ff]" : "gradient-text"}>{p.headlineAccent}</span>}
          </Tag>
          {p.sub && <p className="text-muted text-lg mt-6 leading-relaxed">{p.sub}</p>}
          <div className={`flex gap-3 mt-8 flex-wrap ${center && !image ? "justify-center" : ""}`}>
            <Btn href={p.primaryHref} label={p.primaryLabel} className="btn btn-primary" />
            <Btn href={p.secondaryHref} label={p.secondaryLabel} className="btn btn-ghost" />
          </div>
        </Reveal>
        {image && (
          <Reveal delay={90} variant="zoom">
            <Image src={image} alt={p.imageAlt} width={1200} height={900} unoptimized className="w-full h-auto rounded-3xl shadow-[0_30px_60px_-28px_rgba(79,70,229,.45)]" />
          </Reveal>
        )}
      </div>
    </section>
  );
}

type RichTextProps = { eyebrow: string; heading: string; body: string; width: string; background: string };
function RichText({ id, props }: { id: string; props: Record<string, unknown> }) {
  const p = withDefaults<RichTextProps>("richText", props);
  return (
    <Band id={id} bg={asBg(p.background)} className="py-14 md:py-20">
      <div className={`container-x ${p.width === "narrow" ? "max-w-3xl" : ""}`}>
        <Heading eyebrow={p.eyebrow} heading={p.heading} />
        {p.body && <Reveal delay={60}><div className={`prose ${p.eyebrow || p.heading ? "mt-8" : ""} ${p.background === "dark" ? "!text-white/85" : ""}`} dangerouslySetInnerHTML={{ __html: md(p.body) }} /></Reveal>}
      </div>
    </Band>
  );
}

type FeaturesProps = { eyebrow: string; heading: string; sub: string; columns: string; style: string; background: string };
const COLS: Record<string, string> = { "2": "sm:grid-cols-2", "3": "sm:grid-cols-2 lg:grid-cols-3", "4": "sm:grid-cols-2 lg:grid-cols-4" };
function Features({ id, props }: { id: string; props: Record<string, unknown> }) {
  const p = withDefaults<FeaturesProps>("features", props);
  const items = asItems(props.items);
  const dark = p.background === "dark";
  return (
    <Band id={id} bg={asBg(p.background)} className="py-16 md:py-24">
      <div className="container-x">
        <Heading eyebrow={p.eyebrow} heading={p.heading} sub={p.sub} />
        <div className={`grid grid-cols-1 ${COLS[p.columns] ?? COLS["3"]} gap-4 sm:gap-5 ${p.eyebrow || p.heading ? "mt-10 sm:mt-12" : ""}`}>
          {items.map((it, i) => (
            <Reveal key={i} delay={(i % 4) * 80}>
              {p.style === "numbered" ? (
                <div className={`card num-card p-6 h-full ${dark ? "glass" : ""}`} data-num={`0${i + 1}`}>
                  <h3 className="font-display text-xl font-bold pr-10">{str(it.title)}</h3>
                  {str(it.text) && <p className="text-muted text-sm mt-2 leading-relaxed">{str(it.text)}</p>}
                </div>
              ) : (
                <div className={`card p-6 h-full ${dark ? "glass" : ""}`}>
                  <span className={`grid place-items-center w-11 h-11 rounded-xl ${dark ? "bg-white text-[#0b0b14]" : "bg-[#0b0b14] text-white"}`}><BuilderIcon name={str(it.icon)} /></span>
                  <h3 className="font-display text-xl font-bold mt-5">{str(it.title)}</h3>
                  {str(it.text) && <p className="text-muted text-sm mt-2 leading-relaxed">{str(it.text)}</p>}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  );
}

function Stats({ id, props }: { id: string; props: Record<string, unknown> }) {
  const items = asItems(props.items).slice(0, 8);
  const note = str(props.note);
  return (
    <section id={id} className="relative overflow-hidden scroll-mt-24 py-14 md:py-20">
      <div className="container-x grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {items.map((s, i) => {
          const v = num(s.value);
          return (
            <Reveal key={i} delay={i * 90}>
              <TiltCard className="p-4 sm:p-7 h-full">
                <p className="font-display text-3xl sm:text-5xl font-extrabold"><Counter to={v} suffix={str(s.suffix)} decimals={Number.isInteger(v) ? 0 : 1} /></p>
                <p className="text-muted mt-2 text-sm font-medium">{str(s.label)}</p>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
      {note && <p className="container-x text-xs text-muted mt-6">{note}</p>}
    </section>
  );
}

type StepsProps = { eyebrow: string; heading: string; sub: string };
function Steps({ id, props }: { id: string; props: Record<string, unknown> }) {
  const p = withDefaults<StepsProps>("steps", props);
  const items = asItems(props.items).slice(0, 6);
  return (
    <section id={id} className="container-x scroll-mt-24 py-16 md:py-24">
      <Heading eyebrow={p.eyebrow} heading={p.heading} sub={p.sub} />
      <ol className="timeline mt-12" style={{ "--steps": items.length } as React.CSSProperties}>
        {items.map((h, i) => (
          <li key={i} className="timeline-step">
            <span className="timeline-dot">{i + 1}</span>
            <Reveal delay={i * 90}>
              <div className="card p-6 h-full">
                {str(h.when) && <p className="text-xs font-bold text-muted tracking-widest uppercase">{str(h.when)}</p>}
                <h3 className="font-display text-xl font-bold mt-2">{str(h.title)}</h3>
                {str(h.text) && <p className="text-sm text-muted mt-2 leading-relaxed">{str(h.text)}</p>}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

type ServicesProps = { eyebrow: string; heading: string; sub: string; limit: number };
function Services({ id, props }: { id: string; props: Record<string, unknown> }) {
  const p = withDefaults<ServicesProps>("services", props);
  const pick = strList(props.pick);
  const list = (pick.length ? pick.map((s) => SERVICES.find((x) => x.slug === s)).filter((x): x is (typeof SERVICES)[number] => Boolean(x)) : SERVICES).slice(0, Math.max(1, num(p.limit, 9)));
  return (
    <section id={id} className="relative overflow-hidden scroll-mt-24 py-16 md:py-24">
      <div className="container-x">
        <Heading eyebrow={p.eyebrow} heading={p.heading} sub={p.sub} />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-10 sm:mt-14">
          {list.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 90}>
              <Link href={serviceUrl(s.slug)} className="block h-full group">
                <TiltCard className="p-4 sm:p-7 h-full overflow-hidden">
                  <span className="hidden sm:block"><ServiceArt slug={s.slug} /></span>
                  <span className="inline-grid place-items-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#0b0b14] text-white group-hover:bg-brand transition">
                    <ServiceIcon name={s.icon} size={20} />
                  </span>
                  <h3 className="font-display text-base sm:text-2xl font-bold mt-3 sm:mt-6 leading-snug">{s.name}</h3>
                  <p className="text-muted mt-2 leading-relaxed hidden sm:block">{s.short}</p>
                  <span className="inline-flex items-center gap-1 font-bold text-brand text-sm sm:text-base mt-3 sm:mt-5 group-hover:gap-3 transition-all">Explore <ArrowRight size={16} /></span>
                </TiltCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work({ id, props }: { id: string; props: Record<string, unknown> }) {
  const pick = strList(props.pick);
  const items = pick.length ? pick.map((s) => WORK.find((w) => w.slug === s)).filter((w): w is (typeof WORK)[number] => Boolean(w)) : WORK;
  return <RelatedWork id={id} items={items} limit={Math.max(1, num(props.limit, 3))} title={str(props.title) || str(props.heading)} sub={str(props.sub)} tint={bool(props.tint)} />;
}

type TestimonialsProps = { eyebrow: string; heading: string };
function Testimonials({ id, props }: { id: string; props: Record<string, unknown> }) {
  const p = withDefaults<TestimonialsProps>("testimonials", props);
  const items = asItems(props.items);
  return (
    <Band id={id} bg="tint" className="py-16 md:py-24">
      <div className="container-x">
        <Heading eyebrow={p.eyebrow} heading={p.heading} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-10 sm:mt-12">
          {items.map((t, i) => (
            <Reveal key={i} delay={(i % 3) * 80}>
              <figure className="card p-6 h-full flex flex-col !transform-none">
                <Quote size={22} className="text-brand/50" />
                <blockquote className="mt-3 leading-relaxed flex-1">{str(t.quote)}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand text-white grid place-items-center font-bold shrink-0">{str(t.name).charAt(0).toUpperCase() || "?"}</span>
                  <span className="min-w-0">
                    <span className="block font-bold text-sm truncate">{str(t.name)}</span>
                    {str(t.role) && <span className="block text-xs text-muted truncate">{str(t.role)}</span>}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  );
}

type FaqProps = { eyebrow: string; heading: string };
function Faq({ id, props }: { id: string; props: Record<string, unknown> }) {
  const p = withDefaults<FaqProps>("faq", props);
  const items = asItems(props.items).map((i) => ({ q: str(i.q), a: str(i.a) })).filter((f) => f.q);
  return (
    <section id={id} className="container-x scroll-mt-24 py-16 max-w-3xl">
      <Heading eyebrow={p.eyebrow} heading={p.heading} center />
      {items.length > 0 && <div className="mt-10"><FAQ items={items} /></div>}
    </section>
  );
}

type CtaProps = { eyebrow: string; headline: string; sub: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string; style: string };
function Cta({ id, props }: { id: string; props: Record<string, unknown> }) {
  const p = withDefaults<CtaProps>("cta", props);
  const brand = p.style === "brand";
  return (
    <section id={id} className={`relative overflow-hidden scroll-mt-24 ${brand ? "bg-gradient-to-br from-brand to-brand-2 text-white" : "section-dark"}`}>
      <div className="absolute inset-0 dots" />
      {!brand && <div className="blob w-96 h-96 bg-[#4f46e5] -left-24 -top-24 opacity-50" />}
      <div className="container-x relative py-20 md:py-28 text-center">
        {p.eyebrow && <span className={`eyebrow ${brand ? "!text-white/80" : ""}`}>{p.eyebrow}</span>}
        <h2 className="font-display text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.02] mt-5">{p.headline}</h2>
        {p.sub && <p className={`mt-5 max-w-xl mx-auto text-lg ${brand ? "text-white/85" : "text-muted"}`}>{p.sub}</p>}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-9">
          <Btn href={p.primaryHref} label={p.primaryLabel} className={`btn text-base !px-7 !py-4 ${brand ? "bg-white text-[#0b0b14] hover:-translate-y-[3px]" : "btn-sun"}`} />
          <Btn href={p.secondaryHref} label={p.secondaryLabel} className={`btn text-base !px-7 !py-4 ${brand ? "border-[1.5px] border-white/50 text-white hover:bg-white/10" : "btn-ghost"}`} />
        </div>
      </div>
    </section>
  );
}

type LeadFormProps = { eyebrow: string; heading: string; sub: string; source: string; background: string };
function Lead({ id, props }: { id: string; props: Record<string, unknown> }) {
  const p = withDefaults<LeadFormProps>("leadForm", props);
  const points = asItems(props.points).map((x) => str(x.text)).filter(Boolean);
  return (
    <Band id={id} bg={p.background === "tint" ? "tint" : "none"} className="py-16 md:py-28">
      <div className="container-x grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        <Reveal>
          {p.eyebrow && <span className="eyebrow">{p.eyebrow}</span>}
          {p.heading && <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-5 leading-[1.05]">{p.heading}</h2>}
          {p.sub && <p className="text-muted mt-6 text-lg leading-relaxed">{p.sub}</p>}
          {points.length > 0 && (
            <ul className="mt-8 grid gap-3">
              {points.map((x) => (
                <li key={x} className="flex gap-3 items-center font-medium"><span className="w-7 h-7 rounded-full bg-[#0b0b14] text-white grid place-items-center text-sm font-black shrink-0">✓</span>{x}</li>
              ))}
            </ul>
          )}
        </Reveal>
        <Reveal delay={90}><div className="card p-6 md:p-9 !transform-none"><LeadForm source={p.source} /></div></Reveal>
      </div>
    </Band>
  );
}

const WIDTH: Record<string, string> = { full: "", container: "container-x", narrow: "container-x max-w-3xl" };

type ImageProps = { url: string; alt: string; caption: string; width: string; rounded: boolean };
function Img({ id, props }: { id: string; props: Record<string, unknown> }) {
  const p = withDefaults<ImageProps>("image", props);
  if (!p.url) return null;
  const full = p.width === "full";
  return (
    <figure id={id} className={`scroll-mt-24 ${full ? "" : "py-10 md:py-14"} ${WIDTH[p.width] ?? WIDTH.container}`}>
      <Image src={p.url} alt={p.alt} width={1600} height={900} unoptimized className={`w-full h-auto ${!full && p.rounded ? "rounded-3xl" : ""}`} />
      {p.caption && <figcaption className={`text-sm text-muted mt-3 text-center ${full ? "container-x" : ""}`}>{p.caption}</figcaption>}
    </figure>
  );
}

type TwoColProps = { eyebrow: string; heading: string; left: string; rightType: string; image: string; imageAlt: string; right: string; reverse: boolean; background: string; ctaLabel: string; ctaHref: string };
function TwoColumn({ id, props }: { id: string; props: Record<string, unknown> }) {
  const p = withDefaults<TwoColProps>("twoColumn", props);
  const dark = p.background === "dark";
  return (
    <Band id={id} bg={asBg(p.background)} className="py-16 md:py-24">
      <div className="container-x grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <Reveal variant="right" className={p.reverse ? "lg:order-2" : ""}>
          {p.eyebrow && <span className="eyebrow">{p.eyebrow}</span>}
          {p.heading && <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-4 leading-[1.05]">{p.heading}</h2>}
          {p.left && <div className={`prose mt-5 ${dark ? "!text-white/85" : ""}`} dangerouslySetInnerHTML={{ __html: md(p.left) }} />}
          {p.ctaLabel && <div className="mt-8"><Btn href={p.ctaHref} label={p.ctaLabel} className="btn btn-primary" /></div>}
        </Reveal>
        <Reveal delay={90} className={p.reverse ? "lg:order-1" : ""}>
          {p.rightType === "image" ? (
            p.image ? <Image src={p.image} alt={p.imageAlt} width={1200} height={900} unoptimized className="w-full h-auto rounded-3xl shadow-[0_30px_60px_-28px_rgba(79,70,229,.35)]" /> : null
          ) : (
            <div className={`card p-6 md:p-8 !transform-none ${dark ? "glass" : ""}`}><div className={`prose ${dark ? "!text-white/85" : ""}`} dangerouslySetInnerHTML={{ __html: md(p.right) }} /></div>
          )}
        </Reveal>
      </div>
    </Band>
  );
}

const SPACER: Record<string, string> = { sm: "h-6 md:h-8", md: "h-12 md:h-16", lg: "h-20 md:h-28", xl: "h-28 md:h-40" };
function Spacer({ id, props }: { id: string; props: Record<string, unknown> }) {
  const size = str(props.size, "md");
  return (
    <div id={id} className={`${SPACER[size] ?? SPACER.md} ${bool(props.divider) ? "relative" : ""}`} aria-hidden="true">
      {bool(props.divider) && <div className="container-x absolute inset-x-0 top-1/2"><hr className="border-border" /></div>}
    </div>
  );
}

function Html({ id, props }: { id: string; props: Record<string, unknown> }) {
  const html = sanitizeHtml(str(props.html));
  if (!html.trim()) return null;
  const width = str(props.width, "container");
  return <div id={id} className={`scroll-mt-24 py-10 ${WIDTH[width] ?? WIDTH.container} builder-html`} dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ---------------------------------------------------------------- renderer */

export function RenderBlock({ block }: { block: Block }) {
  const { id, props } = block;
  switch (block.type) {
    case "hero": return <Hero id={id} props={props} />;
    case "richText": return <RichText id={id} props={props} />;
    case "features": return <Features id={id} props={props} />;
    case "stats": return <Stats id={id} props={props} />;
    case "steps": return <Steps id={id} props={props} />;
    case "services": return <Services id={id} props={props} />;
    case "work": return <Work id={id} props={props} />;
    case "testimonials": return <Testimonials id={id} props={props} />;
    case "faq": return <Faq id={id} props={props} />;
    case "cta": return <Cta id={id} props={props} />;
    case "leadForm": return <Lead id={id} props={props} />;
    case "image": return <Img id={id} props={props} />;
    case "twoColumn": return <TwoColumn id={id} props={props} />;
    case "spacer": return <Spacer id={id} props={props} />;
    case "html": return <Html id={id} props={props} />;
    default: return null;
  }
}

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b) => <RenderBlock key={b.id} block={b} />)}
    </>
  );
}
