import { SITE } from "./site";
import type { Post } from "./posts";

export type Author = {
  slug: string;
  name: string;
  role: string;
  /** 2-3 sentence credible bio. No fabricated certifications or client counts. */
  bio: string;
  /** Short one-liner used on cards and meta descriptions. */
  short: string;
  expertise: string[];
  /** Optional public profile link (LinkedIn/site). Omitted when none is verified. */
  link?: string;
};

/**
 * Editorial personas for E-E-A-T. These are the ClickSemrus editorial desks, written as credible
 * India digital-marketing voices. Avatars are initials-based (see initials()); no photos or fake
 * credentials are used.
 */
export const AUTHORS: Author[] = [
  {
    slug: "clicksemrus-editorial",
    name: "ClickSemrus Editorial Desk",
    role: "News & Trends Desk",
    bio: "The ClickSemrus Editorial Desk covers what India is searching for and turns it into clear, useful context for business owners and marketers. The desk tracks Google Trends India daily and publishes news explainers across sports, entertainment, business and technology.",
    short: "India news and trending-topic explainers, updated daily.",
    expertise: ["Trending topics", "News explainers", "Google Trends India", "Content strategy"],
    link: SITE.instagram,
  },
  {
    slug: "seo-research-team",
    name: "ClickSemrus SEO Research Team",
    role: "SEO & Growth Research",
    bio: "The SEO Research Team studies how Delhi NCR businesses win organic and local search, from Google Business Profile ranking to technical SEO and content clusters. They write the agency's evergreen guides on SEO, Google Ads and how to choose a marketing partner.",
    short: "Evergreen SEO, local search and paid-media guides for Indian businesses.",
    expertise: ["SEO", "Local SEO", "Google Ads", "Analytics", "Content clusters"],
    link: SITE.url,
  },
  {
    slug: "social-creative-studio",
    name: "ClickSemrus Social & Creative Studio",
    role: "Social Media & Creative",
    bio: "The Social & Creative Studio runs reels, creator collaborations and brand content for D2C, retail, clinic and food brands across Delhi NCR. They write about Instagram and short-form video strategy, influencer marketing and the creative that actually converts.",
    short: "Instagram, short-form video and creator-marketing playbooks.",
    expertise: ["Social media", "Reels", "Influencer marketing", "Branding", "Creative"],
    link: SITE.instagram,
  },
];

export const DEFAULT_AUTHOR = AUTHORS[1];

export function getAuthor(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug);
}

/** Two-letter initials for the avatar fallback. */
export function initials(name: string): string {
  const words = name.replace(/[^A-Za-z ]/g, "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "CS";
  const first = words[0][0];
  const second = words.length > 1 ? words[words.length - 1][0] : words[0][1] || "";
  return (first + second).toUpperCase();
}

const NEWS_CATEGORIES = new Set(["Trending", "Sports", "Entertainment", "Business", "Technology", "Education", "India News"]);
const SOCIAL_CATEGORIES = new Set(["Social Media", "Branding"]);

/** Stable hash so a post always maps to the same author. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Deterministically assign an editorial persona to a post by category (with a slug-hash tiebreak).
 * News/trend categories -> Editorial Desk; social/branding -> Social & Creative Studio;
 * SEO/ads/web/content -> SEO Research Team.
 */
export function authorFor(post: Pick<Post, "slug" | "category" | "source">): Author {
  if (post.source === "trend" || NEWS_CATEGORIES.has(post.category)) return AUTHORS[0];
  if (SOCIAL_CATEGORIES.has(post.category)) return AUTHORS[2];
  if (["SEO", "Paid Ads", "Content", "Web"].includes(post.category)) return AUTHORS[1];
  // Fallback: spread evenly but stably across the three desks.
  return AUTHORS[hash(post.slug) % AUTHORS.length];
}

/** Posts attributed to an author, newest first. */
export function postsByAuthor(all: Post[], slug: string): Post[] {
  return all
    .filter((p) => authorFor(p).slug === slug)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
