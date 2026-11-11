/**
 * Visual page builder: block schema, registry and pure helpers.
 * Nothing in this file touches Redis so it is safe to import from client components.
 * Storage lives in ./builderStore.ts.
 */

export type BlockType =
  | "hero"
  | "richText"
  | "features"
  | "stats"
  | "steps"
  | "services"
  | "work"
  | "testimonials"
  | "faq"
  | "cta"
  | "leadForm"
  | "image"
  | "twoColumn"
  | "spacer"
  | "html";

export type Block = { id: string; type: BlockType; props: Record<string, unknown> };

export type PageLayout = {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  status: "draft" | "published";
  blocks: Block[];
  updatedAt: string;
};

/* ---------------------------------------------------------------- field schema */
export type FieldKind = "text" | "textarea" | "markdown" | "number" | "select" | "toggle" | "color" | "image" | "link" | "list" | "services" | "work" | "icon";

export type Field = {
  key: string;
  label: string;
  kind: FieldKind;
  hint?: string;
  options?: { value: string; label: string }[];
  /** Sub-fields for `list` items. */
  fields?: Field[];
  /** Default for a new list item (list kind only). */
  itemDefault?: Record<string, unknown>;
  /** Short label used for list rows, e.g. "title". */
  itemLabelKey?: string;
  min?: number;
  max?: number;
  placeholder?: string;
};

export type BlockGroup = "Layout" | "Content" | "Proof" | "Conversion" | "Advanced";

export type BlockDef = {
  type: BlockType;
  label: string;
  /** lucide-react icon name resolved in the admin palette. */
  icon: string;
  group: BlockGroup;
  description: string;
  defaults: Record<string, unknown>;
  fields: Field[];
};

/** Icons the owner can pick for feature items. Resolved in components/builder/BuilderIcon.tsx. */
export const ICON_OPTIONS = [
  "Target", "Zap", "BarChart3", "TrendingUp", "Star", "Award", "Search", "Share2", "MousePointerClick", "Megaphone", "PenTool", "Code2", "Users",
  "MessageCircle", "Sparkles", "IndianRupee", "Eye", "Palette", "FileText", "Lock", "Clock", "MapPin", "Layers", "Wrench", "Heart", "Check", "Shield",
  "Rocket", "Globe", "Phone", "Mail", "ThumbsUp", "Lightbulb", "Smartphone", "ShoppingBag", "Camera", "Video", "Headphones",
] as const;
export type IconName = (typeof ICON_OPTIONS)[number];

const iconField = (key = "icon", label = "Icon"): Field => ({ key, label, kind: "icon", options: ICON_OPTIONS.map((v) => ({ value: v, label: v })) });

const linkFields = (prefix: string, label: string, defaultLabel: string, defaultHref: string): Field[] => [
  { key: `${prefix}Label`, label: `${label} label`, kind: "text", placeholder: defaultLabel },
  { key: `${prefix}Href`, label: `${label} link`, kind: "link", placeholder: defaultHref, hint: "Internal path like /contact or a full https:// URL. Leave the label empty to hide the button." },
];

/* ---------------------------------------------------------------- registry */
export const BLOCK_DEFS: Record<BlockType, BlockDef> = {
  hero: {
    type: "hero",
    label: "Hero",
    icon: "Sparkles",
    group: "Layout",
    description: "Big headline with gradient word, subline and two buttons.",
    defaults: {
      eyebrow: "Digital Marketing Agency · Delhi NCR",
      headline: "Make your brand",
      headlineAccent: "impossible to ignore.",
      sub: "SEO, social, ads, content and websites, built around one number: revenue.",
      primaryLabel: "Get a Free Growth Audit",
      primaryHref: "/contact",
      secondaryLabel: "See Results",
      secondaryHref: "/case-studies",
      align: "left",
      background: "mesh",
      image: "",
      imageAlt: "",
      tag: "h1",
    },
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "headline", label: "Headline", kind: "text" },
      { key: "headlineAccent", label: "Gradient words", kind: "text", hint: "Shown after the headline in the brand gradient. Optional." },
      { key: "sub", label: "Subheadline", kind: "textarea" },
      ...linkFields("primary", "Primary button", "Get a Free Growth Audit", "/contact"),
      ...linkFields("secondary", "Secondary button", "See Results", "/case-studies"),
      { key: "align", label: "Alignment", kind: "select", options: [{ value: "left", label: "Left" }, { value: "center", label: "Centre" }] },
      { key: "background", label: "Background", kind: "select", options: [{ value: "mesh", label: "Soft mesh" }, { value: "dark", label: "Dark" }, { value: "light", label: "Plain" }] },
      { key: "image", label: "Image (optional)", kind: "image", hint: "Shown beside the text on desktop, under it on phones." },
      { key: "imageAlt", label: "Image alt text", kind: "text" },
      { key: "tag", label: "Headline tag", kind: "select", options: [{ value: "h1", label: "H1 (first hero on the page)" }, { value: "h2", label: "H2" }], hint: "Use one H1 per page for SEO." },
    ],
  },
  richText: {
    type: "richText",
    label: "Rich text",
    icon: "Type",
    group: "Content",
    description: "Markdown paragraphs, headings, lists and links.",
    defaults: { eyebrow: "", heading: "", body: "Write your content here. **Bold**, _italic_, [links](/contact) and lists all work.\n\n- Point one\n- Point two", width: "narrow", background: "none" },
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "heading", label: "Heading", kind: "text" },
      { key: "body", label: "Body (markdown)", kind: "markdown" },
      { key: "width", label: "Width", kind: "select", options: [{ value: "narrow", label: "Narrow (reading)" }, { value: "container", label: "Full container" }] },
      { key: "background", label: "Background", kind: "select", options: [{ value: "none", label: "None" }, { value: "tint", label: "Tinted band" }, { value: "dark", label: "Dark band" }] },
    ],
  },
  features: {
    type: "features",
    label: "Features",
    icon: "LayoutGrid",
    group: "Content",
    description: "Grid of cards with icon, title and text.",
    defaults: {
      eyebrow: "Why us",
      heading: "What you get",
      sub: "",
      columns: "3",
      style: "cards",
      background: "none",
      items: [
        { icon: "Target", title: "Audit & strategy", text: "We study your market, competitors and funnel, then build a 90-day growth plan with clear KPIs." },
        { icon: "Zap", title: "Launch in 7 days", text: "Campaigns, content and tracking go live within a week. No month-long onboarding." },
        { icon: "BarChart3", title: "Optimise weekly", text: "Every week we cut what does not work and scale what does, with a live dashboard." },
      ],
    },
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "heading", label: "Heading", kind: "text" },
      { key: "sub", label: "Subline", kind: "textarea" },
      { key: "columns", label: "Columns", kind: "select", options: [{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }] },
      { key: "style", label: "Style", kind: "select", options: [{ value: "cards", label: "Icon cards" }, { value: "numbered", label: "Numbered cards" }] },
      { key: "background", label: "Background", kind: "select", options: [{ value: "none", label: "None" }, { value: "tint", label: "Tinted band" }, { value: "dark", label: "Dark band" }] },
      {
        key: "items",
        label: "Items",
        kind: "list",
        itemLabelKey: "title",
        itemDefault: { icon: "Star", title: "New feature", text: "" },
        fields: [iconField(), { key: "title", label: "Title", kind: "text" }, { key: "text", label: "Text", kind: "textarea" }],
      },
    ],
  },
  stats: {
    type: "stats",
    label: "Stats",
    icon: "Hash",
    group: "Proof",
    description: "Animated counters in a row of cards.",
    defaults: {
      note: "",
      items: [
        { value: 3.2, suffix: "x", label: "Average ROAS on paid campaigns" },
        { value: 180, suffix: "%", label: "Average organic traffic growth in 6 months" },
        { value: 50, suffix: "+", label: "Brands scaled across India" },
        { value: 24, suffix: "h", label: "Trend-to-creative turnaround" },
      ],
    },
    fields: [
      {
        key: "items",
        label: "Numbers",
        kind: "list",
        itemLabelKey: "label",
        itemDefault: { value: 100, suffix: "+", label: "Label" },
        fields: [{ key: "value", label: "Value", kind: "number" }, { key: "suffix", label: "Suffix", kind: "text", placeholder: "x, %, +, h" }, { key: "label", label: "Label", kind: "text" }],
      },
      { key: "note", label: "Footnote", kind: "text", hint: "Small text under the numbers, e.g. the data source." },
    ],
  },
  steps: {
    type: "steps",
    label: "Steps / timeline",
    icon: "ListOrdered",
    group: "Content",
    description: "Numbered timeline, vertical on phones and horizontal on desktop.",
    defaults: {
      eyebrow: "How we work",
      heading: "From audit to scale in four steps",
      sub: "",
      items: [
        { when: "Day 0", title: "Free strategy call", text: "Thirty minutes, no pitch deck. We tell you honestly where the fastest payback is." },
        { when: "Day 1 to 7", title: "Audit and launch", text: "Tracking first, then the work. Campaigns are live within the week." },
        { when: "Every week", title: "Short written update", text: "What we changed, why, and what it did to cost per lead." },
      ],
    },
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "heading", label: "Heading", kind: "text" },
      { key: "sub", label: "Subline", kind: "textarea" },
      {
        key: "items",
        label: "Steps",
        kind: "list",
        itemLabelKey: "title",
        itemDefault: { when: "", title: "New step", text: "" },
        fields: [{ key: "when", label: "Small label (optional)", kind: "text", placeholder: "Day 0" }, { key: "title", label: "Title", kind: "text" }, { key: "text", label: "Text", kind: "textarea" }],
      },
    ],
  },
  services: {
    type: "services",
    label: "Services grid",
    icon: "Briefcase",
    group: "Content",
    description: "Cards linking to service pages, from the site's service list.",
    defaults: { eyebrow: "What we do", heading: "Every channel. One goal: growth.", sub: "Pick one service or let us run the full funnel.", pick: [], limit: 9 },
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "heading", label: "Heading", kind: "text" },
      { key: "sub", label: "Subline", kind: "textarea" },
      { key: "pick", label: "Services", kind: "services", hint: "Tick the services to show. None ticked = all services." },
      { key: "limit", label: "Maximum shown", kind: "number", min: 1, max: 12 },
    ],
  },
  work: {
    type: "work",
    label: "Portfolio",
    icon: "Images",
    group: "Proof",
    description: "Live project cards from the portfolio.",
    defaults: { heading: "Websites, stores and campaigns we run today", sub: "Live projects you can open right now.", pick: [], limit: 3, tint: false },
    fields: [
      { key: "heading", label: "Heading", kind: "text" },
      { key: "sub", label: "Subline", kind: "textarea" },
      { key: "pick", label: "Projects", kind: "work", hint: "Tick the projects to show. None ticked = all, newest first." },
      { key: "limit", label: "Maximum shown", kind: "number", min: 1, max: 12 },
      { key: "tint", label: "Tinted background", kind: "toggle" },
    ],
  },
  testimonials: {
    type: "testimonials",
    label: "Testimonials",
    icon: "Quote",
    group: "Proof",
    description: "Quotes with name and role.",
    defaults: {
      eyebrow: "Clients",
      heading: "What our clients say",
      items: [
        { name: "Dr. A. Kathuria", role: "Dental clinic, South Delhi", quote: "Our enquiries doubled within three months and we finally understand where every lead comes from." },
        { name: "Founder", role: "D2C skincare brand", quote: "Creatives in 24 hours, weekly numbers and no excuses. The first agency we have kept beyond a quarter." },
      ],
    },
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "heading", label: "Heading", kind: "text" },
      {
        key: "items",
        label: "Quotes",
        kind: "list",
        itemLabelKey: "name",
        itemDefault: { name: "Client name", role: "", quote: "" },
        fields: [{ key: "name", label: "Name", kind: "text" }, { key: "role", label: "Role / company", kind: "text" }, { key: "quote", label: "Quote", kind: "textarea" }],
      },
    ],
  },
  faq: {
    type: "faq",
    label: "FAQ",
    icon: "HelpCircle",
    group: "Content",
    description: "Accordion of questions and answers (also emits FAQ schema).",
    defaults: {
      eyebrow: "FAQs",
      heading: "Questions we hear every week",
      items: [
        { q: "How soon can we see results?", a: "Paid ads generate leads within the first week. SEO typically shows measurable growth in 8 to 12 weeks." },
        { q: "Is there a lock-in contract?", a: "No long lock-ins. We work month to month after an initial 3-month commitment for SEO." },
      ],
    },
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "heading", label: "Heading", kind: "text" },
      {
        key: "items",
        label: "Questions",
        kind: "list",
        itemLabelKey: "q",
        itemDefault: { q: "New question?", a: "" },
        fields: [{ key: "q", label: "Question", kind: "text" }, { key: "a", label: "Answer", kind: "textarea" }],
      },
    ],
  },
  cta: {
    type: "cta",
    label: "Call to action",
    icon: "Megaphone",
    group: "Conversion",
    description: "Full-width band with headline and buttons.",
    defaults: {
      eyebrow: "Let's talk",
      headline: "Ready to grow your business?",
      sub: "Book a free 30-minute strategy call. You leave with a written plan and real numbers for your industry.",
      primaryLabel: "Book a free call",
      primaryHref: "/contact",
      secondaryLabel: "WhatsApp us",
      secondaryHref: "whatsapp",
      style: "dark",
    },
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "headline", label: "Headline", kind: "text" },
      { key: "sub", label: "Subline", kind: "textarea" },
      ...linkFields("primary", "Primary button", "Book a free call", "/contact"),
      { key: "secondaryLabel", label: "Secondary button label", kind: "text" },
      { key: "secondaryHref", label: "Secondary button link", kind: "link", hint: "Type `whatsapp` to open the site's WhatsApp number." },
      { key: "style", label: "Style", kind: "select", options: [{ value: "dark", label: "Dark" }, { value: "brand", label: "Brand gradient" }] },
    ],
  },
  leadForm: {
    type: "leadForm",
    label: "Lead form",
    icon: "Mail",
    group: "Conversion",
    description: "The enquiry form with a benefits list beside it.",
    defaults: {
      eyebrow: "Free growth audit",
      heading: "Find out exactly where you are losing customers.",
      sub: "Within 48 hours you get a written audit of your website, SEO, social and ads, with a prioritised 90-day plan.",
      source: "",
      points: [{ text: "Website conversion and speed review" }, { text: "Keyword gaps vs your top 3 competitors" }, { text: "Ad account waste analysis" }],
      background: "tint",
    },
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "heading", label: "Heading", kind: "text" },
      { key: "sub", label: "Subline", kind: "textarea" },
      { key: "points", label: "Bullet points", kind: "list", itemLabelKey: "text", itemDefault: { text: "" }, fields: [{ key: "text", label: "Point", kind: "text" }] },
      { key: "source", label: "Lead source tag", kind: "text", hint: "Saved with each lead so you know which page it came from. Defaults to the page path." },
      { key: "background", label: "Background", kind: "select", options: [{ value: "none", label: "None" }, { value: "tint", label: "Tinted band" }] },
    ],
  },
  image: {
    type: "image",
    label: "Image",
    icon: "Image",
    group: "Content",
    description: "A single image with optional caption.",
    defaults: { url: "", alt: "", caption: "", width: "container", rounded: true },
    fields: [
      { key: "url", label: "Image", kind: "image" },
      { key: "alt", label: "Alt text", kind: "text", hint: "Describe the image for screen readers and Google." },
      { key: "caption", label: "Caption", kind: "text" },
      { key: "width", label: "Width", kind: "select", options: [{ value: "full", label: "Full bleed" }, { value: "container", label: "Container" }, { value: "narrow", label: "Narrow" }] },
      { key: "rounded", label: "Rounded corners", kind: "toggle" },
    ],
  },
  twoColumn: {
    type: "twoColumn",
    label: "Two columns",
    icon: "Columns2",
    group: "Layout",
    description: "Text on one side, image or more text on the other.",
    defaults: {
      eyebrow: "",
      heading: "A heading for this section",
      left: "Write the main text here in markdown.\n\nA second paragraph works too.",
      rightType: "image",
      image: "",
      imageAlt: "",
      right: "",
      reverse: false,
      background: "none",
      ctaLabel: "",
      ctaHref: "/contact",
    },
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "heading", label: "Heading", kind: "text" },
      { key: "left", label: "Text (markdown)", kind: "markdown" },
      ...linkFields("cta", "Button under the text", "Book a call", "/contact"),
      { key: "rightType", label: "Other column shows", kind: "select", options: [{ value: "image", label: "Image" }, { value: "markdown", label: "Text" }] },
      { key: "image", label: "Image", kind: "image" },
      { key: "imageAlt", label: "Image alt text", kind: "text" },
      { key: "right", label: "Other column text (markdown)", kind: "markdown" },
      { key: "reverse", label: "Swap sides", kind: "toggle" },
      { key: "background", label: "Background", kind: "select", options: [{ value: "none", label: "None" }, { value: "tint", label: "Tinted band" }, { value: "dark", label: "Dark band" }] },
    ],
  },
  spacer: {
    type: "spacer",
    label: "Spacer",
    icon: "MoveVertical",
    group: "Layout",
    description: "Empty vertical space.",
    defaults: { size: "md", divider: false },
    fields: [
      { key: "size", label: "Size", kind: "select", options: [{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }, { value: "xl", label: "Extra large" }] },
      { key: "divider", label: "Show a divider line", kind: "toggle" },
    ],
  },
  html: {
    type: "html",
    label: "Custom HTML",
    icon: "Code2",
    group: "Advanced",
    description: "Raw HTML rendered as-is. Scripts are removed.",
    defaults: { html: "<div class=\"card p-6\">\n  <h3 class=\"font-display text-2xl font-bold\">Custom block</h3>\n  <p class=\"text-muted mt-2\">Any HTML with the site's utility classes.</p>\n</div>", width: "container" },
    fields: [
      { key: "html", label: "HTML", kind: "markdown", hint: "Tailwind utility classes and site classes (.card, .btn, .eyebrow, .gradient-text) work. <script> tags and inline event handlers are stripped." },
      { key: "width", label: "Width", kind: "select", options: [{ value: "full", label: "Full bleed" }, { value: "container", label: "Container" }, { value: "narrow", label: "Narrow" }] },
    ],
  },
};

export const BLOCK_GROUPS: BlockGroup[] = ["Layout", "Content", "Proof", "Conversion", "Advanced"];
export const BLOCK_TYPES = Object.keys(BLOCK_DEFS) as BlockType[];
export const isBlockType = (t: unknown): t is BlockType => typeof t === "string" && t in BLOCK_DEFS;

/* ---------------------------------------------------------------- routes */
/** Existing hard-coded pages that a published layout can take over. */
export const TAKEOVER_PAGES: { slug: string; label: string; path: string }[] = [
  { slug: "home", label: "Home", path: "/" },
  { slug: "about", label: "About", path: "/about" },
  { slug: "pricing", label: "Pricing", path: "/pricing" },
  { slug: "contact", label: "Contact", path: "/contact" },
  { slug: "services", label: "Services hub", path: "/services" },
];
export const isTakeoverSlug = (slug: string) => TAKEOVER_PAGES.some((p) => p.slug === slug);
/** Slugs that would collide with the preview route or existing top-level routes. */
const RESERVED = new Set(["preview", "admin", "api", "blog", "services", "industries", "locations", "case-studies", "pricing", "about", "contact", "privacy-policy", "terms", "p"]);

/** Public URL for a layout slug. */
export function layoutPath(slug: string): string {
  return TAKEOVER_PAGES.find((p) => p.slug === slug)?.path ?? `/p/${slug}`;
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function validSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && slug.length <= 80 && (isTakeoverSlug(slug) || !RESERVED.has(slug));
}

/* ---------------------------------------------------------------- helpers */
export function newId(): string {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}

export function newBlock(type: BlockType): Block {
  return { id: newId(), type, props: structuredClone(BLOCK_DEFS[type].defaults) };
}

/** Merge defaults with saved props so renderers never see undefined keys. */
export function withDefaults<T extends Record<string, unknown>>(type: BlockType, props: Record<string, unknown>): T {
  return { ...BLOCK_DEFS[type].defaults, ...props } as T;
}

/** Keep only plain-object items from a list prop. */
export function asItems(v: unknown): Record<string, unknown>[] {
  return Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x)) : [];
}
export const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : fallback);
export const num = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)) ? Number(v) : fallback);
export const bool = (v: unknown, fallback = false): boolean => (typeof v === "boolean" ? v : fallback);
export const strList = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

/** Strip scripts, inline event handlers and javascript: URLs from owner-supplied HTML. */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<script\b[^>]*\/?>/gi, "")
    .replace(/<\/script\s*>/gi, "")
    .replace(/<(iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(iframe|object|embed)\b[^>]*\/?>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src|action|formaction)\s*=\s*(["']?)\s*javascript:[^"'\s>]*\2/gi, '$1=$2#$2');
}

/** Validate and normalise an untrusted layout payload. Returns null when it is not a layout. */
export function normalizeLayout(input: unknown): PageLayout | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;
  const slug = str(o.slug).trim().toLowerCase();
  if (!validSlug(slug)) return null;
  const blocks: Block[] = [];
  const seen = new Set<string>();
  for (const raw of Array.isArray(o.blocks) ? o.blocks : []) {
    if (!raw || typeof raw !== "object") continue;
    const b = raw as Record<string, unknown>;
    if (!isBlockType(b.type)) continue;
    let id = str(b.id).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || newId();
    while (seen.has(id)) id = newId();
    seen.add(id);
    const props = b.props && typeof b.props === "object" && !Array.isArray(b.props) ? (b.props as Record<string, unknown>) : {};
    if (b.type === "html") props.html = sanitizeHtml(str(props.html)).slice(0, 60_000);
    blocks.push({ id, type: b.type, props });
    if (blocks.length >= 80) break;
  }
  const status = o.status === "published" ? "published" : "draft";
  return {
    slug,
    title: str(o.title).trim().slice(0, 140) || slug,
    seoTitle: str(o.seoTitle).trim().slice(0, 160) || undefined,
    seoDescription: str(o.seoDescription).trim().slice(0, 320) || undefined,
    status,
    blocks,
    updatedAt: new Date().toISOString(),
  };
}

/** FAQ items from every faq block, for JSON-LD. */
export function faqsFromBlocks(blocks: Block[]): { q: string; a: string }[] {
  return blocks
    .filter((b) => b.type === "faq")
    .flatMap((b) => asItems(b.props.items).map((i) => ({ q: str(i.q), a: str(i.a) })))
    .filter((f) => f.q && f.a);
}
