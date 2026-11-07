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
  /** Live site and full-page screenshots with their pixel sizes. */
  url?: string;
  shotDesktop?: string;
  shotDesktopSize?: [number, number];
  shotMobile?: string;
  shotMobileSize?: [number, number];
  instagram?: string;
  facebook?: string;
  /** Plain-language list of what ClickSemrus delivered. */
  deliverables?: string[];
  appStore?: string;
  playStore?: string;
};

export const WORK: WorkItem[] = [
  {
    slug: "delhidental",
    title: "Dr. Kathuria's Dentistry: website + local SEO",
    client: "Dr. Kathuria's Dentistry, South Delhi",
    industry: "Healthcare & Clinics",
    type: "website",
    cover: "/work/delhidental.jpg",
    url: "https://delhidental.com/",
    shotDesktop: "/work/shots/delhidental-desktop.jpg",
    shotDesktopSize: [1200, 11126],
    shotMobile: "/work/shots/delhidental-mobile.jpg",
    shotMobileSize: [390, 16279],
    facebook: "https://www.facebook.com/DrKathuriasDentistry/",
    result: "Full backend + frontend ownership: faster site, cleaner server, better rankings",
    summary: "A fast WordPress rebuild for a 30-year-old multi-speciality clinic: treatment pages, celebrity trust section, click-to-call and WhatsApp booking.",
    challenge: "The old site was slow, hit by malware and did not rank for implant or smile-makeover searches despite decades of reputation.",
    approach: "We cleaned and hardened the server, rebuilt the site on a lightweight theme with LiteSpeed caching, wrote treatment and location pages, and set up Google Business Profile optimisation with a review flow.",
    services: ["web-design-development", "seo"],
    deliverables: ["Backend & frontend development", "Hosting & server handling", "Speed & SEO optimisation", "Ongoing maintenance"],
  },
  {
    slug: "smiledentalcarecentre",
    title: "Smile Dental Care Centre: GMB + SEO + website",
    client: "Smile Dental Care Centre, East of Kailash & Faridabad",
    industry: "Healthcare & Clinics",
    type: "website",
    cover: "/work/smiledentalcarecentre.jpg",
    url: "https://smiledentalcarecentre.com/",
    shotDesktop: "/work/shots/smiledentalcarecentre-desktop.jpg",
    shotDesktopSize: [1200, 11969],
    shotMobile: "/work/shots/smiledentalcarecentre-mobile.jpg",
    shotMobileSize: [390, 24000],
    instagram: "https://www.instagram.com/smiledentalcarecentre/",
    facebook: "https://www.facebook.com/smiledentalcarecentre1/",
    result: "GMB ranking for East of Kailash and Faridabad, plus organic leads from the site",
    summary: "Two-location clinic growth: Google Business Profile (GMB) ranking, website SEO, a booking-first website and a weekly content calendar that brings organic leads.",
    challenge: "Two locations, 25 years of history and zero online booking. Patients were calling only during clinic hours.",
    approach: "We optimise and rank both Google Business Profiles, run on-page and technical SEO, built the booking-first website with click-to-call and WhatsApp, and publish scheduled blogs for long-tail dental searches.",
    services: ["seo", "web-design-development", "content-marketing"],
    deliverables: ["GMB (Google Business Profile) SEO", "Website SEO", "Website development", "Organic lead generation"],
  },
  {
    slug: "sdcc-international",
    title: "NRI dental tourism landing site",
    client: "Dr. RA Garg's Smile Dental Expert (international patients)",
    industry: "Healthcare & Clinics",
    type: "website",
    cover: "/work/sdcc-international.jpg",
    url: "https://international.smiledentalcarecentre.com/",
    shotDesktop: "/work/shots/sdcc-international-desktop.jpg",
    shotDesktopSize: [1200, 8932],
    shotMobile: "/work/shots/sdcc-international-mobile.jpg",
    shotMobileSize: [390, 15363],
    result: "Treatment-plan funnel for NRI patients: country, city, treatment, WhatsApp",
    summary: "A dedicated international site with USD pricing, a fly-in planner widget and WhatsApp-first conversion for patients in the US, UK, Canada and Australia.",
    challenge: "Overseas patients needed prices, credentials and travel logistics in one place, in their currency, before they would message.",
    approach: "We built a separate subdomain with a treatment-plan form, transparent USD pricing, surgeon credentials and a WhatsApp handoff, then targeted NRI search terms.",
    services: ["web-design-development", "seo", "whatsapp-email-marketing"],
  },
  {
    slug: "purexa",
    title: "PUREXA oral-care D2C store",
    client: "PUREXA Oral Wellness",
    industry: "Retail & E-Commerce",
    type: "website",
    cover: "/work/purexa.jpg",
    url: "https://purexa.in/",
    shotDesktop: "/work/shots/purexa-desktop.jpg",
    shotDesktopSize: [1200, 9468],
    shotMobile: "/work/shots/purexa-mobile.jpg",
    shotMobileSize: [390, 8473],
    instagram: "https://www.instagram.com/purexa.in/",
    facebook: "https://www.facebook.com/Purexaoralwellness/",
    result: "End-to-end D2C store: build, handling and optimisation",
    summary: "E-commerce build for a dentist-backed oral care brand: shop by concern, best-seller combos, gamified discounts and a ProCare dentist network page.",
    challenge: "A new D2C brand needed a store that explained products by concern, converted first-time buyers and supported dentist referrals.",
    approach: "We set up the Shopify theme, product and combo structure, offer popups, WhatsApp chat and Meta Pixel tracking, with creatives for launch campaigns.",
    services: ["web-design-development", "meta-ads", "branding-creative"],
    deliverables: ["Backend & frontend development", "Store handling & maintenance", "Performance optimisation", "Launch creatives"],
  },
  {
    slug: "blameless",
    title: "Blameless skincare brand store",
    client: "Blameless Skincare India",
    industry: "Fashion & Beauty",
    type: "website",
    cover: "/work/blameless.jpg",
    url: "https://blameless.in/",
    shotDesktop: "/work/shots/blameless-desktop.jpg",
    shotDesktopSize: [1200, 6056],
    shotMobile: "/work/shots/blameless-mobile.jpg",
    shotMobileSize: [390, 6228],
    instagram: "https://www.instagram.com/liv.blameless/",
    facebook: "https://www.facebook.com/share/12LcMx1zN78/",
    result: "Performance + influencer + social, with content created in-house",
    summary: "Growth partner for a clean-beauty brand: Meta and Google performance campaigns, influencer collaborations, daily social media and reels/content creation.",
    challenge: "The brand needed a premium look that still pushed offers hard and worked flawlessly on mobile, where most of its Instagram traffic lands.",
    approach: "We run performance marketing on Meta and Google, manage influencer seeding and paid collaborations, publish the social calendar and produce the reels, statics and UGC-style content that feed all of it.",
    services: ["meta-ads", "influencer-marketing", "social-media-marketing", "content-marketing"],
    deliverables: ["Performance marketing", "Influencer marketing", "Social media marketing", "Content creation"],
  },
  {
    slug: "taiyari-neet-ki",
    title: "Taiyari NEET Ki: iOS + Android app and landing page",
    client: "Taiyari NEET Ki (NEET preparation)",
    industry: "Education & Coaching",
    type: "website",
    cover: "/work/taiyarineetki.jpg",
    url: "https://taiyarineetki.com/",
    shotDesktop: "/work/shots/taiyarineetki-desktop.jpg",
    shotDesktopSize: [1200, 8341],
    shotMobile: "/work/shots/taiyarineetki-mobile.jpg",
    shotMobileSize: [390, 15717],
    appStore: "https://apps.apple.com/app/taiyari-neet-ki/id6740091521",
    playStore: "https://play.google.com/store/apps/details?id=com.taiyarineetki.app",
    result: "Live on the App Store and Google Play with a conversion-focused landing page",
    summary: "A complete NEET learning app for iOS and Android (topic-wise explanations, MCQ practice, PYQs, mock tests) plus the landing page that drives installs.",
    challenge: "Students needed one app that explains concepts and lets them practise, and the brand needed a landing page that converts search and ad traffic into installs.",
    approach: "We designed and developed the app for both platforms, shipped it to the App Store and Google Play, and built a fast landing page with install CTAs, feature sections and pricing.",
    deliverables: ["iOS app development", "Android app development", "Landing page design & development", "App Store & Play Store launch"],
    services: ["web-design-development", "branding-creative"],
  },
];

/* ---------------------------------------------------------------- service categories */
export type SubService = Omit<Service, "icon">;

export type ServiceCategory = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  icon: string;
  headline: string;
  description: string;
  /** Legacy SERVICES slug this category grew out of (keeps /services/[slug] content). */
  legacy?: string;
  subs: SubService[];
  faqs: { q: string; a: string }[];
  keywords: string[];
};

const legacy = (slug: string): SubService => {
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown legacy service ${slug}`);
  const { icon: _icon, ...rest } = s;
  void _icon;
  return rest;
};

const sub = (
  slug: string,
  name: string,
  short: string,
  headline: string,
  description: string,
  benefits: string[],
  deliverables: string[],
  faqs: { q: string; a: string }[],
  keywords: string[]
): SubService => ({ slug, name, short, headline, description, benefits, deliverables, faqs, keywords });

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "seo",
    name: "SEO & Search",
    short: "Rank for the searches that bring customers: local, technical, on-page and links.",
    tagline: "Own page one for your category in Delhi NCR.",
    icon: "Search",
    headline: "SEO services in Delhi NCR that compound every month",
    description:
      "Search is the highest-intent channel you have. Our SEO team fixes what blocks Google, maps keywords to buyer intent, builds authority with links and tracks rankings that actually bring enquiries.",
    legacy: "seo",
    keywords: ["seo services delhi", "seo agency delhi ncr", "seo company gurugram", "seo company noida"],
    faqs: [
      { q: "Which SEO service should I start with?", a: "A local business starts with local SEO and Google Business Profile. An e-commerce or content-heavy site starts with a technical audit and on-page work. We recommend the mix on the free audit call." },
      { q: "How is SEO priced?", a: "Monthly retainers from Rs 15,000 depending on the number of keywords, pages and locations. Link building and content are quoted per piece when needed." },
    ],
    subs: [
      sub("local-seo", "Local SEO", "Rank in the Google Maps 3-pack for 'near me' searches across Delhi NCR.", "Local SEO that fills your phone with calls from Google Maps", "For clinics, restaurants, showrooms and service businesses, the Maps pack is where customers decide. We optimise your Google Business Profile, build citations, earn reviews and create location pages so you show up first in your area.", ["Top 3 Maps ranking for your money keywords", "More calls, directions and WhatsApp clicks", "Reviews that build trust and rankings", "Location pages for every area you serve"], ["Google Business Profile audit & optimisation", "Citation building & NAP cleanup", "Review generation workflow", "Location & area landing pages", "Local link building", "Monthly Maps ranking report"], [{ q: "How long does local SEO take?", a: "Most Delhi NCR businesses see Maps movement in 4 to 8 weeks; competitive categories like dental or real estate take 3 to 4 months to reach the top 3." }, { q: "Do you handle multiple locations?", a: "Yes. We manage multi-location profiles for chains across Delhi, Gurugram, Noida, Faridabad and Ghaziabad." }], ["local seo delhi", "google maps ranking", "gmb optimisation delhi ncr"]),
      sub("technical-seo", "Technical SEO", "Fix crawl, speed, indexing and Core Web Vitals so Google can rank you.", "Technical SEO that removes everything holding your rankings back", "Slow pages, broken redirects, duplicate content and poor indexing quietly cap your growth. We audit the site like Googlebot does, prioritise fixes by impact and work with your developers (or ours) to ship them.", ["Core Web Vitals in the green", "Clean crawl budget and indexing", "Structured data for rich results", "Future-proof site architecture"], ["Full technical crawl & audit", "Core Web Vitals & speed fixes", "Indexing, canonical & redirect cleanup", "Schema markup implementation", "Internal linking architecture", "Monthly health monitoring"], [{ q: "Do you need access to our website?", a: "For the audit, read-only access to Search Console and Analytics is enough. For fixes we either guide your developer or implement them ourselves." }, { q: "Which platforms do you support?", a: "WordPress, Shopify, Next.js, Webflow, Magento and custom builds." }], ["technical seo agency delhi", "core web vitals optimisation", "website speed optimisation india"]),
      sub("on-page-seo", "On-Page SEO & Content", "Keyword-mapped pages, titles and content that satisfy intent.", "On-page SEO that turns every page into a ranking asset", "Rankings come from pages that answer the search better than anyone else. We map keywords to pages, rewrite titles and headings, build topic clusters and refresh thin content so each URL earns its place.", ["Keyword-to-page mapping across the site", "Titles and meta that earn clicks", "Topic clusters that build authority", "Content refreshes for decaying pages"], ["Keyword research & intent mapping", "Title, meta & heading optimisation", "Content briefs & SEO copywriting", "Topic cluster & pillar page plan", "Image & internal link optimisation", "Quarterly content refresh"], [{ q: "Do you write the content?", a: "Yes. Our writers produce briefs and final copy; your team only needs to approve." }, { q: "How many pages per month?", a: "Plans start at 4 optimised or new pages a month and scale with your goals." }], ["on page seo services delhi", "seo content writing delhi", "keyword research agency"]),
      sub("link-building", "Link Building & Digital PR", "Earn links from Indian publications and niche sites that move rankings.", "Link building and digital PR that earns authority, not penalties", "Authority still decides who ranks for competitive terms. We earn placements through data stories, expert quotes and partnerships with relevant Indian and international publishers, never link farms.", ["Links from real, relevant publications", "Safe, white-hat outreach only", "Brand mentions that also drive referrals", "Clear reporting on every placement"], ["Backlink gap analysis vs competitors", "Digital PR story ideation", "Guest post & editorial outreach", "Niche edits & resource placements", "Toxic link audit & disavow", "Monthly link report"], [{ q: "How many links per month?", a: "Packages start at 5 quality placements a month. We prioritise relevance and authority over volume." }, { q: "Do you guarantee specific publications?", a: "No agency can guarantee editorial placements. We share a target list and report on every link earned." }], ["link building services india", "digital pr agency delhi", "backlink services"]),
      sub("ecommerce-seo", "E-commerce SEO", "Category, product and collection pages that rank and sell on Shopify and WooCommerce.", "E-commerce SEO that grows organic revenue, not just traffic", "Online stores have thousands of URLs and unique problems: faceted navigation, duplicate products, thin category pages. We structure the catalogue, write category content and build links so your store ranks for buying keywords.", ["Category pages that rank for commercial terms", "Product schema for rich results", "Clean handling of filters and variants", "Organic revenue tracked in GA4"], ["Store architecture & crawl audit", "Category & collection page content", "Product page optimisation at scale", "Product & review schema", "Merchant Center feed alignment", "Monthly organic revenue report"], [{ q: "Does this work with Shopify?", a: "Yes. We work daily with Shopify, WooCommerce, Magento and headless stores." }, { q: "How is e-commerce SEO different?", a: "Scale and intent. We optimise templates that apply to hundreds of pages and target keywords with purchase intent rather than informational traffic." }], ["ecommerce seo agency delhi", "shopify seo india", "woocommerce seo"]),
      sub("seo-audit", "SEO Audit & Strategy", "A prioritised 90-day SEO roadmap built from a full audit of your site and competitors.", "An SEO audit that tells you exactly what to fix first", "Before spending a rupee on content or links, know where you stand. We audit technical health, content, authority and competitors, then hand you a prioritised roadmap you can execute with us or in-house.", ["Clear picture of what blocks growth", "Competitor keyword and link gaps", "Prioritised by impact and effort", "Usable by any team or agency"], ["Technical, content & authority audit", "Keyword universe & opportunity sizing", "Competitor gap analysis", "90-day prioritised roadmap", "Walkthrough call with your team", "Optional implementation plan"], [{ q: "How long does an audit take?", a: "7 to 10 working days for most sites; large e-commerce stores take a little longer." }, { q: "Is the audit free?", a: "The initial growth audit on our contact page is free. The full SEO audit with roadmap is a paid, one-time engagement." }], ["seo audit services delhi", "seo strategy consultant", "seo roadmap"]),
    ],
  },
  {
    slug: "paid-ads",
    name: "Paid Ads",
    short: "Google, Meta, YouTube, LinkedIn and marketplace ads engineered for cost per lead.",
    tagline: "Leads from week one, scaled on profit.",
    icon: "MousePointerClick",
    headline: "Performance marketing in Delhi NCR that reports in rupees",
    description:
      "We run paid media like a P&L. Conversion tracking first, creative testing every week, budgets moved to what converts, and a dashboard you can open any time to see cost per lead and ROAS.",
    keywords: ["performance marketing agency delhi", "ppc agency delhi ncr", "paid ads agency gurugram"],
    faqs: [
      { q: "Is ad spend included in your fees?", a: "No. Ad spend goes directly to Google, Meta or LinkedIn from your own account. Our management fee is separate and you keep full ownership of the accounts." },
      { q: "What is the minimum budget?", a: "We recommend at least Rs 30,000 per month in ad spend per platform for meaningful data." },
    ],
    subs: [
      legacy("google-ads-ppc"),
      legacy("meta-ads"),
      sub("youtube-ads", "YouTube Ads", "Skippable, bumper and Shorts campaigns that build demand and remarket at scale.", "YouTube Ads that make Delhi NCR remember your brand", "India watches YouTube more than TV. We plan, script and run video campaigns for awareness and performance, from 6-second bumpers to Shorts, with view-based remarketing feeding your Search and Meta funnels.", ["Cheapest reach in India per thousand views", "Audience building for remarketing", "Performance formats with action CTAs", "Creative hooks tested in the first 5 seconds"], ["Audience & placement strategy", "Script and storyboard for ad creatives", "Video production or editing", "Campaign setup: in-stream, Shorts, bumpers", "Brand lift & conversion tracking", "Monthly report"], [{ q: "Do you produce the videos?", a: "Yes, or we cut ads from footage you already have. Short, hook-first edits usually outperform polished long videos." }, { q: "Can YouTube ads drive leads?", a: "Yes, with Video Action campaigns and remarketing. We typically pair YouTube with Search to capture the demand it creates." }], ["youtube ads agency delhi", "video advertising india", "youtube marketing agency"]),
      sub("linkedin-ads", "LinkedIn Ads (B2B)", "Account-based campaigns for B2B, SaaS and professional services.", "LinkedIn Ads that reach decision-makers, not everyone", "For B2B companies in Gurugram and Noida, LinkedIn is where buyers are. We build targeting by title, company and industry, run lead-gen forms and document ads, and sync leads to your CRM.", ["Precise targeting by role and company", "Lower cost per qualified lead than generic platforms", "Thought-leadership and lead-gen formats", "CRM-integrated lead flow"], ["ICP & account list building", "Campaign structure & bidding", "Creative: single image, carousel, document, video", "Lead-gen forms & CRM sync", "Retargeting website visitors", "Monthly pipeline report"], [{ q: "Is LinkedIn too expensive?", a: "CPCs are higher than Google or Meta, but qualified B2B leads are often cheaper when measured against deal size." }, { q: "Do you run organic LinkedIn too?", a: "Yes, through our social media team. Founder-led content and ads together work best." }], ["linkedin ads agency delhi", "b2b marketing agency gurugram", "linkedin lead generation india"]),
      sub("remarketing", "Remarketing & Retargeting", "Bring back visitors across Google, Meta and YouTube with sequenced offers.", "Remarketing that converts the 97% who did not buy the first time", "Most visitors leave without acting. We build audiences by behaviour, sequence messages across Display, Meta, YouTube and WhatsApp, and cap frequency so your brand stays helpful rather than annoying.", ["Recover abandoned leads and carts", "Lower blended cost per acquisition", "Cross-platform audience sync", "Frequency and creative control"], ["Pixel, CAPI & GA4 audience setup", "Audience segmentation by intent", "Sequenced creative across platforms", "Dynamic product and catalogue ads", "Frequency capping & exclusions", "Incrementality reporting"], [{ q: "Does remarketing feel creepy to customers?", a: "Not when it is capped and sequenced. We limit frequency and move from reminder to offer to social proof rather than repeating one ad." }, { q: "Can I remarket without a large audience?", a: "You need a few hundred visitors a month for it to be worthwhile. We will tell you honestly if it is too early." }], ["retargeting agency delhi", "remarketing services india", "dynamic product ads"]),
      sub("marketplace-ads", "Amazon & Marketplace Ads", "Sponsored Products and Brands campaigns that lift marketplace sales profitably.", "Marketplace ads that grow Amazon and Flipkart sales without burning margin", "Marketplaces are pay-to-play. We manage Sponsored Products, Brands and Display, control ACoS with search-term mining and negative keywords, and align ads with listing optimisation for organic lift.", ["Lower ACoS with tighter targeting", "Organic rank lift from ad velocity", "Launch strategy for new SKUs", "Weekly bid and budget control"], ["Account & campaign restructure", "Keyword & ASIN targeting research", "Listing & A+ content recommendations", "Negative keyword & search-term mining", "Weekly bid optimisation", "Monthly ACoS and TACoS report"], [{ q: "Which marketplaces do you manage?", a: "Amazon India, Flipkart and Myntra ads, with listing support for all three." }, { q: "Do you also optimise listings?", a: "We recommend and write listing improvements; ads perform best when the listing converts." }], ["amazon ads agency delhi", "amazon ppc management india", "flipkart ads agency"]),
    ],
  },
  {
    slug: "social-media-marketing",
    name: "Social Media & Content",
    short: "Instagram, LinkedIn, YouTube and creator content that builds a brand people follow.",
    tagline: "Content people actually watch, posted within 24 hours of the trend.",
    icon: "Share2",
    headline: "Social media marketing in Delhi NCR that grows followers and sales",
    description:
      "From reels and carousels to founder-led LinkedIn posts and creator collaborations, we plan, shoot, edit and publish content that builds community and drives enquiries, with a trend desk that reacts the same day.",
    legacy: "social-media-marketing",
    keywords: ["social media marketing agency delhi", "instagram marketing agency gurugram", "content marketing agency delhi ncr"],
    faqs: [
      { q: "Do you shoot content on location?", a: "Yes. Our Delhi NCR crew does reel shoots at your store, clinic, kitchen or office, and we also produce studio content." },
      { q: "How many posts are included?", a: "Plans start at 12 posts a month and scale to daily posting with reels, stories and trend content." },
    ],
    subs: [
      sub("instagram-marketing", "Instagram Marketing", "Reels, carousels, stories and DMs managed as one growth system.", "Instagram marketing that turns followers into customers", "Instagram is where Delhi NCR discovers brands. We build a content system around reels and carousels, manage the community, run collaborations and connect DMs to your sales process.", ["Consistent reel-led content calendar", "Growth in reach, saves and shares", "DM and comment management", "Monthly content performance review"], ["Profile & content audit", "Monthly content calendar", "Reel production & editing", "Carousel & story design", "Community management", "Growth & engagement report"], [{ q: "Will you post from our account?", a: "Yes, with approvals in a shared calendar. You see everything before it goes live." }, { q: "Can you grow a new account?", a: "Yes. New accounts grow fastest with reels and collaborations; we set realistic 90-day targets." }], ["instagram marketing agency delhi", "instagram growth services", "instagram management gurugram"]),
      sub("reels-video-production", "Reels & Short Video Production", "Scripted, shot and edited short-form video for Instagram, YouTube Shorts and ads.", "Reels production that stops the scroll in the first second", "Short video is the highest-reach format on every platform. Our scriptwriters, shooters and editors produce hook-first reels for your brand, with trend formats turned around within 24 hours.", ["Hook-first scripts tested on data", "On-location and studio shoots", "Fast turnaround on trending formats", "Usable as organic posts and ads"], ["Monthly reel scripting", "On-location shoot days", "Editing with captions & motion graphics", "Trend monitoring & same-day formats", "Founder and team video coaching", "Performance review and iteration"], [{ q: "How many reels per month?", a: "Packages start at 8 reels a month and go up to daily posting." }, { q: "Do we need to appear on camera?", a: "Founder-led content performs best, but we also produce product, voice-over and UGC-style formats without you on camera." }], ["reels production delhi", "short video agency india", "video content agency gurugram"]),
      legacy("content-marketing"),
      legacy("influencer-marketing"),
      sub("linkedin-marketing", "LinkedIn & Founder Branding", "Founder-led content and company page management for B2B credibility.", "LinkedIn marketing that makes founders the category voice", "In B2B, people buy from people. We ghostwrite founder posts from interviews, design carousels, manage the company page and run engagement routines that bring inbound conversations.", ["Founder voice without the time cost", "Consistent posting cadence", "Inbound DMs from decision-makers", "Company page that supports sales"], ["Positioning & content pillars", "Weekly founder interviews", "Ghostwritten posts & carousels", "Company page management", "Engagement and comment routine", "Monthly inbound report"], [{ q: "Will the posts sound like me?", a: "Yes. Every post starts from a recorded conversation with you, so the opinions and stories are yours." }, { q: "How many posts per week?", a: "Three to five founder posts and two to three company posts is the usual cadence." }], ["linkedin marketing agency delhi", "founder branding india", "linkedin ghostwriting"]),
      sub("youtube-management", "YouTube Channel Management", "Strategy, thumbnails, editing and SEO for long-form and Shorts channels.", "YouTube channel management that compounds views into customers", "YouTube is a search engine and a social network. We plan series, optimise titles and thumbnails, edit long-form and Shorts, and track which videos bring enquiries.", ["Searchable video topics with lasting traffic", "Thumbnails and titles that get the click", "Shorts that feed long-form", "Clear path from video to enquiry"], ["Channel audit & content strategy", "Keyword research for video topics", "Editing for long-form & Shorts", "Thumbnail design & A/B testing", "Titles, descriptions & chapters", "Monthly analytics report"], [{ q: "Do you shoot the videos?", a: "We can shoot in Delhi NCR or edit footage you record. Many clients record on a phone with our guidance." }, { q: "How long until a channel grows?", a: "Expect 3 to 6 months of consistent publishing before search traffic becomes meaningful." }], ["youtube channel management india", "youtube marketing agency delhi", "video seo"]),
    ],
  },
  {
    slug: "web-design-development",
    name: "Web Development",
    short: "Fast, conversion-focused websites and landing pages on Next.js, WordPress and Shopify.",
    tagline: "Websites that load fast and convert faster.",
    icon: "Code2",
    headline: "Web design and development in Delhi NCR built for conversions",
    description:
      "Your website is your hardest-working salesperson. We design and build sites with clear messaging, strong calls to action, Core Web Vitals in the green and SEO baked in from the first wireframe.",
    legacy: "web-design-development",
    keywords: ["website design company delhi", "web development agency gurugram", "landing page design noida"],
    faqs: [
      { q: "How long does a website take?", a: "A landing page in 7 days, a business website in 3 to 4 weeks, and e-commerce in 6 to 8 weeks." },
      { q: "Do you provide hosting and maintenance?", a: "Yes. We set up hosting on Vercel or managed WordPress hosting and offer monthly maintenance plans." },
    ],
    subs: [
      sub("business-website", "Business Website Design", "Corporate and service-business websites that explain, rank and convert.", "Business websites that make your company look as good as it is", "A credible, fast website with clear services, proof and calls to action. We handle copy, design, build and tracking so the site starts generating enquiries from launch.", ["Clear messaging and service pages", "Mobile-first, 90+ PageSpeed", "SEO-ready structure", "Easy to edit CMS"], ["Discovery & sitemap", "Copywriting", "UI design in Figma", "Build on Next.js or WordPress", "Forms, WhatsApp & analytics setup", "Training and handover"], [{ q: "How many pages are included?", a: "Business sites usually have 8 to 15 pages. We scope it after a short discovery call." }, { q: "Can we edit the site ourselves?", a: "Yes. We build on a CMS and train your team." }], ["business website design delhi", "corporate website development", "website designer gurugram"]),
      sub("landing-pages", "Landing Pages & CRO", "High-converting landing pages for ads, with ongoing conversion optimisation.", "Landing pages that turn ad clicks into leads", "Sending ad traffic to a homepage wastes money. We build dedicated landing pages with one message and one action, then test headlines, forms and offers to push conversion rates up.", ["Higher conversion rate on paid traffic", "Lower cost per lead", "Fast builds in days, not weeks", "Continuous A/B testing"], ["Offer & message strategy", "Copywriting", "Design & build", "Forms, WhatsApp & call tracking", "A/B testing plan", "Monthly CRO report"], [{ q: "How fast can you build one?", a: "A landing page goes live in 5 to 7 working days." }, { q: "What conversion rate should I expect?", a: "Service businesses typically see 5 to 15% on well-targeted paid traffic. We benchmark your category during the audit." }], ["landing page design delhi", "cro agency india", "conversion rate optimisation"]),
      sub("nextjs-development", "Next.js & Headless Development", "Custom, high-performance web apps and headless sites for brands that outgrew templates.", "Next.js development for brands that need speed and flexibility", "When a template is not enough, we build custom sites and web apps on Next.js and React with headless CMS, edge hosting and clean APIs, so marketing and product teams can move fast.", ["Best-in-class performance scores", "Custom features and integrations", "Headless CMS for easy editing", "Scales from campaign site to platform"], ["Technical discovery & architecture", "Design system & component library", "Next.js build with headless CMS", "Integrations: CRM, payments, APIs", "Hosting on Vercel & CI/CD", "Ongoing development retainer"], [{ q: "When should I choose Next.js over WordPress?", a: "When performance, custom functionality or integrations matter more than plugin availability." }, { q: "Do you work with existing developers?", a: "Yes. We can lead, pair with or hand over to your in-house team." }], ["nextjs development agency india", "react development company delhi", "headless cms development"]),
      sub("wordpress-development", "WordPress Development", "Custom WordPress themes, speed optimisation and ongoing care.", "WordPress websites that are fast, secure and easy to manage", "We build WordPress sites without bloated themes: custom blocks, lean plugins, caching and security hardening, so your site stays fast and your team can edit everything.", ["Custom design, no template look", "Fast with proper caching and images", "Secure, updated and backed up", "Editable by non-technical staff"], ["Custom theme & block development", "Migration from old site", "Speed & Core Web Vitals optimisation", "Security hardening & backups", "Plugin audit and cleanup", "Monthly maintenance plan"], [{ q: "Can you fix our slow WordPress site?", a: "Usually yes. A speed audit identifies theme, plugin, hosting and image issues; most sites reach 90+ on mobile after fixes." }, { q: "Do you offer maintenance?", a: "Yes, with updates, backups, uptime monitoring and small changes each month." }], ["wordpress development delhi", "wordpress speed optimisation", "wordpress agency gurugram"]),
      sub("website-maintenance", "Website Maintenance & Speed", "Monthly care plans: updates, backups, security, speed and small changes.", "Website maintenance so your site never becomes the bottleneck", "Websites decay. Plugins break, pages slow down, forms stop working. Our care plans keep the site updated, secure and fast, with a monthly allowance for content and design changes.", ["Uptime and security monitoring", "Speed kept in the green", "Fast turnaround on small changes", "Monthly health report"], ["Core, plugin & dependency updates", "Daily backups & restore", "Security scanning & hardening", "Speed monitoring and fixes", "Monthly change requests", "Health report"], [{ q: "Do you maintain sites you did not build?", a: "Yes, after a short onboarding audit." }, { q: "What does a plan include?", a: "Plans are tiered by hours of changes per month plus the standard update, backup and security routine." }], ["website maintenance services delhi", "website amc india", "website support plan"]),
    ],
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    short: "Shopify and WooCommerce stores, marketplace growth and retention for D2C brands.",
    tagline: "From first order to repeat customer.",
    icon: "ShoppingBag",
    headline: "E-commerce marketing and development for D2C brands in Delhi NCR",
    description:
      "We build stores that convert, run catalogue ads that scale, and set up the retention flows that make a D2C brand profitable. One team for store, ads, marketplaces and CRM.",
    keywords: ["ecommerce agency delhi", "d2c marketing agency india", "shopify agency gurugram"],
    faqs: [
      { q: "Do you work with early-stage D2C brands?", a: "Yes. Many clients start with a Shopify build and a small Meta budget, then add SEO, marketplaces and retention as revenue grows." },
      { q: "Can you take over an existing store?", a: "Yes. We audit the store, tracking and ad accounts first, then propose the quickest wins." },
    ],
    subs: [
      sub("shopify-development", "Shopify Store Development", "Custom Shopify themes and apps designed for conversion and speed.", "Shopify stores built to convert on mobile", "We design and build Shopify stores with fast themes, persuasive product pages, clean checkout and the apps you actually need, then connect pixels, feeds and analytics correctly from day one.", ["Mobile-first product pages that sell", "Fast theme with minimal apps", "Correct pixel, CAPI and GA4 setup", "Ready for ads and SEO at launch"], ["Store strategy & UX", "Custom theme design & build", "Product page and checkout optimisation", "App selection and integration", "Pixel, feed & analytics setup", "Launch and training"], [{ q: "How long does a Shopify build take?", a: "4 to 8 weeks depending on catalogue size and customisation." }, { q: "Do you migrate from WooCommerce or Magento?", a: "Yes, including products, customers, orders and redirects to protect SEO." }], ["shopify development agency delhi", "shopify experts india", "shopify store design"]),
      sub("woocommerce-development", "WooCommerce Development", "WordPress-based stores with full control over design and checkout.", "WooCommerce stores for brands that want ownership and flexibility", "For catalogues with complex rules or content-heavy brands, WooCommerce gives full control. We build lean, fast stores with custom checkout flows and payment and shipping integrations for India.", ["Full ownership, no platform fees", "Custom checkout and product rules", "Indian payment and shipping integrations", "Content and commerce on one site"], ["Store architecture", "Custom theme & product templates", "Checkout, payment & shipping setup", "Speed and caching", "Security & backups", "Maintenance plan"], [{ q: "Shopify or WooCommerce?", a: "Shopify for speed to launch and simplicity; WooCommerce for control and content-heavy sites. We recommend based on your catalogue and team." }, { q: "Do you support Razorpay and Shiprocket?", a: "Yes, along with most Indian payment and logistics providers." }], ["woocommerce development delhi", "woocommerce agency india", "wordpress ecommerce"]),
      sub("marketplace-management", "Amazon & Flipkart Management", "Listings, A+ content, ads and account health for marketplace growth.", "Marketplace management that grows sales and protects margins", "Marketplaces bring volume but punish sloppy accounts. We optimise listings and A+ content, run ads, manage reviews and account health, and report on true profitability after fees.", ["Higher conversion on listings", "Profitable ads with controlled ACoS", "Account health protected", "Clear profitability by SKU"], ["Listing & keyword optimisation", "A+ content and brand store", "Sponsored ads management", "Review and Q&A management", "Inventory and account health monitoring", "Monthly profitability report"], [{ q: "Which marketplaces?", a: "Amazon India, Flipkart, Myntra and Nykaa, depending on category." }, { q: "Do you handle new seller onboarding?", a: "Yes, including brand registry and catalogue setup." }], ["amazon account management delhi", "flipkart seller services", "marketplace management agency"]),
      sub("conversion-optimisation", "Store Conversion Optimisation", "Data-driven testing on product pages, cart and checkout to lift conversion rate.", "CRO that lifts store conversion rate without more ad spend", "Doubling conversion rate halves your cost per order. We analyse funnel drop-offs, run structured A/B tests on product pages, offers and checkout, and ship the winners.", ["More orders from the same traffic", "Lower cost per acquisition", "Evidence-based design decisions", "Continuous testing programme"], ["Funnel & analytics audit", "Heatmaps and session recordings", "Test hypothesis backlog", "A/B test design and build", "Checkout and cart optimisation", "Monthly CRO report"], [{ q: "How much traffic do I need for CRO?", a: "Around 10,000 sessions a month gives meaningful test results; below that we focus on best-practice fixes." }, { q: "Which tools do you use?", a: "GA4, Microsoft Clarity, Hotjar and native A/B testing, depending on the platform." }], ["ecommerce cro agency india", "conversion rate optimisation delhi", "shopify cro"]),
      sub("retention-marketing", "Retention: Email, WhatsApp & Loyalty", "Flows that bring customers back: welcome, cart recovery, win-back and loyalty.", "Retention marketing that makes every customer worth more", "Acquisition is expensive; repeat orders are profit. We set up email and WhatsApp automations, segment customers by behaviour and run loyalty and win-back campaigns measured by repeat revenue.", ["Higher repeat purchase rate", "Automated cart and browse recovery", "Segmented campaigns that feel personal", "Revenue attributed to each flow"], ["Klaviyo / Brevo / WhatsApp API setup", "Core automation flows", "Segmentation strategy", "Campaign calendar and design", "Loyalty programme setup", "Monthly retention revenue report"], [{ q: "Which platforms do you use?", a: "Klaviyo, Brevo, Mailchimp and WhatsApp Business API providers like Interakt and Wati." }, { q: "How quickly do flows pay back?", a: "Cart recovery and welcome flows usually pay for themselves in the first month." }], ["retention marketing agency india", "klaviyo agency delhi", "whatsapp marketing ecommerce"]),
    ],
  },
  {
    slug: "branding-creative",
    name: "Creative & Branding",
    short: "Identity, ad creatives, packaging and motion that make your brand unforgettable.",
    tagline: "Brands people remember, creatives people click.",
    icon: "Sparkles",
    headline: "Branding and creative agency in Delhi NCR",
    description:
      "Great marketing starts with a clear brand and ends with creative that performs. We craft identities, messaging and creative systems that work everywhere, from Instagram grids to billboards in Gurugram.",
    legacy: "branding-creative",
    keywords: ["branding agency delhi", "creative agency gurugram", "logo design delhi ncr"],
    faqs: [
      { q: "Do you do rebrands?", a: "Yes. Many clients come to us for a refresh before scaling ads or launching a new website." },
      { q: "How is branding priced?", a: "Per project, based on scope: logo and identity from Rs 40,000; full brand systems and packaging are quoted after a discovery call." },
    ],
    subs: [
      sub("logo-identity", "Logo & Brand Identity", "Logo, colour, typography and a guidelines document your team can use.", "Brand identity that looks right everywhere it appears", "A logo is only the start. We design the full identity system, colours, type, iconography and usage rules, so every post, package and page feels like one brand.", ["Distinctive, ownable identity", "Works from favicon to hoarding", "Clear usage guidelines", "Files for print, web and social"], ["Discovery & positioning workshop", "Logo concepts and refinement", "Colour and typography system", "Brand guidelines document", "Stationery and social templates", "Final file package"], [{ q: "How many logo concepts do we see?", a: "Three directions, then two rounds of refinement on the chosen one." }, { q: "How long does it take?", a: "3 to 5 weeks for a full identity." }], ["logo design delhi", "brand identity agency india", "branding company gurugram"]),
      sub("ad-creatives", "Ad Creative Production", "Statics, carousels and video ads produced weekly for Meta and Google.", "Ad creatives built for testing, not just looking good", "Paid media performance is mostly creative. We produce batches of hooks, formats and angles every week, learn from the data and iterate, so your ads never fatigue.", ["Weekly creative batches", "Formats for every placement", "Data-driven iteration", "Works with our or your media team"], ["Creative strategy & angles", "Static and carousel design", "UGC-style and motion video ads", "Copy variations", "Weekly performance review", "Creative library management"], [{ q: "How many creatives per month?", a: "Packages start at 12 statics and 4 videos a month." }, { q: "Can you work with our existing ad team?", a: "Yes. We supply creatives and briefs to any media buyer." }], ["ad creative agency delhi", "meta ad creatives india", "performance creative studio"]),
      sub("packaging-design", "Packaging Design", "Packaging and labels that stand out on shelf and in unboxing videos.", "Packaging design that sells on shelf and on Instagram", "Packaging is your most-seen ad. We design packaging systems for D2C and retail brands, with print-ready files, dielines and mockups, built to look great in unboxing content.", ["Shelf and feed standout", "Print-ready, compliant artwork", "Consistent across the range", "Unboxing-friendly structure"], ["Range and structure planning", "Concept design", "Dieline and artwork", "Label compliance check", "Mockups and 3D renders", "Print coordination"], [{ q: "Do you handle printing?", a: "We coordinate with your printer or recommend trusted vendors in Delhi NCR." }, { q: "Do you design for food and cosmetics?", a: "Yes, including FSSAI and legal metrology label requirements." }], ["packaging design agency delhi", "label design india", "product packaging designer"]),
      sub("motion-graphics", "Motion Graphics & Explainers", "Animated explainers, logo animations and motion templates for social and ads.", "Motion graphics that explain and entertain", "Animation makes complex products simple and feeds look alive. We produce explainer videos, animated ads, logo reveals and reusable motion templates for your social team.", ["Clear explanation of complex offers", "Consistent animated brand system", "Reusable templates for social", "Formats for ads and websites"], ["Script and storyboard", "Illustration and design", "2D animation", "Sound design and voice-over", "Logo animation and stings", "Template pack for social"], [{ q: "How long is an explainer?", a: "60 to 90 seconds works best for websites; 15 to 30 seconds for ads." }, { q: "Turnaround?", a: "2 to 4 weeks for an explainer; motion templates in about a week." }], ["motion graphics agency delhi", "explainer video india", "animated ads"]),
      sub("brand-strategy", "Brand Strategy & Messaging", "Positioning, messaging and tone of voice that make every channel consistent.", "Brand strategy that gives your marketing one clear story", "Before design or ads, you need a position worth defending. We run workshops, research customers and competitors, and write the positioning, messaging hierarchy and tone of voice that guide everything else.", ["Clear positioning versus competitors", "Messaging your team can reuse", "Tone of voice for every channel", "Foundation for identity and campaigns"], ["Stakeholder and customer interviews", "Competitor and category analysis", "Positioning and brand platform", "Messaging hierarchy", "Tone of voice guide", "Rollout workshop"], [{ q: "Do we need strategy before a logo?", a: "It helps. Identity decisions are much faster and better when positioning is settled first." }, { q: "How long does it take?", a: "3 to 4 weeks including interviews and workshops." }], ["brand strategy consultant delhi", "brand positioning agency india", "brand messaging"]),
    ],
  },
  {
    slug: "automation-crm",
    name: "Automation & CRM",
    short: "WhatsApp, email, chatbots and CRM pipelines that follow up every lead automatically.",
    tagline: "No lead left waiting.",
    icon: "MessageCircle",
    headline: "Marketing automation and CRM setup for growing businesses in Delhi NCR",
    description:
      "Leads go cold in minutes. We connect your forms, ads and WhatsApp to a CRM, automate first replies and nurture sequences, and give your sales team a pipeline they actually use.",
    keywords: ["marketing automation agency delhi", "whatsapp automation india", "crm setup gurugram"],
    faqs: [
      { q: "Which CRMs do you work with?", a: "HubSpot, Zoho, Salesforce, Pipedrive and LeadSquared, plus WhatsApp platforms like Interakt, Wati and AiSensy." },
      { q: "Is WhatsApp marketing compliant?", a: "Yes, through the official WhatsApp Business API with opt-in consent. We handle templates and compliance." },
    ],
    subs: [
      legacy("whatsapp-email-marketing"),
      sub("whatsapp-automation", "WhatsApp Business API Automation", "Instant replies, lead qualification and broadcasts on the official API.", "WhatsApp automation that replies in seconds, 24 hours a day", "Indian customers expect a WhatsApp reply immediately. We set up the Business API, build qualification flows, connect ads and forms, and run opt-in broadcasts measured by replies and revenue.", ["Instant first response to every lead", "Qualified leads routed to the right person", "Broadcasts with high open rates", "Green-tick verified business"], ["API onboarding and verification", "Chat flow and template design", "Click-to-WhatsApp ad integration", "CRM and form integration", "Broadcast campaigns", "Monthly conversation report"], [{ q: "Can we still reply manually?", a: "Yes. Automation handles the first steps; your team takes over in a shared inbox." }, { q: "What does it cost?", a: "Platform fees plus per-message charges from Meta, and our setup and management fee." }], ["whatsapp business api agency delhi", "whatsapp chatbot india", "whatsapp automation gurugram"]),
      sub("crm-setup", "CRM Setup & Lead Routing", "HubSpot, Zoho or LeadSquared configured for your sales process with automatic lead routing.", "CRM setup that your sales team will actually use", "A CRM only works if leads flow in automatically and the pipeline matches how you sell. We configure stages, routing, reminders and dashboards, and integrate every lead source.", ["Every lead captured automatically", "Clear pipeline and follow-up reminders", "Routing by territory, service or budget", "Dashboards for management"], ["Sales process mapping", "CRM configuration and pipelines", "Lead source integrations", "Routing and assignment rules", "Reporting dashboards", "Team training"], [{ q: "Which CRM should we choose?", a: "Depends on team size and budget. Zoho and HubSpot Starter suit most SMBs; LeadSquared suits high-volume calling teams." }, { q: "Do you migrate old data?", a: "Yes, including contacts, deals and notes from spreadsheets or another CRM." }], ["crm implementation delhi", "hubspot setup india", "zoho crm consultant gurugram"]),
      sub("email-automation", "Email Marketing & Automation", "Newsletters and automated nurture journeys that keep leads warm.", "Email automation that nurtures leads until they are ready to buy", "Most leads are not ready today. We build welcome, nurture and re-engagement sequences, design newsletters and segment your list, so email becomes a steady source of enquiries and repeat sales.", ["Automated nurture that runs itself", "Deliverability set up correctly", "Segmented, relevant campaigns", "Revenue attributed to email"], ["Platform setup and domain authentication", "Automation flows", "Newsletter design and copy", "List segmentation", "A/B testing", "Monthly performance report"], [{ q: "Which platforms?", a: "Brevo, Mailchimp, Klaviyo, HubSpot and ActiveCampaign." }, { q: "How often should we email?", a: "Weekly or fortnightly newsletters plus automated flows is a healthy cadence for most businesses." }], ["email marketing agency delhi", "email automation india", "newsletter management"]),
      sub("chatbots", "Website & AI Chatbots", "Chatbots on your site and WhatsApp that answer questions and capture leads.", "Chatbots that qualify visitors while your team sleeps", "A good chatbot answers common questions, collects contact details and books calls. We build rule-based and AI-assisted bots for websites and WhatsApp, trained on your services and pricing.", ["24/7 lead capture", "Fewer repetitive support queries", "Hand-off to humans when needed", "Leads pushed straight to CRM"], ["Conversation design", "Knowledge base from your content", "Website widget setup", "WhatsApp bot setup", "CRM and calendar integration", "Monthly transcript review"], [{ q: "Will the bot say wrong things?", a: "We constrain it to your approved content and route anything uncertain to a human." }, { q: "Can it book meetings?", a: "Yes, through calendar integrations like Calendly or Google Calendar." }], ["chatbot development delhi", "ai chatbot for website india", "whatsapp bot agency"]),
      sub("lead-management", "Lead Management & Reporting", "Call tracking, form attribution and dashboards that show where every lead came from.", "Lead management that shows exactly which marketing pays", "If you cannot see which campaign brought the lead, you cannot scale it. We set up call tracking, form and WhatsApp attribution, GA4 events and a single dashboard for marketing and sales.", ["Source of every lead, including calls", "One dashboard for all channels", "Cost per lead by campaign", "Sales outcomes fed back to ads"], ["GA4 and GTM event setup", "Call tracking integration", "Form and WhatsApp attribution", "Offline conversion import to ads", "Looker Studio dashboard", "Monthly review"], [{ q: "Can you track phone calls from ads?", a: "Yes, with call tracking numbers and Google Ads call conversions." }, { q: "Do you need access to our ad accounts?", a: "Read access is enough for reporting; we request edit access only if we manage the campaigns." }], ["lead tracking setup delhi", "marketing dashboard india", "call tracking agency"]),
    ],
  },
];

/** Flat list of every sub-service with its category slug. */
export const ALL_SUB_SERVICES: { category: ServiceCategory; service: SubService }[] = SERVICE_CATEGORIES.flatMap((c) => c.subs.map((service) => ({ category: c, service })));

export const findCategory = (slug: string) => SERVICE_CATEGORIES.find((c) => c.slug === slug);

/** Resolve a sub-service by slug (optionally within a category). Legacy SERVICES slugs are also resolved. */
export function findSubService(slug: string, category?: string) {
  return ALL_SUB_SERVICES.find((x) => x.service.slug === slug && (!category || x.category.slug === category));
}

/** Canonical URL for any service or category slug (legacy slugs included). */
export function serviceUrl(slug: string): string {
  const cat = findCategory(slug);
  if (cat) return `/services/${cat.slug}`;
  const hit = findSubService(slug);
  if (hit) return `/services/${hit.category.slug}/${hit.service.slug}`;
  return `/services/${slug}`;
}

/* ---------------------------------------------------------------- portfolio helpers */
/**
 * WORK items relevant to a service or category slug. Matches items tagged with the slug itself,
 * with the parent category's slug, or with any sibling in the same category. Falls back to all WORK.
 */
export function workForService(slug: string): WorkItem[] {
  const cat = findCategory(slug) ?? findSubService(slug)?.category;
  const related = new Set<string>([slug]);
  if (cat) {
    related.add(cat.slug);
    if (cat.legacy) related.add(cat.legacy);
    cat.subs.forEach((s) => related.add(s.slug));
  }
  const direct = WORK.filter((w) => w.services.includes(slug));
  const viaCategory = WORK.filter((w) => !direct.includes(w) && w.services.some((s) => related.has(s)));
  const rest = WORK.filter((w) => !direct.includes(w) && !viaCategory.includes(w));
  // Most relevant first; the caller's limit decides how many are shown, so pages are never empty.
  return [...direct, ...viaCategory, ...rest];
}

/** WORK items for an industry name (or slug). Falls back to all WORK so no industry page is empty. */
export function workForIndustry(name: string): WorkItem[] {
  const ind = INDUSTRIES.find((i) => i.name === name || i.slug === name);
  const label = ind?.name ?? name;
  const direct = WORK.filter((w) => w.industry === label);
  return direct.length ? direct : WORK;
}

/** Every location page shows the full portfolio; the caller applies a limit. */
export function workForLocation(): WorkItem[] {
  return WORK;
}

/* ---------------------------------------------------------------- locations */
export type Location = {
  slug: string;
  name: string;
  headline: string;
  intro: string;
  areas: string[];
  industriesHint: string;
  faqs: { q: string; a: string }[];
};

export const LOCATIONS: Location[] = [
  {
    slug: "delhi",
    name: "Delhi",
    headline: "Digital marketing agency in Delhi",
    intro: "From Connaught Place offices to Lajpat Nagar retailers and South Delhi clinics, we help Delhi businesses get found on Google, grow on Instagram and turn ad spend into enquiries.",
    areas: ["Connaught Place", "South Delhi", "Dwarka", "Rohini", "Lajpat Nagar", "Karol Bagh", "Saket", "Janakpuri", "Pitampura", "Nehru Place"],
    industriesHint: "Clinics, coaching institutes, restaurants, fashion retail and professional services.",
    faqs: [
      { q: "Do you meet clients in Delhi in person?", a: "Yes. We are based in Delhi NCR and schedule in-person strategy sessions and shoots across Delhi." },
      { q: "Can you target ads to specific Delhi localities?", a: "Yes. Google and Meta campaigns can be targeted by radius, pin code or neighbourhood, which works well for clinics, restaurants and showrooms." },
    ],
  },
  {
    slug: "gurugram",
    name: "Gurugram",
    headline: "Digital marketing agency in Gurugram",
    intro: "Gurugram is home to startups, D2C brands, real estate launches and corporate offices. We run performance marketing, LinkedIn and SEO programmes for businesses from Cyber City to Sohna Road.",
    areas: ["Cyber City", "Golf Course Road", "Sohna Road", "Sector 29", "Udyog Vihar", "MG Road", "New Gurugram", "Dwarka Expressway", "Sector 14", "Sushant Lok"],
    industriesHint: "Real estate, SaaS and B2B, D2C brands, gyms and wellness, premium restaurants.",
    faqs: [
      { q: "Do you work with Gurugram startups?", a: "Yes. Many of our performance marketing and LinkedIn clients are Gurugram-based startups and SaaS companies." },
      { q: "Can you help with real estate project launches in Gurugram?", a: "Yes. We build landing pages and run qualified lead campaigns for projects on Dwarka Expressway, Golf Course Extension and New Gurugram." },
    ],
  },
  {
    slug: "noida",
    name: "Noida",
    headline: "Digital marketing agency in Noida",
    intro: "Noida's mix of IT companies, education institutes, real estate and manufacturing needs marketing that generates qualified leads. We serve businesses across Noida and Greater Noida.",
    areas: ["Sector 18", "Sector 62", "Sector 63", "Sector 150", "Greater Noida West", "Noida Expressway", "Sector 16", "Sector 137", "Film City", "Yamuna Expressway"],
    industriesHint: "Real estate, IT and B2B services, education, manufacturing and exporters.",
    faqs: [
      { q: "Do you handle B2B lead generation for Noida companies?", a: "Yes. LinkedIn Ads, Google Search and SEO for IT, manufacturing and export businesses are a core part of our Noida work." },
      { q: "Can you run campaigns for Greater Noida too?", a: "Yes. Our location targeting and local SEO cover Noida, Greater Noida and Greater Noida West." },
    ],
  },
  {
    slug: "faridabad",
    name: "Faridabad",
    headline: "Digital marketing agency in Faridabad",
    intro: "Faridabad's manufacturers, home interior brands, hospitals and schools are moving online fast. We bring local SEO, Google Ads and social media that bring customers from Faridabad and beyond.",
    areas: ["Sector 15", "Sector 16", "NIT", "Old Faridabad", "Ballabhgarh", "Greater Faridabad", "Sector 21", "Surajkund", "Sector 37", "Neharpar"],
    industriesHint: "Manufacturing and industrial suppliers, home interiors, hospitals and clinics, schools.",
    faqs: [
      { q: "Do you work with industrial and B2B businesses in Faridabad?", a: "Yes. We run Google Search and SEO for manufacturers and suppliers that want enquiries from across India." },
      { q: "Is local SEO useful for a Faridabad clinic or showroom?", a: "Very. Most Faridabad customers search 'near me' before visiting, and the Maps pack decides who gets the call." },
    ],
  },
  {
    slug: "ghaziabad",
    name: "Ghaziabad",
    headline: "Digital marketing agency in Ghaziabad",
    intro: "From Indirapuram and Vaishali to Raj Nagar Extension, Ghaziabad businesses compete with Delhi and Noida for the same customers. We help you win local search, social and ads in your area.",
    areas: ["Indirapuram", "Vaishali", "Raj Nagar Extension", "Kaushambi", "Vasundhara", "Crossings Republik", "Mohan Nagar", "Sahibabad", "Govindpuram", "Kavi Nagar"],
    industriesHint: "Real estate, clinics and hospitals, restaurants, coaching institutes, retail.",
    faqs: [
      { q: "Can you target ads only to Ghaziabad?", a: "Yes. We geo-target campaigns to Ghaziabad localities or a radius around your business, so budget is not wasted on Delhi traffic." },
      { q: "Do you help Ghaziabad real estate projects?", a: "Yes. Raj Nagar Extension and Crossings Republik projects are a regular part of our real estate lead generation work." },
    ],
  },
];

/* ---------------------------------------------------------------- shared copy (homepage FAQ, pricing summary, chat) */
export const HOME_FAQS = [
  { q: "Which digital marketing services does ClickSemrus offer?", a: "SEO, social media marketing, Google Ads, Meta Ads, content marketing, web design and development, influencer marketing, WhatsApp and email marketing, and branding. Most clients combine two or three channels." },
  { q: "Do you work only with businesses in Delhi NCR?", a: "We are based in Delhi NCR and serve clients across India and abroad. Everything from strategy calls to reporting works remotely." },
  { q: "How soon can we see results?", a: "Paid ads generate leads within the first week. SEO typically shows measurable growth in 8 to 12 weeks and compounds after that." },
  { q: "What does it cost?", a: "Packages start at Rs 15,000 per month for single-channel services. See our pricing page for details or request a custom quote." },
  { q: "Is there a lock-in contract?", a: "No long lock-ins. We work month to month after an initial 3-month commitment for SEO, because that is how long it takes to prove results." },
];

export const PRICING_SUMMARY = `Starter from Rs 15,000/month (one channel: SEO, social or ads; GA4 and conversion tracking; monthly report).
Growth from Rs 40,000/month (two channels, 20 posts + 4 reels, up to 3 ad campaigns with creatives, landing page CRO, live dashboard, dedicated growth manager).
Scale from Rs 90,000/month (all channels, daily content and trend creatives in 24h, unlimited campaigns, influencer and WhatsApp automation, weekly strategy call).
Prices exclude 18% GST and ad spend (paid directly to Google/Meta). Website design and branding are quoted per project. SEO plans need a 3-month initial commitment; ads and social are month to month.`;
