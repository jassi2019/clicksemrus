import { slugify } from "./markdown";
import { db } from "./db";
import type { Post } from "./posts";
import { SITE } from "./site";
import { writeWithClaude } from "./ai";
import { hasAiWriter } from "./llm";

export type Trend = {
  title: string;
  traffic: string;
  picture?: string;
  pictureSource?: string;
  pubDate: string;
  news: { title: string; url: string; source: string; snippet?: string }[];
};

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1].trim()) : "";
};
const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");

/** Fetch Google Trends "Daily Search Trends" RSS for a country (default India). Cached 1 hour. */
export async function fetchTrends(geo = "IN"): Promise<Trend[]> {
  try {
    const res = await fetch(`https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; ClickSemrusBot/1.0)" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.split("<item>").slice(1);
    return items
      .map((it) => {
        const news = it
          .split("<ht:news_item>")
          .slice(1)
          .map((n) => ({
            title: tag(n, "ht:news_item_title"),
            url: tag(n, "ht:news_item_url"),
            source: tag(n, "ht:news_item_source"),
            snippet: tag(n, "ht:news_item_snippet"),
          }))
          .filter((n) => n.title && n.url);
        return {
          title: tag(it, "title"),
          traffic: tag(it, "ht:approx_traffic"),
          picture: tag(it, "ht:picture") || undefined,
          pictureSource: tag(it, "ht:picture_source") || undefined,
          pubDate: tag(it, "pubDate"),
          news,
        } as Trend;
      })
      .filter((t) => t.title && /^[\x20-\x7E]+$/.test(t.title) && t.news.length > 0);
  } catch {
    return [];
  }
}

export function classify(t: Trend): { category: string; kind: string } {
  const text = (t.title + " " + t.news.map((n) => n.title).join(" ")).toLowerCase();
  const has = (...w: string[]) => w.some((x) => text.includes(x));
  if (has("bigg boss", "kbc", "episode", "season", "web series", "ott", "trailer", "box office", "movie", "film", "serial", "show", "netflix", "prime video", "jiocinema", "hotstar", "actor", "actress", "song"))
    return { category: "Entertainment Marketing", kind: "show" };
  if (has("vs", "match", "cricket", "ipl", "t20", "odi", "test", "football", "kabaddi", "tennis", "world cup", "score", "wicket", "goal"))
    return { category: "Trending", kind: "sport" };
  if (has("share price", "ipo", "stock", "sensex", "nifty", "rbi", "gst", "budget", "quarter", "results", "gold rate", "silver rate"))
    return { category: "Trending", kind: "business" };
  if (has("iphone", "android", "launch", "ai ", "chatgpt", "google", "samsung", "oneplus", "app", "update", "openai"))
    return { category: "Trending", kind: "tech" };
  if (has("exam", "result", "admit card", "answer key", "recruitment", "vacancy", "board"))
    return { category: "Trending", kind: "exam" };
  return { category: "Trending", kind: "general" };
}

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

/** Template-based article that reflects a live trend, with outbound links and marketing angle. */
export function composeTrendPost(t: Trend, date = new Date()): Post {
  const { category, kind } = classify(t);
  const topic = titleCase(t.title.trim());
  const day = date.toISOString().slice(0, 10);
  const slug = slugify(`${t.title}-trending-${day}`);
  const sources = t.news.slice(0, 4);
  const headlines = sources.map((n) => `- [${n.title}](${n.url}) via ${n.source}`).join("\n");

  const angle: Record<string, { hook: string; ideas: string[]; title: string }> = {
    show: {
      title: `${topic} Is Trending: How Brands Can Ride the Buzz (Marketing Playbook)`,
      hook: `Everyone is talking about **${topic}** right now. Shows and releases like this dominate Instagram reels, X timelines and WhatsApp groups for days, and that attention is a free media opportunity for brands that move fast.`,
      ideas: [
        `**Moment marketing creatives:** Design a topical static or reel referencing ${topic} within 24 hours. Keep it witty, keep it brand-safe, and avoid using copyrighted footage or logos.`,
        `**Reels with trending audio:** Pair the dialogue or soundtrack trend with your product in a 7 to 15 second hook-first reel.`,
        `**Meme-style ads:** Run a small Meta Ads test using the meme format with a strong CTA. Trending formats often get 20 to 40% cheaper CPMs because engagement is high.`,
        `**Live-tweet / live-post:** If the show is airing on a schedule, schedule posts around episode drops and use the trending hashtags.`,
        `**Influencer tie-ups:** Partner with creators who are already reacting to ${topic}. Their audience is primed for the reference.`,
      ],
    },
    sport: {
      title: `${topic}: Why It Is Trending and 5 Moment-Marketing Ideas for Brands`,
      hook: `Sports moments like **${topic}** create instant mass attention across India. Searches spike, social feeds flood with reactions, and brands that respond in real time earn reach that would otherwise cost lakhs in ads.`,
      ideas: [
        `**Real-time reaction posts:** Congratulate, commiserate or joke within minutes of the result. Speed beats polish.`,
        `**Score-based offers:** Run a flash offer tied to the outcome, for example a discount equal to the winning margin.`,
        `**Match-day Google Ads:** Bid on related informational keywords with a relevant landing page if your product fits the audience.`,
        `**Fan-poll stories:** Instagram polls and quizzes around ${topic} drive engagement that feeds the algorithm for your next product post.`,
        `**Sponsor local screenings or fantasy leagues:** Community-level activation converts far better than generic ads.`,
      ],
    },
    business: {
      title: `${topic} Is Trending Today: What It Means for Marketers and Business Owners`,
      hook: `Business and finance topics like **${topic}** trend when people are looking for answers. That makes them ideal for authority content: explainers, calculators and expert takes that rank fast and build trust.`,
      ideas: [
        `**Publish an explainer within hours:** A clear, well-structured article on ${topic} can rank on Google Discover and News while the search volume is peaking.`,
        `**LinkedIn thought leadership:** Share a founder point of view on how ${topic} affects your industry.`,
        `**Email newsletter edition:** Turn the explainer into a short newsletter to re-engage your list.`,
        `**Search ads on informational queries:** Capture high-intent traffic with a lead magnet tied to the topic.`,
        `**Webinar or live session:** Invite an expert and collect leads through registration.`,
      ],
    },
    tech: {
      title: `${topic} Is Trending: Marketing Lessons and Ideas for Brands`,
      hook: `Tech launches and updates like **${topic}** generate enormous curiosity. Comparison searches, unboxing reels and feature explainers all spike, and brands in adjacent categories can borrow that attention.`,
      ideas: [
        `**Comparison and explainer content:** Answer the questions people are searching right now and interlink to your product pages.`,
        `**Reels reacting to the launch:** Short, opinionated reaction videos are being pushed by the Instagram algorithm this week.`,
        `**Bundle or accessory offers:** If you sell complementary products, launch a tie-in promotion.`,
        `**Retarget launch-day visitors:** Build a custom audience from readers of your explainer and retarget with Meta Ads.`,
        `**Newsjack on LinkedIn:** Share your expert take while the topic is hot.`,
      ],
    },
    exam: {
      title: `${topic} Is Trending: How EdTech and Local Businesses Can Engage Students Right Now`,
      hook: `Education topics like **${topic}** bring millions of students and parents online at once. Coaching institutes, EdTech brands and even cafes near campuses can create timely, helpful content that converts.`,
      ideas: [
        `**Helpful guides and checklists:** Publish step-by-step pages that answer the exact query. Helpful content earns links and shares.`,
        `**WhatsApp broadcast alerts:** Offer instant updates on WhatsApp in exchange for a phone number, then nurture with your courses.`,
        `**Google Ads on exact-match queries:** Students search specific phrases; match them with a dedicated landing page.`,
        `**Student-only offers:** A verified-student discount drives word of mouth in college groups.`,
        `**YouTube Shorts explainers:** Teachers reacting to ${topic} build subscriber bases fast.`,
      ],
    },
    general: {
      title: `Why ${topic} Is Trending Today and How Brands Can Join the Conversation`,
      hook: `**${topic}** is one of the top searches in India right now. Trends like this are short windows of massive attention, and smart brands use them to earn reach, engagement and sales without a big budget.`,
      ideas: [
        `**Moment marketing creative:** Post a relevant, respectful take within 24 hours.`,
        `**Trending hashtags and audio:** Use them on reels and shorts to ride the discovery wave.`,
        `**Quick SEO article:** Publish an explainer targeting the questions people are asking about ${topic}.`,
        `**Community engagement:** Reply to top comments and threads where your audience is discussing the topic.`,
        `**Small paid boost:** Put a small Meta Ads budget behind your best-performing topical post.`,
      ],
    },
  };
  const a = angle[kind];

  const content = `${a.hook}

According to Google Trends, **"${t.title}"** has crossed **${t.traffic || "thousands of"} searches** in India today (${date.toDateString()}). Here is what is driving it, and a practical playbook for marketers.

## What is happening with ${topic}?

These are the top news stories behind the spike:

${headlines}

Read those for the full story. Below, we focus on the marketing side: how a business in Delhi NCR or anywhere in India can turn this attention into growth.

## Why trending topics matter for marketing

- **Cheap reach.** Social platforms push content that matches what people are already talking about. Topical posts regularly see 2 to 5x the organic reach of regular posts.
- **Search demand you did not have to create.** Thousands of people are typing "${t.title}" into Google right now. Relevant content captures that demand.
- **Brand recall.** A clever, timely take makes your brand memorable in a way that product posts rarely do.

## 5 moment-marketing ideas for ${topic}

${a.ideas.map((i, n) => `${n + 1}. ${i}`).join("\n")}

## Moment marketing rules (so it does not backfire)

- **Be fast but brand-safe.** Avoid anything political, tragic or divisive.
- **Respect copyright.** Do not reuse official footage, posters or logos. Create your own creative inspired by the moment.
- **Add value or humour.** A forced tie-in feels like spam; a genuinely useful or funny post gets shared.
- **Track everything.** Use UTM links and a dedicated landing page so you know what the trend actually delivered.

## How ClickSemrus helps brands win trending moments

Our team watches Google Trends, Instagram and X daily and ships topical creatives, reels and SEO content within hours. Combined with social media marketing, Meta Ads and SEO, this turns short bursts of attention into long-term growth.

Want a moment-marketing calendar for your brand? [Talk to us](/contact) or explore our [digital marketing services](/services).

## FAQs

**Is moment marketing only for big brands?**
No. Small businesses often win because they can move faster. A single well-timed reel can out-perform a month of regular posts.

**How quickly should we post about ${topic}?**
Within 24 hours. Most trends peak in one to two days.

**Can trending content help SEO?**
Yes. Timely articles get picked up by Google Discover and News, and the links and engagement they earn improve your overall domain authority.
`;

  return {
    slug,
    title: a.title,
    excerpt: `${topic} is trending in India today. Here is why, plus a practical moment-marketing playbook with ideas brands can use within 24 hours.`,
    content,
    category,
    tags: ["trending", "moment marketing", kind, t.title.toLowerCase()],
    cover: t.picture,
    coverCredit: t.pictureSource,
    status: "published",
    publishedAt: date.toISOString(),
    updatedAt: date.toISOString(),
    author: `${SITE.name} Editorial`,
    seoTitle: a.title.length > 60 ? `${topic} Trending: Marketing Ideas | ${SITE.name}` : `${a.title} | ${SITE.name}`,
    seoDescription: `${topic} is trending on Google India (${t.traffic} searches). Why it is trending, top news, and 5 moment-marketing ideas for brands.`,
    source: "trend",
    trendTopic: t.title,
    trendTraffic: t.traffic,
    outbound: sources.map((s) => ({ title: s.title, url: s.url, source: s.source })),
  };
}

/** Build a post for a trend, using Claude when an API key is present, else the template. */
export async function buildTrendPost(t: Trend, date = new Date()): Promise<Post> {
  const base = composeTrendPost(t, date);
  if (!hasAiWriter()) return base;
  try {
    const ai = await writeWithClaude(t, base);
    if (!ai.content) throw new Error("empty AI response");
    return { ...base, ...ai };
  } catch (e) {
    console.error("trend post AI failed:", (e as Error).message);
    try { await db.set("ai:lastError", { at: new Date().toISOString(), kind: "trend", message: (e as Error).message.slice(0, 500) }); } catch {}
    return base;
  }
}

/** Live trend posts (no database needed). Deterministic slugs per day so URLs are stable within a day. */
export async function liveTrendPosts(geo = "IN", limit = 6): Promise<Post[]> {
  const trends = await fetchTrends(geo);
  const date = new Date();
  return trends.slice(0, limit).map((t) => composeTrendPost(t, date));
}
