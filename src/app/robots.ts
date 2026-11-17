import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "ClaudeBot", "Claude-Web", "anthropic-ai", "Bingbot", "CCBot", "Amazonbot", "Bytespider", "meta-externalagent"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
      // Explicitly welcome AI answer-engine crawlers so the content can be cited.
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/admin", "/api/"] })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
