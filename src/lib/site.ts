export const SITE = {
  name: "ClickSemrus",
  legalName: "ClickSemrus Digital Marketing Agency",
  tagline: "Digital Marketing Agency in Delhi NCR",
  description:
    "ClickSemrus is a results-driven digital marketing agency in Delhi NCR offering SEO, social media marketing, Google & Meta ads, content, web design and branding that turns clicks into customers.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://clicksemrus.vercel.app",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@clicksemrus.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91 00000 00000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "910000000000",
  city: "Delhi NCR",
  address: "Delhi NCR, India",
  instagram: "https://www.instagram.com/clicksemrus/",
  locale: "en_IN",
  twitterHandle: "@clicksemrus",
  foundingYear: 2024,
};

export type Service = {
  slug: string;
  name: string;
  short: string;
  icon: string;
  headline: string;
  description: string;
  benefits: string[];
  deliverables: string[];
  faqs: { q: string; a: string }[];
  keywords: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "seo",
    name: "SEO Services",
    short: "Rank on page one of Google and own your category with technical, on-page and local SEO.",
    icon: "Search",
    headline: "SEO that compounds: more organic traffic every month",
    description:
      "Our SEO team in Delhi NCR builds search visibility that keeps paying you back. We fix technical issues, map keywords to buyer intent, create content that earns links, and track every ranking that matters.",
    benefits: ["Higher Google rankings for money keywords", "Lower customer acquisition cost than ads", "Compounding traffic growth", "Local SEO for Google Maps & Business Profile"],
    deliverables: ["Technical SEO audit & fixes", "Keyword research & content strategy", "On-page optimisation", "Link building & digital PR", "Local SEO & GBP optimisation", "Monthly ranking & traffic reports"],
    faqs: [
      { q: "How long does SEO take to show results?", a: "Most businesses see measurable movement in 8 to 12 weeks and strong growth in 4 to 6 months. SEO compounds, so the gains keep growing after that." },
      { q: "Do you guarantee #1 rankings?", a: "No honest agency can. We guarantee a transparent process, monthly reporting and a strategy built around keywords that actually bring customers." },
      { q: "Is local SEO included?", a: "Yes. For Delhi NCR businesses we optimise your Google Business Profile, citations and location pages." },
    ],
    keywords: ["seo services delhi", "seo agency delhi ncr", "local seo", "technical seo"],
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    short: "Instagram, Facebook, LinkedIn & YouTube content that builds a brand people follow.",
    icon: "Share2",
    headline: "Social media that grows followers and sales",
    description:
      "From scroll-stopping reels to thought-leadership on LinkedIn, we plan, create and publish content that builds community and drives action across Instagram, Facebook, LinkedIn and YouTube.",
    benefits: ["Consistent, on-brand content calendar", "Reels & short-form video production", "Community management & engagement", "Monthly growth analytics"],
    deliverables: ["Social media strategy & audit", "Content calendar (posts, reels, stories)", "Graphic design & video editing", "Community management", "Influencer collaboration", "Monthly performance report"],
    faqs: [
      { q: "Which platforms do you manage?", a: "Instagram, Facebook, LinkedIn, YouTube, X (Twitter) and Pinterest. We recommend platforms based on where your customers are." },
      { q: "Do you create the content?", a: "Yes. Our in-house designers, copywriters and video editors produce everything, including on-location reels shoots in Delhi NCR." },
    ],
    keywords: ["social media marketing agency delhi", "instagram marketing", "reels marketing"],
  },
  {
    slug: "google-ads-ppc",
    name: "Google Ads (PPC)",
    short: "Search, Shopping, YouTube & Performance Max campaigns engineered for ROAS.",
    icon: "MousePointerClick",
    headline: "Google Ads that bring leads, not just clicks",
    description:
      "We build conversion-first Google Ads accounts: tight keyword structure, negative lists, high-intent ad copy, landing page CRO and bidding that targets profit, not vanity metrics.",
    benefits: ["Leads from day one", "Lower CPC with higher quality scores", "Full-funnel: Search, Display, YouTube, PMax", "Transparent spend & weekly optimisation"],
    deliverables: ["Account audit & restructure", "Keyword & competitor research", "Ad copy & extensions", "Conversion tracking (GA4, GTM)", "Landing page optimisation", "Weekly bid & budget optimisation"],
    faqs: [
      { q: "What is the minimum ad budget?", a: "We recommend at least Rs 30,000 per month in ad spend for meaningful data, plus our management fee." },
      { q: "Do you set up conversion tracking?", a: "Always. Every campaign we run tracks calls, forms and WhatsApp clicks in GA4 and Google Ads." },
    ],
    keywords: ["google ads agency delhi", "ppc management", "performance max"],
  },
  {
    slug: "meta-ads",
    name: "Meta Ads (Facebook & Instagram)",
    short: "Full-funnel Facebook and Instagram ads with creative that converts.",
    icon: "Megaphone",
    headline: "Meta Ads with creative that stops the scroll",
    description:
      "Winning on Meta is 80% creative. We test hooks, formats and audiences every week, build retargeting funnels and scale what works, with pixel and CAPI tracking done right.",
    benefits: ["Creative testing framework", "Advantage+ and manual audience strategies", "Retargeting & lookalike funnels", "Pixel + Conversions API setup"],
    deliverables: ["Funnel & audience strategy", "Ad creatives: statics, carousels, UGC-style videos", "Campaign setup & A/B testing", "Pixel, CAPI & event tracking", "Weekly optimisation", "Monthly ROAS report"],
    faqs: [
      { q: "Do you make the ad creatives?", a: "Yes. Static, carousel and video creatives are included, and we refresh them before fatigue sets in." },
    ],
    keywords: ["facebook ads agency delhi", "instagram ads", "meta ads management"],
  },
  {
    slug: "content-marketing",
    name: "Content Marketing",
    short: "Blogs, landing pages and lead magnets that rank, educate and convert.",
    icon: "PenTool",
    headline: "Content that ranks today and converts tomorrow",
    description:
      "We write content with intent. Every blog, guide and landing page is mapped to a keyword, a stage of the funnel and a call to action, then interlinked to push authority where it matters.",
    benefits: ["Topic clusters built around buyer intent", "SEO-optimised long-form content", "Lead magnets & email nurture", "Consistent publishing cadence"],
    deliverables: ["Content strategy & topic clusters", "SEO blogs & pillar pages", "Landing page copywriting", "Ebooks, case studies & whitepapers", "Email newsletters", "Content performance reporting"],
    faqs: [
      { q: "How many articles per month?", a: "Plans start at 4 SEO articles a month and scale to daily publishing with trend-based content." },
    ],
    keywords: ["content marketing agency delhi", "seo content writing", "blog writing services"],
  },
  {
    slug: "web-design-development",
    name: "Web Design & Development",
    short: "Fast, beautiful, conversion-optimised websites on Next.js, WordPress & Shopify.",
    icon: "Code2",
    headline: "Websites built to load fast and convert faster",
    description:
      "Your website is your best salesperson. We design and build high-performance sites with clear messaging, strong CTAs, Core Web Vitals in the green and SEO baked in from day one.",
    benefits: ["90+ PageSpeed scores", "Conversion-focused UX", "SEO-ready architecture", "Easy-to-manage CMS"],
    deliverables: ["UX research & wireframes", "UI design (Figma)", "Next.js / WordPress / Shopify development", "Speed & Core Web Vitals optimisation", "Analytics & tracking setup", "Maintenance & support"],
    faqs: [
      { q: "How long does a website take?", a: "A landing page in 7 days, a business website in 3 to 4 weeks, and e-commerce in 6 to 8 weeks." },
    ],
    keywords: ["website design company delhi", "web development agency", "landing page design"],
  },
  {
    slug: "influencer-marketing",
    name: "Influencer Marketing",
    short: "Creator campaigns with real reach, from nano creators to celebrity tie-ups.",
    icon: "Users",
    headline: "Influencer campaigns measured on sales, not likes",
    description:
      "We match brands with vetted creators across Instagram and YouTube, manage briefs, contracts and content approvals, and track every campaign with UTM links and promo codes.",
    benefits: ["Vetted creator network across India", "Performance-based deals", "Content rights for ads", "Transparent tracking"],
    deliverables: ["Creator discovery & vetting", "Campaign brief & negotiation", "Content approval workflow", "UTM & promo-code tracking", "Whitelisting for paid amplification", "Campaign report"],
    faqs: [
      { q: "What budget do I need?", a: "Nano and micro creator campaigns start from Rs 50,000; larger celebrity campaigns are quoted per project." },
    ],
    keywords: ["influencer marketing agency delhi", "creator marketing", "instagram influencers"],
  },
  {
    slug: "whatsapp-email-marketing",
    name: "WhatsApp & Email Marketing",
    short: "Automated nurture journeys on WhatsApp and email that turn leads into repeat buyers.",
    icon: "MessageCircle",
    headline: "Retention marketing that multiplies lifetime value",
    description:
      "Acquisition is expensive. We build WhatsApp Business API and email automations that welcome, nurture, recover abandoned carts and re-engage customers, all measured by revenue.",
    benefits: ["WhatsApp Business API setup", "Automated flows & broadcasts", "Segmentation & personalisation", "Revenue attribution"],
    deliverables: ["WhatsApp API onboarding", "Email platform setup (Klaviyo, Mailchimp, Brevo)", "Automation flows", "Campaign copy & design", "A/B testing", "Monthly revenue report"],
    faqs: [
      { q: "Is WhatsApp marketing legal?", a: "Yes, when done through the official WhatsApp Business API with opt-in consent. We handle compliance." },
    ],
    keywords: ["whatsapp marketing agency", "email marketing services delhi", "marketing automation"],
  },
  {
    slug: "branding-creative",
    name: "Branding & Creative",
    short: "Logo, identity, packaging and ad creatives that make your brand unforgettable.",
    icon: "Sparkles",
    headline: "Brands people remember, creatives people click",
    description:
      "Great marketing starts with a clear brand. We craft identities, messaging and creative systems that work everywhere, from Instagram grids to billboards in Gurugram.",
    benefits: ["Strategic brand positioning", "Complete visual identity", "Creative system for ads & social", "Brand guidelines"],
    deliverables: ["Brand strategy & positioning", "Logo & identity design", "Brand guidelines", "Packaging & print", "Ad creative production", "Motion graphics & reels"],
    faqs: [
      { q: "Do you do rebrands?", a: "Yes. Many clients come to us for a refresh before scaling ads." },
    ],
    keywords: ["branding agency delhi", "logo design delhi ncr", "creative agency"],
  },
];

export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Results" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const BLOG_CATEGORIES = ["Trending", "SEO", "Social Media", "Paid Ads", "Content", "Branding", "Entertainment Marketing", "Web"] as const;
