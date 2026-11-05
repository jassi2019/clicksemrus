import { db } from "./db";

export type Review = {
  id: string;
  name: string;
  meta: string; // "Service • City"
  rating: number;
  relative: string; // "2 weeks ago"
  text: string;
  photo?: string;
};

export type ReviewData = {
  rating: number;
  total: number;
  reviews: Review[];
  source: "google" | "seed";
  fetchedAt?: string;
};

export const REVIEWS_KEY = "reviews:google";

export const SEED_REVIEWS: Review[] = [
  { id: "s1", name: "Rohit Sharma", meta: "Meta Ads • Gurugram", rating: 5, relative: "2 weeks ago", text: "Our Meta Ads ROAS went from 1.4 to 3.8 in two months. The weekly creative testing is the real difference. Team is very responsive on WhatsApp." },
  { id: "s2", name: "Dr. Neha Kapoor", meta: "Local SEO • South Delhi", rating: 5, relative: "a month ago", text: "Clinic ab Google Maps pe top 3 mein aata hai. 60 se 80 calls har mahine sirf Maps se. Reporting bilkul clear hai." },
  { id: "s3", name: "Amit Verma", meta: "Google Ads • Noida", rating: 5, relative: "3 weeks ago", text: "First agency that actually showed us cost per site visit instead of cost per lead. Transparent and quick to act on feedback." },
  { id: "s4", name: "Priya Malhotra", meta: "Social Media • Delhi", rating: 5, relative: "a month ago", text: "Reels quality is excellent and they post trend content within a day. Followers grew steadily and enquiries started coming through DMs." },
  { id: "s5", name: "Sandeep Gill", meta: "Website • Faridabad", rating: 5, relative: "2 months ago", text: "Website 3 weeks mein live ho gayi, speed score 95+. Landing page se leads aane lage pehle hafte mein hi." },
  { id: "s6", name: "Kavita Arora", meta: "SEO • Ghaziabad", rating: 5, relative: "2 months ago", text: "Honest about timelines from day one. Organic traffic doubled in about five months and the monthly report is easy to understand." },
  { id: "s7", name: "Mohit Bansal", meta: "WhatsApp Marketing • Gurugram", rating: 5, relative: "3 months ago", text: "The WhatsApp automation recovers carts we were losing every day. Setup was fast and the flows are well written." },
  { id: "s8", name: "Farah Siddiqui", meta: "Branding • Delhi", rating: 5, relative: "3 months ago", text: "Loved the new identity and the ad creative system. Everything from Instagram grid to packaging feels consistent now." },
  { id: "s9", name: "Vikram Chauhan", meta: "Real Estate Ads • Noida", rating: 5, relative: "4 months ago", text: "Lead quality improved a lot after they added qualifying questions. Site visits badh gaye aur junk leads kam ho gayi." },
  { id: "s10", name: "Anjali Mehta", meta: "Influencer Marketing • Delhi", rating: 5, relative: "4 months ago", text: "They handled creators, briefs and tracking end to end. We finally know which influencer actually drove sales." },
  { id: "s11", name: "Rajesh Khanna", meta: "Google Ads • Delhi", rating: 5, relative: "5 months ago", text: "Account restructure brought CPC down and quality score up within a month. Weekly calls are short and useful." },
  { id: "s12", name: "Simran Kaur", meta: "Social Media • Gurugram", rating: 5, relative: "6 months ago", text: "Cafe ke liye Instagram aur Google Maps dono sambhal rahe hain. Weekend bookings noticeably up. Highly recommended." },
];

export const SEED_REVIEW_DATA: ReviewData = {
  rating: 5,
  total: SEED_REVIEWS.length,
  reviews: SEED_REVIEWS,
  source: "seed",
};

/** Cached Google reviews from Redis, else the seed set. Never throws. */
export async function getReviews(): Promise<ReviewData> {
  try {
    const cached = await db.get<ReviewData>(REVIEWS_KEY);
    if (cached && Array.isArray(cached.reviews) && cached.reviews.length > 0) return { ...cached, source: "google" };
  } catch {}
  return SEED_REVIEW_DATA;
}
