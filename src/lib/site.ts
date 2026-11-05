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
  googlePlaceId: process.env.GOOGLE_PLACE_ID || "",
  googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "",
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
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const BLOG_CATEGORIES = ["Trending", "SEO", "Social Media", "Paid Ads", "Content", "Branding", "Entertainment Marketing", "Web"] as const;

/* ---------------------------------------------------------------- industries */
export type Industry = {
  slug: string;
  name: string;
  short: string;
  headline: string;
  description: string;
  painPoints: string[];
  channels: string[];
  faqs: { q: string; a: string }[];
  keywords: string[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "retail-ecommerce",
    name: "Retail & E-Commerce",
    short: "D2C brands, marketplace sellers and offline stores that want online orders.",
    headline: "Digital marketing for retail and e-commerce brands in Delhi NCR",
    description:
      "From Lajpat Nagar boutiques going online to D2C brands shipping across India, we build full-funnel systems: product feeds, Shopping and Meta catalogue ads, abandoned-cart recovery and SEO for category pages, all tracked to revenue.",
    painPoints: ["Ad spend rising but ROAS flat or falling", "Marketplace commissions eating margins, no owned channel", "Traffic arrives but carts get abandoned"],
    channels: ["Meta catalogue & Advantage+ ads", "Google Shopping & Performance Max", "WhatsApp cart recovery", "Category-page SEO"],
    faqs: [
      { q: "Do you work with Shopify and WooCommerce stores?", a: "Yes. We set up pixels, feeds, server-side tracking and checkout CRO on Shopify, WooCommerce and custom Next.js stores." },
      { q: "What ROAS should an e-commerce brand expect?", a: "It depends on margin, AOV and creative. We benchmark your category in the audit and set a target before scaling spend." },
    ],
    keywords: ["ecommerce marketing agency delhi", "d2c marketing agency", "shopify marketing delhi ncr"],
  },
  {
    slug: "restaurants-food",
    name: "Restaurants & Food",
    short: "Restaurants, cloud kitchens, cafes and food brands that need footfall and direct orders.",
    headline: "Restaurant and food marketing that fills tables and reduces aggregator dependence",
    description:
      "Delhi NCR eats out more than any other city. We make sure your restaurant, cafe or cloud kitchen is the one people find on Google Maps, see on Instagram at 8 pm and order from directly on WhatsApp.",
    painPoints: ["Large commissions to delivery apps on every order", "Empty tables on weekdays", "Instagram page with great food photos but no bookings"],
    channels: ["Google Business Profile & local SEO", "Instagram reels & influencer tastings", "WhatsApp direct-order funnels", "Geo-targeted Meta ads"],
    faqs: [
      { q: "Can you help us get orders outside delivery apps?", a: "Yes. We build a direct-order channel on WhatsApp or your website and drive repeat customers to it with offers and retargeting." },
      { q: "Do you shoot food content?", a: "Our creative team does on-location reel shoots across Delhi NCR, including menu launches and festive specials." },
    ],
    keywords: ["restaurant marketing agency delhi", "cloud kitchen marketing", "cafe instagram marketing delhi"],
  },
  {
    slug: "healthcare-clinics",
    name: "Healthcare & Clinics",
    short: "Dental, dermatology, IVF, physiotherapy and multi-speciality clinics looking for patient enquiries.",
    headline: "Patient-acquisition marketing for clinics and hospitals in Delhi NCR",
    description:
      "Patients search before they book. We get your clinic ranking on Google Maps for treatment keywords, run compliant Google and Meta campaigns and set up WhatsApp appointment flows, so the front desk gets real enquiries, not just impressions.",
    painPoints: ["Competitors outrank you on Google Maps for your own treatments", "High cost per lead from generic ads", "Reviews are few, old or unanswered"],
    channels: ["Local SEO & Google Business Profile", "Treatment landing pages + Google Search ads", "Review generation workflows", "WhatsApp appointment automation"],
    faqs: [
      { q: "Is healthcare advertising allowed on Google and Meta?", a: "Yes, with restrictions. We write compliant copy, avoid prohibited claims and follow platform healthcare policies so campaigns stay live." },
      { q: "How do you handle patient privacy?", a: "Lead data stays in your CRM or WhatsApp; we never publish patient information and follow consent-based messaging." },
    ],
    keywords: ["healthcare marketing agency delhi", "dental clinic marketing", "doctor seo delhi ncr"],
  },
  {
    slug: "education-coaching",
    name: "Education & Coaching",
    short: "Coaching institutes, schools, ed-tech and skill academies that need admissions.",
    headline: "Admission-focused marketing for coaching institutes and ed-tech in Delhi NCR",
    description:
      "Exam seasons, batch launches and counselling calls all have a calendar. We plan campaigns around it: Search ads on course keywords, YouTube and reels featuring faculty, WhatsApp nurture for enquiries and landing pages that convert parents and students.",
    painPoints: ["Enquiries spike only in admission season", "Low show-up rate from online enquiries", "Hard to stand out among hundreds of institutes"],
    channels: ["Google Search & YouTube ads", "Faculty-led reels & moment marketing", "WhatsApp enquiry nurture", "SEO for course pages"],
    faqs: [
      { q: "Can you run campaigns only during admission season?", a: "Yes. Many institutes run paid campaigns seasonally and keep SEO and social running year round. We plan the mix with you." },
      { q: "Do you help with counsellor follow-up?", a: "We set up WhatsApp automation and lead routing so every enquiry gets a reply within minutes and counsellors see a clean pipeline." },
    ],
    keywords: ["coaching institute marketing delhi", "education marketing agency", "edtech lead generation"],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    short: "Developers, channel partners and brokers who want qualified site visits.",
    headline: "Real estate lead generation that delivers site visits, not junk enquiries",
    description:
      "Gurugram, Noida and Dwarka Expressway launches live and die on lead quality. We build project landing pages, run Google and Meta campaigns with budget and location qualifiers, and route leads to WhatsApp and your CRM with instant follow-up.",
    painPoints: ["Hundreds of leads, very few site visits", "Portal leads shared with ten other brokers", "No visibility on which campaign brought the booking"],
    channels: ["Project landing pages + Google Search ads", "Meta lead forms with qualifying questions", "WhatsApp & CRM lead routing", "YouTube walkthrough videos"],
    faqs: [
      { q: "What is a realistic cost per site visit?", a: "It varies by ticket size and micro-market. We share benchmarks for your segment after the audit and optimise toward site visits, not raw leads." },
      { q: "Do you work with individual brokers?", a: "Yes, as long as you have RERA registration and a project inventory. We also work with developer sales teams directly." },
    ],
    keywords: ["real estate marketing agency gurugram", "real estate lead generation noida", "property ads delhi ncr"],
  },
  {
    slug: "fashion-beauty",
    name: "Fashion & Beauty",
    short: "Apparel labels, salons, skincare and cosmetics brands that live on Instagram.",
    headline: "Fashion and beauty marketing built for Instagram-first audiences",
    description:
      "Fashion and beauty are won on creative. We run reel-led content calendars, creator collaborations, Meta catalogue ads and salon booking funnels, with the trend desk turning what India is watching into on-brand posts within 24 hours.",
    painPoints: ["Beautiful feed, no sales", "Influencer spends with no tracking", "Seasonal drops get no reach without paid push"],
    channels: ["Reels & UGC content production", "Influencer & creator campaigns", "Meta catalogue & retargeting ads", "Salon booking via WhatsApp"],
    faqs: [
      { q: "Do you manage influencer collaborations end to end?", a: "Yes: discovery, negotiation, briefs, content approval and UTM or promo-code tracking so you know what each creator delivered." },
      { q: "Can you help a salon get bookings?", a: "We combine Google Maps optimisation, Instagram reels and a WhatsApp booking flow so clients book without calling." },
    ],
    keywords: ["fashion marketing agency delhi", "beauty brand marketing", "salon marketing delhi ncr"],
  },
];

/* ---------------------------------------------------------------- work */
export type WorkType = "website" | "creative" | "reel";

export type WorkItem = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  type: WorkType;
  cover: string;
  result: string;
  summary: string;
  challenge: string;
  approach: string;
  services: string[];
};

export const WORK: WorkItem[] = [
  {
    slug: "glowroot-skincare-store",
    title: "D2C skincare store relaunch",
    client: "GlowRoot (D2C skincare)",
    industry: "Retail & E-Commerce",
    type: "website",
    cover: "/work/glowroot.svg",
    result: "Store conversion rate up from 0.9% to 2.4%",
    summary: "A Shopify rebuild with faster pages, ingredient-led product storytelling and a WhatsApp cart-recovery flow.",
    challenge: "Traffic from Meta ads was landing on slow product pages with no trust signals. Carts were abandoned at the shipping step and there was no recovery channel.",
    approach: "We rebuilt the theme for speed, added ingredient explainers and review widgets, simplified checkout to a single step and connected WhatsApp cart recovery with a 10-minute and 24-hour nudge.",
    services: ["web-design-development", "whatsapp-email-marketing", "meta-ads"],
  },
  {
    slug: "smilecraft-dental-campaign",
    title: "Dental clinic local campaign creatives",
    client: "SmileCraft Dental (South Delhi)",
    industry: "Healthcare & Clinics",
    type: "creative",
    cover: "/work/smilecraft.svg",
    result: "74 calls a month from Google Maps and Search",
    summary: "Google Business Profile overhaul, treatment landing pages and a creative set for Search and Display campaigns.",
    challenge: "The clinic was invisible for implant and aligner searches, had 11 reviews and a website that did not mention treatments by name.",
    approach: "We rewrote the Business Profile, launched a review workflow at the reception desk, built treatment pages and designed ad creatives around outcomes and pricing transparency.",
    services: ["seo", "google-ads-ppc", "branding-creative"],
  },
  {
    slug: "urbannest-real-estate-reels",
    title: "Project walkthrough reels",
    client: "UrbanNest Realty (Noida)",
    industry: "Real Estate",
    type: "reel",
    cover: "/work/urbannest.svg",
    result: "Cost per site visit down 52%",
    summary: "A series of 20 walkthrough and locality reels used organically and as Meta video ads for a new launch.",
    challenge: "Static brochure ads were generating low-intent leads. Prospects could not picture the project or the neighbourhood.",
    approach: "We scripted and shot walkthroughs, commute explainers and resident interviews, then ran them as Meta video ads with budget and location qualifiers routed to WhatsApp.",
    services: ["meta-ads", "social-media-marketing", "branding-creative"],
  },
  {
    slug: "tandoor-tales-ordering",
    title: "Direct-order website for a cloud kitchen",
    client: "Tandoor Tales (Gurugram)",
    industry: "Restaurants & Food",
    type: "website",
    cover: "/work/tandoor-tales.svg",
    result: "31% of orders now come direct instead of via aggregators",
    summary: "A mobile-first ordering site with WhatsApp checkout, promoted through Google Maps and geo-targeted Instagram ads.",
    challenge: "Almost every order came through delivery apps, with commissions wiping out margins on combos.",
    approach: "We built a lightweight menu site with WhatsApp ordering, added it to the Business Profile and ran Instagram offers within a 5 km radius with a direct-order coupon.",
    services: ["web-design-development", "seo", "meta-ads"],
  },
  {
    slug: "pathshala-admissions-creatives",
    title: "Admission season creative system",
    client: "Pathshala Coaching (Delhi)",
    industry: "Education & Coaching",
    type: "creative",
    cover: "/work/pathshala.svg",
    result: "Batches filled 3 weeks before the session started",
    summary: "A modular creative kit for Search, Display and Instagram with faculty-led hooks and exam countdown formats.",
    challenge: "Each season the institute rebuilt creatives from scratch and launched late, losing the early-enquiry window to competitors.",
    approach: "We designed a reusable template system, pre-produced faculty videos and scheduled campaigns against the exam calendar with WhatsApp follow-up for every enquiry.",
    services: ["branding-creative", "google-ads-ppc", "whatsapp-email-marketing"],
  },
  {
    slug: "maison-ira-fashion-reels",
    title: "Festive collection reels",
    client: "Maison Ira (Fashion label)",
    industry: "Fashion & Beauty",
    type: "reel",
    cover: "/work/maison-ira.svg",
    result: "Festive drop sold out in 11 days",
    summary: "Trend-led reels and creator collaborations for a Diwali collection, amplified with Meta catalogue ads.",
    challenge: "The label had a loyal but small following and no budget for a big influencer campaign.",
    approach: "We produced 15 reels using trending audio within 24 hours of each trend, partnered with six micro creators on a performance basis and retargeted engaged viewers with catalogue ads.",
    services: ["social-media-marketing", "influencer-marketing", "meta-ads"],
  },
];
