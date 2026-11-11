import { getContent, parseStat, splitPair } from "./pageContent";
import { HOME_FAQS, SERVICE_CATEGORIES, SITE } from "./site";
import { newBlock, type Block, type BlockType, type PageLayout } from "./builder";

/**
 * "Start from current page": seed layouts that approximate the hard-coded pages, using the same copy
 * (admin overrides from the Pages panel included) so the owner edits a filled canvas.
 */
function block(type: BlockType, props: Record<string, unknown>): Block {
  const b = newBlock(type);
  return { ...b, props: { ...b.props, ...props } };
}

const layout = (slug: string, title: string, seoTitle: string, seoDescription: string, blocks: Block[]): PageLayout => ({
  slug,
  title,
  seoTitle,
  seoDescription,
  status: "draft",
  blocks,
  updatedAt: new Date().toISOString(),
});

async function home(): Promise<PageLayout> {
  const c = await getContent("home");
  const stats = c.list("stats").slice(0, 4).map((item) => {
    const [value, label] = splitPair(item);
    const s = parseStat(value);
    return { value: s.value, suffix: s.suffix, label: label || value };
  });
  return layout("home", "Home", `${SITE.name} | Digital Marketing Agency in Delhi NCR That Delivers ROI`, SITE.description, [
    block("hero", {
      eyebrow: c.get("heroEyebrow"),
      headline: c.get("heroHeadline"),
      headlineAccent: c.get("heroHeadlineAccent"),
      sub: c.get("heroSub"),
      primaryLabel: c.get("heroPrimaryCta"),
      primaryHref: "/contact",
      secondaryLabel: c.get("heroSecondaryCta"),
      secondaryHref: "/case-studies",
      background: "mesh",
    }),
    block("stats", { items: stats }),
    block("services", { eyebrow: "What we do", heading: "Every channel. One goal: growth.", sub: "Pick one service or let us run the full funnel. Every plan includes tracking, a live dashboard and a dedicated growth manager.", pick: [], limit: 9 }),
    block("features", {
      eyebrow: "Why ClickSemrus",
      heading: "The ClickSemrus difference",
      sub: "We built the agency we wished we could hire: fast, transparent and judged on revenue.",
      columns: "3",
      style: "numbered",
      background: "tint",
      items: [
        { icon: "IndianRupee", title: "Reports in rupees, not impressions", text: "Every report starts with leads, cost per lead and revenue. Impressions and reach are footnotes." },
        { icon: "Zap", title: "7-day launch, no month-long onboarding", text: "Tracking, creatives and first campaigns go live within a week of signing. You see data in the dashboard from day one." },
        { icon: "Lock", title: "No long lock-ins", text: "Month to month after an initial 3-month SEO commitment. We keep clients by performing, not by contract." },
      ],
    }),
    block("work", { heading: "Work we're proud of", sub: "Live projects you can open right now. Hover a card to scroll the site, or tap for a full preview.", pick: [], limit: 6 }),
    block("features", {
      eyebrow: "How we work",
      heading: "From audit to scale in four steps.",
      sub: "Most agencies send a PDF of impressions. We give you a live dashboard of leads, cost per lead and revenue, plus a weekly call about what we changed and why.",
      columns: "4",
      style: "cards",
      background: "dark",
      items: [
        { icon: "Target", title: "Audit & Strategy", text: "We study your market, competitors and funnel, then build a 90-day growth plan with clear KPIs." },
        { icon: "Zap", title: "Launch in 7 days", text: "Campaigns, content and tracking go live within a week. No month-long onboarding." },
        { icon: "BarChart3", title: "Optimise weekly", text: "Every week we cut what does not work and scale what does, with a live dashboard you can open anytime." },
        { icon: "TrendingUp", title: "Scale profitably", text: "Once cost per lead is proven, we scale budgets and channels to grow revenue, not just traffic." },
      ],
    }),
    block("leadForm", {
      eyebrow: "Free growth audit",
      heading: "Find out exactly where you are losing customers.",
      sub: "Within 48 hours you get a written audit of your website, SEO, social and ads, with a prioritised 90-day plan. Worth Rs 10,000. Free for Delhi NCR businesses this month.",
      source: "/#audit",
      points: [{ text: "Website conversion and speed review" }, { text: "Keyword gaps vs your top 3 competitors" }, { text: "Ad account waste analysis" }, { text: "Social content scorecard" }],
      background: "tint",
    }),
    block("faq", { eyebrow: "FAQs", heading: "Questions we hear every week", items: HOME_FAQS.map((f) => ({ q: f.q, a: f.a })) }),
    block("cta", {}),
  ]);
}

async function about(): Promise<PageLayout> {
  const c = await getContent("about");
  const g = await getContent("global");
  return layout("about", "About", `About ${SITE.name} | Digital Marketing Agency in Delhi NCR`, `${SITE.name} is a Delhi NCR digital marketing agency built by performance marketers. Learn our story, values and how we work with brands across India.`, [
    block("hero", { eyebrow: "About us", headline: c.get("heroHeadline"), headlineAccent: c.get("heroHeadlineAccent"), sub: c.get("intro"), primaryLabel: "Book a free call", primaryHref: "/contact", secondaryLabel: "Follow our work", secondaryHref: SITE.instagram }),
    block("twoColumn", { eyebrow: "Our story", heading: c.get("storyHeadline"), left: "", rightType: "markdown", right: c.get("story"), reverse: false, ctaLabel: "" }),
    block("features", {
      eyebrow: "Values",
      heading: "Four rules we do not break",
      sub: "",
      columns: "4",
      style: "cards",
      background: "tint",
      items: [
        { icon: "IndianRupee", title: "Revenue first", text: "Every report starts with leads, cost per lead and sales. Impressions, reach and follower counts are footnotes, never the headline." },
        { icon: "Zap", title: "Speed", text: "Campaigns live in 7 days. Trend creatives in 24 hours. Replies within 2 business hours. Slow agencies cost clients money." },
        { icon: "Eye", title: "Radical transparency", text: "You own the ad accounts, pixels and dashboards. You see the invoices from Google and Meta. There is no black box." },
        { icon: "Palette", title: "Craft", text: "Design, copy and code we would be proud of even without the numbers. The numbers tend to follow." },
      ],
    }),
    block("steps", {
      eyebrow: "How we work with you",
      heading: "What working with us actually feels like",
      sub: "The same rhythm on every account, from a single-channel Starter plan to a full-funnel retainer.",
      items: [
        { when: "Day 0", title: "Free strategy call", text: "Thirty minutes, no pitch deck. We look at your site, Google presence and ad accounts and tell you honestly where the fastest payback is." },
        { when: "Day 1 to 7", title: "Audit and launch", text: "Tracking first, then the work. Campaigns, content or fixes are live within the week and you can see data in the dashboard." },
        { when: "Every week", title: "Short written update", text: "What we changed, why, and what it did to cost per lead. Five minutes to read, no 40-slide deck." },
        { when: "Every month", title: "Strategy call", text: "Results against the plan, what we are testing next and where the budget should move. You decide, with data." },
      ],
    }),
    block("features", {
      eyebrow: "Team principles",
      heading: "Small team, senior hands",
      sub: "Strategists who have run budgets in-house, creators who ship daily, and certified Google and Meta specialists, technical SEOs and developers.",
      columns: "4",
      style: "cards",
      background: "dark",
      items: [
        { icon: "MessageCircle", title: "One named growth manager", text: "You message one person who knows your account, not a ticket queue." },
        { icon: "FileText", title: "Plain-language proposals", text: "Scope, price and timeline on one page. If we cannot explain it simply, we do not sell it." },
        { icon: "Users", title: "Senior people on the work", text: "We take a limited number of new clients each month so the people on the call are the people doing the work." },
        { icon: "Lock", title: "Your data stays yours", text: "Accounts, domains and dashboards are created in your name. Leave any time with everything intact." },
      ],
    }),
    block("work", { heading: "Brands we have grown", sub: "Live projects across healthcare, retail and education. Open any of them to see the work.", pick: [], limit: 3 }),
    block("cta", { headline: g.get("ctaHeadline"), sub: g.get("ctaSub") }),
  ]);
}

async function pricing(): Promise<PageLayout> {
  const c = await getContent("pricing");
  const plan = (i: number, tag: string, features: string[]) => ({
    icon: i === 2 ? "Star" : i === 1 ? "Zap" : "Rocket",
    title: `${c.get(`plan${i}Name`)} · from ₹${c.get(`plan${i}Price`)}/month`,
    text: `${tag}. ${c.get(`plan${i}Desc`)} Includes: ${features.join(", ")}.`,
  });
  return layout("pricing", "Pricing", "Digital Marketing Packages & Pricing in Delhi NCR", `Transparent digital marketing pricing from ${SITE.name}: SEO, social media, Google Ads and Meta Ads packages for startups, growing businesses and enterprises in Delhi NCR.`, [
    block("hero", { eyebrow: "Pricing", headline: c.get("headline"), headlineAccent: c.get("headlineAccent"), sub: c.get("intro"), primaryLabel: "Get a written quote", primaryHref: "/contact", secondaryLabel: "", secondaryHref: "", align: "center" }),
    block("features", {
      eyebrow: "Plans",
      heading: "Three starting points",
      sub: c.get("footnote"),
      columns: "3",
      style: "cards",
      background: "none",
      items: [
        plan(1, "Single channel", ["1 channel (SEO, Social or Ads)", "GA4 & conversion tracking", "monthly report & call", "WhatsApp support"]),
        plan(2, "Most popular", ["2 channels", "20 posts + 4 reels per month", "up to 3 ad campaigns with creatives", "landing page CRO", "live dashboard", "dedicated growth manager"]),
        plan(3, "Full funnel", ["all channels", "daily content + trend creatives in 24h", "unlimited ad campaigns", "influencer & WhatsApp automation", "weekly strategy call"]),
      ],
    }),
    block("features", {
      eyebrow: "Add-ons",
      heading: "Bolt on only what you need",
      sub: "Indicative starting prices. Final quotes depend on scope and are confirmed in writing before any work starts.",
      columns: "3",
      style: "numbered",
      background: "tint",
      items: [
        { title: "Landing page · from Rs 15,000", text: "One message, one action, live in 5 to 7 working days." },
        { title: "Reel shoot day · from Rs 12,000", text: "On-location in Delhi NCR, 8 to 12 reels edited with captions." },
        { title: "Extra ad campaign · from Rs 5,000 / month", text: "Any platform, with creatives and weekly optimisation." },
        { title: "Google Business Profile, extra location · from Rs 4,000 / month", text: "Setup, posts, reviews and Maps reporting per branch." },
        { title: "WhatsApp Business API setup · from Rs 10,000", text: "Verification, templates, first automation flow and CRM link." },
        { title: "Website or Shopify build · quoted per project", text: "Business sites from 3 weeks, e-commerce from 6 weeks." },
      ],
    }),
    block("faq", {
      eyebrow: "Pricing FAQs",
      heading: "Questions about pricing",
      items: [
        { q: "Are ad budgets included in the price?", a: "No. The prices are agency fees. Ad spend is paid directly to Google or Meta from your own account, so you always own your data." },
        { q: "Is GST extra?", a: "Yes, 18% GST applies on all packages." },
        { q: "Can I customise a package?", a: "Absolutely. Most clients end up with a custom mix. Tell us your goal and budget on the contact page." },
        { q: "What is the minimum commitment?", a: "3 months for SEO-inclusive plans because that is the time it takes to prove results. Ads-only and social plans are month to month." },
        { q: "How and when do I pay?", a: "Monthly in advance by bank transfer or UPI against a GST invoice. Project work such as websites is 50% to start and 50% on launch." },
      ],
    }),
    block("work", { heading: "What these plans built", sub: "Live sites, stores and campaigns delivered under Starter, Growth and project engagements.", pick: [], limit: 3 }),
    block("cta", { headline: "Need a custom quote?", sub: "Share your goals and budget. You will get a proposal within 24 hours." }),
  ]);
}

async function contact(): Promise<PageLayout> {
  const c = await getContent("contact");
  const hours = c.list("officeHours").map(splitPair).map(([l, v]) => `- **${l}:** ${v}`).join("\n");
  return layout("contact", "Contact", `Contact ${SITE.name} | Free Digital Marketing Audit in Delhi NCR`, `Get a free digital marketing audit and growth plan. Call, WhatsApp or email ${SITE.name}, Delhi NCR. We reply within 2 business hours.`, [
    block("hero", { eyebrow: "Contact", headline: c.get("headline"), headlineAccent: c.get("headlineAccent"), sub: c.get("intro"), primaryLabel: "WhatsApp us", primaryHref: "whatsapp", secondaryLabel: `Call ${SITE.phone}`, secondaryHref: `tel:${SITE.phone.replace(/\s/g, "")}` }),
    block("leadForm", {
      eyebrow: "Request a free audit",
      heading: "Tell us about your business",
      sub: "We reply within 2 business hours. Worth Rs 10,000, free for Delhi NCR businesses this month.",
      source: "/contact",
      points: [{ text: `Email: ${SITE.email}` }, { text: `Phone: ${SITE.phone}` }, { text: `Based in ${SITE.address}, serving clients across India and abroad` }],
      background: "none",
    }),
    block("richText", { eyebrow: "Office hours", heading: "When we are around", body: hours, width: "narrow", background: "tint" }),
    block("steps", {
      eyebrow: "What happens next",
      heading: "Three steps, no pitch deck",
      items: [
        { when: "Within 2 business hours", title: "A strategist calls you", text: "Not a sales rep. Someone who has already looked at your website and Google presence and has first observations ready." },
        { when: "Within 48 hours", title: "Written audit and plan", text: "Website, SEO, social and ads reviewed against your competitors, with a prioritised 90-day plan and a one-page quote." },
        { when: "No pressure", title: "You decide", text: "Keep the plan and run it yourself, or start with us. Month to month after the first 90 days, and you own every account." },
      ],
    }),
  ]);
}

async function services(): Promise<PageLayout> {
  const c = await getContent("services");
  const total = SERVICE_CATEGORIES.reduce((n, cat) => n + cat.subs.length, 0);
  return layout("services", "Services hub", "Digital Marketing Services in Delhi NCR | SEO, Ads, Social, Web, E-commerce", `Explore ${SITE.name} services: SEO and search, paid ads, social media and content, web development, e-commerce, creative and branding, automation and CRM for businesses in Delhi NCR.`, [
    block("hero", { eyebrow: "Services", headline: c.get("headline"), headlineAccent: c.get("headlineAccent"), sub: c.get("intro").replace("{total}", String(total)), primaryLabel: "Get a free audit", primaryHref: "/contact", secondaryLabel: "See pricing", secondaryHref: "/pricing" }),
    block("services", { eyebrow: "", heading: "", sub: "", pick: [], limit: 9 }),
    block("features", {
      eyebrow: "Which channel first?",
      heading: "Match the channel to the goal, not the trend",
      sub: "Most Delhi NCR businesses should not start everywhere at once. Here is how we decide on the first call.",
      columns: "3",
      style: "numbered",
      background: "tint",
      items: [
        { title: "Need leads this month: start with Paid Ads", text: "Google Search catches people already looking for you; Meta finds the ones who do not know you yet. Live within 7 days, budget from Rs 30,000 per month in spend." },
        { title: "Want compounding traffic: start with SEO", text: "Search traffic you do not pay for per click. Local SEO moves in 4 to 8 weeks for Delhi NCR businesses; competitive categories take a quarter." },
        { title: "Building a brand: start with Social & Creative", text: "Reels, creator collaborations and a trend desk that reacts within 24 hours. Best for food, fashion, beauty, wellness and founder-led B2B." },
      ],
    }),
    block("work", { heading: "Work across every service family", sub: "Clinics, D2C stores, an education app and a skincare brand. Open any project to see the live site.", pick: [], limit: 3 }),
    block("cta", { headline: "Not sure which service you need?", sub: "Tell us your goal and budget. We will recommend the channel mix with the fastest payback, free." }),
  ]);
}

const SEEDS: Record<string, () => Promise<PageLayout>> = { home, about, pricing, contact, services };

/** Seed layout for one of the take-over pages, or null for unknown slugs. */
export async function seedFor(slug: string): Promise<PageLayout | null> {
  const fn = SEEDS[slug];
  return fn ? fn() : null;
}

/** Empty layout for a brand-new custom page: hero + text + CTA so the canvas is not blank. */
export function blankLayout(slug: string, title: string): PageLayout {
  return layout(slug, title, "", "", [
    block("hero", { eyebrow: SITE.tagline, headline: title, headlineAccent: "", sub: "Add a short introduction here.", primaryLabel: "Get a free audit", primaryHref: "/contact", secondaryLabel: "", secondaryHref: "" }),
    block("richText", { body: "Start writing. Add blocks from the palette on the left." }),
    block("cta", {}),
  ]);
}
