import { cache } from "react";
import { db } from "./db";
import { SITE } from "./site";

/**
 * Lightweight CMS: a typed registry of editable text blocks per page.
 * Defaults live here; admin overrides are stored in Redis under `content:<page>`
 * as a flat record { key: value }. Pages read them server-side only, so they stay ISR-cacheable.
 */
export type BlockKind = "text" | "textarea" | "markdown" | "list";

export type Block = {
  page: string;
  key: string;
  label: string;
  kind: BlockKind;
  default: string | string[];
  /** Short helper shown under the field in the admin. */
  hint?: string;
};

export type ContentPage = { id: string; label: string; path: string; description: string };

export const CONTENT_PAGES: ContentPage[] = [
  { id: "home", label: "Home", path: "/", description: "Hero text, CTA labels and the four headline stats." },
  { id: "about", label: "About", path: "/about", description: "Hero headline, intro and the story paragraphs." },
  { id: "pricing", label: "Pricing", path: "/pricing", description: "Intro, the three plan names, prices and blurbs, footnote." },
  { id: "contact", label: "Contact", path: "/contact", description: "Headline, intro and office hours." },
  { id: "services", label: "Services hub", path: "/services", description: "Headline and intro of the services overview." },
  { id: "global", label: "Global", path: "/", description: "Announcement bar, footer blurb and the bottom CTA band on every page." },
];

export const BLOCKS: Block[] = [
  /* ---------------------------------------------------------------- home */
  { page: "home", key: "heroEyebrow", label: "Hero eyebrow", kind: "text", default: "Digital Marketing Agency · Delhi NCR" },
  { page: "home", key: "heroHeadline", label: "Hero headline (line 1)", kind: "text", default: "Make your brand" },
  { page: "home", key: "heroHeadlineAccent", label: "Hero headline (line 2, gradient)", kind: "text", default: "impossible to ignore." },
  { page: "home", key: "heroSub", label: "Hero subheadline", kind: "textarea", default: "SEO, social, ads, content and websites, built around one number: revenue. Reports in rupees, not likes." },
  { page: "home", key: "heroPrimaryCta", label: "Primary CTA label", kind: "text", default: "Get a Free Growth Audit" },
  { page: "home", key: "heroSecondaryCta", label: "Secondary CTA label", kind: "text", default: "See Results" },
  {
    page: "home",
    key: "stats",
    label: "Headline stats (4 items)",
    kind: "list",
    hint: "One per line as value|label, e.g. 3.2x|Average ROAS on paid campaigns. The number animates; the suffix (x, %, +, h) is kept.",
    default: ["3.2x|Average ROAS on paid campaigns", "180%|Average organic traffic growth in 6 months", "50+|Brands scaled across India", "24h|Trend-to-creative turnaround"],
  },

  /* ---------------------------------------------------------------- about */
  { page: "about", key: "heroHeadline", label: "Hero headline (line 1)", kind: "text", default: "A growth team," },
  { page: "about", key: "heroHeadlineAccent", label: "Hero headline (gradient part)", kind: "text", default: "not a vendor." },
  {
    page: "about",
    key: "intro",
    label: "Intro paragraph",
    kind: "textarea",
    default: `${SITE.name} is a digital marketing agency in Delhi NCR that runs SEO, social media, paid ads, content, web development and automation for brands across India. We are judged on leads and revenue, and we report that way.`,
  },
  { page: "about", key: "storyHeadline", label: "Story headline", kind: "text", default: `Why we started ${SITE.name}` },
  {
    page: "about",
    key: "story",
    label: "Story (markdown)",
    kind: "markdown",
    hint: "Markdown. Blank line between paragraphs.",
    default: [
      `Before ${SITE.name}, we sat on the client side of agency meetings in Delhi and Gurugram. Every month a beautiful PDF arrived: impressions up, reach up, engagement up. Every month the cost per lead quietly went up too, and nobody on the agency side could say which campaign had brought the last ten customers.`,
      `So in ${SITE.foundingYear} we built the agency we wished we could have hired. One where tracking goes live before the first rupee is spent. One where the weekly update is a short note about what changed and what it did to cost per lead. One that launches in a week instead of spending a month on onboarding decks, and that keeps clients by performing rather than by contract.`,
      `Today we work with clinics in South Delhi and Faridabad, D2C brands shipping across India, a NEET-prep app, a clean-beauty label and businesses across 6 industries. The work is different every time; the rules are the same: own the numbers, move fast, tell the truth.`,
    ].join("\n\n"),
  },

  /* ---------------------------------------------------------------- pricing */
  { page: "pricing", key: "headline", label: "Hero headline (line 1)", kind: "text", default: "Transparent packages." },
  { page: "pricing", key: "headlineAccent", label: "Hero headline (gradient part)", kind: "text", default: "No hidden fees." },
  { page: "pricing", key: "intro", label: "Intro", kind: "textarea", default: "Pick a plan or ask for a custom quote. Every plan includes tracking, reporting and a real human who answers your WhatsApp." },
  { page: "pricing", key: "plan1Name", label: "Plan 1 name", kind: "text", default: "Starter" },
  { page: "pricing", key: "plan1Price", label: "Plan 1 price (per month, digits)", kind: "text", default: "15,000" },
  { page: "pricing", key: "plan1Desc", label: "Plan 1 blurb", kind: "textarea", default: "For small businesses starting with one channel: SEO, social media or ads." },
  { page: "pricing", key: "plan2Name", label: "Plan 2 name", kind: "text", default: "Growth" },
  { page: "pricing", key: "plan2Price", label: "Plan 2 price (per month, digits)", kind: "text", default: "40,000" },
  { page: "pricing", key: "plan2Desc", label: "Plan 2 blurb", kind: "textarea", default: "For businesses that want leads now and organic growth for later." },
  { page: "pricing", key: "plan3Name", label: "Plan 3 name", kind: "text", default: "Scale" },
  { page: "pricing", key: "plan3Price", label: "Plan 3 price (per month, digits)", kind: "text", default: "90,000" },
  { page: "pricing", key: "plan3Desc", label: "Plan 3 blurb", kind: "textarea", default: "The complete team: SEO, social, paid, content, email/WhatsApp and creative." },
  { page: "pricing", key: "footnote", label: "Footnote under plans", kind: "text", default: "Prices exclude GST and ad spend. Website design and branding are quoted per project." },

  /* ---------------------------------------------------------------- contact */
  { page: "contact", key: "headline", label: "Headline (line 1)", kind: "text", default: "Let us build your" },
  { page: "contact", key: "headlineAccent", label: "Headline (gradient part)", kind: "text", default: "growth plan." },
  {
    page: "contact",
    key: "intro",
    label: "Intro",
    kind: "textarea",
    default: "Fill the form and a strategist will call you within 2 business hours with first observations about your website and marketing. Prefer to talk now? Call or WhatsApp us directly.",
  },
  {
    page: "contact",
    key: "officeHours",
    label: "Office hours",
    kind: "list",
    hint: "One per line as label|value, e.g. Monday to Saturday|10:00 am to 7:00 pm IST",
    default: ["Monday to Saturday|10:00 am to 7:00 pm IST", "Sunday|WhatsApp only", "Form and WhatsApp replies|Within 2 business hours"],
  },

  /* ---------------------------------------------------------------- services hub */
  { page: "services", key: "headline", label: "Headline (line 1)", kind: "text", default: "Full-funnel digital marketing services in" },
  { page: "services", key: "headlineAccent", label: "Headline (gradient part)", kind: "text", default: "Delhi NCR" },
  {
    page: "services",
    key: "intro",
    label: "Intro",
    kind: "textarea",
    hint: "{total} is replaced with the number of specialist services.",
    default: "Seven service families, {total} specialist services, one team. Start with the channel that pays back fastest for your business, or hand us the whole funnel. Every engagement includes tracking, a live dashboard and a named growth manager.",
  },

  /* ---------------------------------------------------------------- global */
  { page: "global", key: "announcement", label: "Announcement bar", kind: "text", hint: "Leave empty to hide. Overrides the Settings announcement when set.", default: "" },
  {
    page: "global",
    key: "footerBlurb",
    label: "Footer blurb",
    kind: "textarea",
    default: `${SITE.name} is a performance-driven digital marketing agency in ${SITE.city}. We turn clicks into customers with SEO, social media, paid ads, content and design.`,
  },
  { page: "global", key: "ctaHeadline", label: "CTA band headline", kind: "text", default: "Ready to grow your business?" },
  { page: "global", key: "ctaSub", label: "CTA band subline", kind: "textarea", default: "Book a free 30-minute strategy call. You leave with a written plan and real numbers for your industry, no pitch deck." },
];

export type ContentValues = Record<string, string | string[]>;

export type PageContent = {
  /** Text value (lists are joined with newlines). */
  get(key: string): string;
  /** List value (text values are split on newlines). */
  list(key: string): string[];
  /** Raw merged values. */
  values: ContentValues;
};

export const blocksFor = (page: string) => BLOCKS.filter((b) => b.page === page);
export const isContentPage = (page: string) => CONTENT_PAGES.some((p) => p.id === page);
const contentKey = (page: string) => `content:${page}`;

export async function getOverrides(page: string): Promise<ContentValues> {
  try {
    return (await db.get<ContentValues>(contentKey(page))) || {};
  } catch {
    return {};
  }
}

function wrap(values: ContentValues): PageContent {
  return {
    values,
    get: (key) => {
      const v = values[key];
      return Array.isArray(v) ? v.join("\n") : v ?? "";
    },
    list: (key) => {
      const v = values[key];
      if (Array.isArray(v)) return v;
      return String(v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
    },
  };
}

/** Defaults merged with admin overrides. Memoised per request. */
export const getContent = cache(async (page: string): Promise<PageContent> => {
  const overrides = await getOverrides(page);
  const values: ContentValues = {};
  for (const b of blocksFor(page)) {
    const o = overrides[b.key];
    const has = Array.isArray(o) ? o.length > 0 : typeof o === "string" && o.length > 0;
    values[b.key] = has ? o : b.default;
  }
  return wrap(values);
});

/** Validate and store overrides. Values equal to the default (or empty) are dropped so defaults keep flowing through. */
export async function saveContent(page: string, input: Record<string, unknown>): Promise<ContentValues> {
  const clean: ContentValues = {};
  for (const b of blocksFor(page)) {
    const raw = input[b.key];
    if (raw === undefined || raw === null) continue;
    if (b.kind === "list") {
      const arr = (Array.isArray(raw) ? raw : String(raw).split("\n")).map((s) => String(s).trim().slice(0, 300)).filter(Boolean).slice(0, 50);
      if (arr.length && arr.join("\n") !== (b.default as string[]).join("\n")) clean[b.key] = arr;
    } else {
      const s = String(raw).replace(/\r\n/g, "\n").trim().slice(0, b.kind === "text" ? 300 : 8000);
      if (s && s !== b.default) clean[b.key] = s;
    }
  }
  if (Object.keys(clean).length) await db.set(contentKey(page), clean);
  else await db.del(contentKey(page));
  return clean;
}

/** Split "value|label" list items. */
export function splitPair(item: string): [string, string] {
  const i = item.indexOf("|");
  return i === -1 ? [item.trim(), ""] : [item.slice(0, i).trim(), item.slice(i + 1).trim()];
}

/** Parse "3.2x" -> { value: 3.2, suffix: "x", decimals: 1 } for the animated counters. */
export function parseStat(v: string): { value: number; suffix: string; decimals: number } {
  const m = v.trim().match(/^([\d.,]+)\s*(.*)$/);
  if (!m) return { value: 0, suffix: v, decimals: 0 };
  const num = m[1].replace(/,/g, "");
  const value = Number(num) || 0;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { value, suffix: m[2], decimals };
}

/** Paths to revalidate after saving a page's content. */
export function pathsFor(page: string): string[] {
  const p = CONTENT_PAGES.find((x) => x.id === page);
  return Array.from(new Set(["/", p?.path ?? "/"]));
}
