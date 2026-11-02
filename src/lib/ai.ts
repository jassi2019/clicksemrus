import Anthropic from "@anthropic-ai/sdk";
import type { Post } from "./posts";
import type { Trend } from "./trending";
import { SITE } from "./site";

/**
 * Optional: richer trend articles written by Claude.
 * Only used when ANTHROPIC_API_KEY is set; otherwise the template writer in trending.ts is used.
 */
export async function writeWithClaude(t: Trend, base: Post): Promise<Partial<Post>> {
  const client = new Anthropic();
  const sources = t.news
    .slice(0, 4)
    .map((n) => `- ${n.title} (${n.source}) ${n.url}`)
    .join("\n");

  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium" },
    system: `You are the senior content writer at ${SITE.name}, a digital marketing agency in ${SITE.city}, India. Write SEO blog posts in clear Indian English for business owners and marketers. Use markdown with ## headings. Never fabricate facts about the news; only use the provided sources. Mention the agency's services naturally (SEO, social media marketing, Meta Ads, Google Ads, content marketing, web design) without being spammy. Include a short FAQ section at the end. Do not include a top-level H1.`,
    messages: [
      {
        role: "user",
        content: `Topic trending on Google India today: "${t.title}" (${t.traffic} searches).
Sources:
${sources}

Write a 900-1200 word blog post that (1) explains why it is trending using the sources with markdown links to them, (2) gives 5 concrete moment-marketing ideas brands can act on within 24 hours, (3) includes rules for brand-safe trend-jacking, (4) ends with a FAQ of 3 questions and a call to action to contact ${SITE.name}.
Return JSON only with keys: title (max 65 chars), excerpt (max 160 chars), seoTitle (max 60), seoDescription (max 155), content (markdown).`,
      },
    ],
  });

  if (response.stop_reason === "refusal") return {};
  const text = response.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  const parsed = JSON.parse(json) as Partial<Post>;
  return {
    title: parsed.title,
    excerpt: parsed.excerpt,
    seoTitle: parsed.seoTitle,
    seoDescription: parsed.seoDescription,
    content: parsed.content,
  };
}
