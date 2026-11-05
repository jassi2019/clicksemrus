import type { Metadata } from "next";
import { SITE, SERVICE_CATEGORIES, type Location } from "./site";
import type { Post } from "./posts";

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
  noindex?: boolean;
}): Metadata {
  const url = `${SITE.url}${opts.path}`;
  const image = opts.image || `${SITE.url}/opengraph-image`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: opts.type || "website",
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [image], site: SITE.twitterHandle },
  };
}

export const orgJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/icon.svg`,
  image: `${SITE.url}/opengraph-image`,
  description: SITE.description,
  email: SITE.email,
  telephone: SITE.phone,
  foundingDate: String(SITE.foundingYear),
  address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressRegion: "Delhi", addressCountry: "IN" },
  areaServed: ["Delhi", "Gurugram", "Noida", "Faridabad", "Ghaziabad", "India"],
  sameAs: [SITE.instagram],
  priceRange: "₹₹",
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "19:00" }],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Digital Marketing Services",
    itemListElement: SERVICE_CATEGORIES.map((c) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: c.name, url: `${SITE.url}/services/${c.slug}` } })),
  },
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  publisher: { "@id": `${SITE.url}/#organization` },
  potentialAction: { "@type": "SearchAction", target: `${SITE.url}/blog?q={search_term_string}`, "query-input": "required name=search_term_string" },
});

export const reviewJsonLd = (data: { rating: number; total: number; reviews: { name: string; rating: number; text: string }[] }) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  aggregateRating: { "@type": "AggregateRating", ratingValue: data.rating, reviewCount: data.total, bestRating: 5, worstRating: 1 },
  review: data.reviews.slice(0, 5).map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    reviewBody: r.text,
  })),
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE.url}${it.path}` })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const serviceJsonLd = (s: { name: string; description: string; slug: string }, path?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: s.name,
  description: s.description,
  serviceType: s.name,
  provider: { "@id": `${SITE.url}/#organization` },
  areaServed: "Delhi NCR, India",
  url: `${SITE.url}${path || `/services/${s.slug}`}`,
});

export const localBusinessJsonLd = (loc: Location) => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${SITE.url}/locations/${loc.slug}#business`,
  name: `${SITE.name} - ${loc.name}`,
  url: `${SITE.url}/locations/${loc.slug}`,
  parentOrganization: { "@id": `${SITE.url}/#organization` },
  description: loc.intro,
  email: SITE.email,
  telephone: SITE.phone,
  areaServed: [{ "@type": "City", name: loc.name }, ...loc.areas.map((a) => ({ "@type": "Place", name: `${a}, ${loc.name}` }))],
  address: { "@type": "PostalAddress", addressLocality: loc.name, addressRegion: "Delhi NCR", addressCountry: "IN" },
  priceRange: "₹₹",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `Digital Marketing Services in ${loc.name}`,
    itemListElement: SERVICE_CATEGORIES.map((c) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: `${c.name} in ${loc.name}`, url: `${SITE.url}/services/${c.slug}` } })),
  },
});

export const articleJsonLd = (p: Post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: p.title,
  description: p.excerpt,
  image: p.cover ? [p.cover] : [`${SITE.url}/opengraph-image`],
  datePublished: p.publishedAt,
  dateModified: p.updatedAt,
  author: { "@type": "Organization", name: p.author, url: SITE.url },
  publisher: { "@id": `${SITE.url}/#organization` },
  mainEntityOfPage: `${SITE.url}/blog/${p.slug}`,
  keywords: p.tags.join(", "),
  articleSection: p.category,
  ...(p.outbound?.length ? { citation: p.outbound.map((o) => o.url) } : {}),
});
