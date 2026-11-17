import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

/** Keyword -> internal URL map used for automatic interlinking of blog content. */
const LINK_MAP: [RegExp, string][] = [
  [/\b(SEO|search engine optimi[sz]ation)\b/, "/services/seo"],
  [/\b(social media marketing|social media)\b/i, "/services/social-media-marketing"],
  [/\b(Google Ads|PPC|pay-per-click)\b/, "/services/google-ads-ppc"],
  [/\b(Meta Ads|Facebook Ads|Instagram Ads)\b/i, "/services/meta-ads"],
  [/\b(content marketing)\b/i, "/services/content-marketing"],
  [/\b(website design|web design|web development|landing page)\b/i, "/services/web-design-development"],
  [/\b(influencer marketing|influencers?|creators?)\b/i, "/services/influencer-marketing"],
  [/\b(WhatsApp marketing|email marketing|WhatsApp)\b/i, "/services/whatsapp-email-marketing"],
  [/\b(branding|brand identity)\b/i, "/services/branding-creative"],
  [/\b(digital marketing agency)\b/i, "/"],
  [/\b(pricing|packages)\b/i, "/pricing"],
];

/** Link the first occurrence of each keyword (outside headings/links/code) to the matching internal page. */
export function autoInterlink(md: string): string {
  const used = new Set<string>();
  return md
    .split("\n")
    .map((line) => {
      if (/^\s*(#|```|>|\||!\[|<)/.test(line) || line.includes("](")) return line;
      for (const [re, href] of LINK_MAP) {
        if (used.has(href)) continue;
        const m = line.match(re);
        if (m && m.index !== undefined) {
          line = line.slice(0, m.index) + `[${m[0]}](${href})` + line.slice(m.index + m[0].length);
          used.add(href);
        }
      }
      return line;
    })
    .join("\n");
}

/**
 * Safely link verbatim mentions of other blog posts' topics to those posts (blog-to-blog internal links).
 * Only the first occurrence of each phrase is linked, only outside headings/links/images/code, and only
 * when the phrase is distinctive (>= 14 chars, multi-word). At most `max` links are added. Never alters
 * markdown syntax characters, so it cannot break rendering.
 */
export function interlinkPosts(
  md: string,
  candidates: { slug: string; title: string; trendTopic?: string }[],
  max = 2
): string {
  const phrases = candidates
    .map((c) => ({ slug: c.slug, phrase: (c.trendTopic || c.title.split(":")[0]).trim() }))
    .filter((c) => c.phrase.length >= 14 && c.phrase.includes(" ") && !/[\[\]()]/.test(c.phrase))
    .sort((a, b) => b.phrase.length - a.phrase.length);
  if (!phrases.length) return md;
  const usedSlug = new Set<string>();
  let added = 0;
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return md
    .split("\n")
    .map((line) => {
      if (added >= max) return line;
      if (/^\s*(#|```|>|\||!\[|<)/.test(line) || line.includes("](")) return line;
      for (const { slug, phrase } of phrases) {
        if (added >= max || usedSlug.has(slug)) continue;
        const re = new RegExp(`(?<![\\w\\[])(${esc(phrase)})(?![\\w\\]])`, "i");
        const m = line.match(re);
        if (m && m.index !== undefined) {
          line = line.slice(0, m.index) + `[${m[0]}](/blog/${slug})` + line.slice(m.index + m[0].length);
          usedSlug.add(slug);
          added++;
        }
      }
      return line;
    })
    .join("\n");
}

export function renderMarkdown(md: string): string {
  const withIds = md.replace(/^##\s+(.+)$/gm, (_, t: string) => `## <a id="${slugify(t)}"></a>${t}`);
  let html = marked.parse(autoInterlink(withIds)) as string;
  html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  // Lazy-load and decode in-article images.
  html = html.replace(/<img /g, '<img loading="lazy" decoding="async" ');
  // Wrap an image paragraph (optionally followed by an italic caption paragraph) in a <figure>.
  html = html.replace(
    /<p>(<img [^>]*>)<\/p>\s*<p><em>([\s\S]*?)<\/em><\/p>/g,
    '<figure>$1<figcaption>$2</figcaption></figure>'
  );
  html = html.replace(/<p>(<img [^>]*>)<\/p>/g, "<figure>$1</figure>");
  return html;
}

export function extractHeadings(md: string) {
  return md
    .split("\n")
    .filter((l) => /^##\s/.test(l))
    .map((l) => {
      const text = l.replace(/^##\s+/, "").trim();
      return { text, id: slugify(text) };
    });
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function readingTime(md: string) {
  return Math.max(1, Math.round(md.split(/\s+/).length / 200));
}

export function stripMd(md: string) {
  return md.replace(/[#*_`>\[\]()!]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Parse the "## FAQ" / "## FAQs" section of an article into Q/A pairs for FAQPage JSON-LD.
 * Supports two common shapes the writers produce:
 *   - **Question?**\n Answer.
 *   - ### Question?\n Answer.
 * Returns [] when no FAQ section or fewer than one pair is found.
 */
export function parseFaq(md: string): { q: string; a: string }[] {
  const m = md.match(/(?:^|\n)##\s+FAQs?\b[^\n]*\n([\s\S]*?)(?=\n##\s|$(?![\s\S]))/i);
  if (!m) return [];
  const lines = m[1].split("\n");
  const out: { q: string; a: string }[] = [];
  // A question is a line that is a bold (**…**) or ### heading and ends with "?".
  const isQ = (l: string) => /^\s*(?:###\s+.+|\*\*.+\*\*)\s*$/.test(l) && /\?\s*$/.test(stripMd(l));
  let i = 0;
  while (i < lines.length) {
    if (isQ(lines[i])) {
      const q = stripMd(lines[i]).trim();
      const ans: string[] = [];
      i++;
      while (i < lines.length && !isQ(lines[i])) {
        if (lines[i].trim()) ans.push(lines[i].trim());
        i++;
      }
      const a = stripMd(ans.join(" ")).trim();
      if (q.length > 4 && a.length > 4) out.push({ q, a });
    } else {
      i++;
    }
  }
  return out;
}
