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

export function renderMarkdown(md: string): string {
  const withIds = md.replace(/^##\s+(.+)$/gm, (_, t: string) => `## <a id="${slugify(t)}"></a>${t}`);
  const html = marked.parse(autoInterlink(withIds)) as string;
  return html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
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
