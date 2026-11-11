import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedLayout } from "@/lib/builderStore";
import { faqsFromBlocks, isTakeoverSlug } from "@/lib/builder";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import BlockRenderer from "@/components/builder/BlockRenderer";
import JsonLd from "@/components/JsonLd";

/**
 * Custom pages built in Admin → Page builder. Published layouts only; drafts are previewed at /p/preview/[slug].
 * ISR: re-rendered at most once a minute, and immediately after publish via revalidatePath.
 */
export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const layout = await getPublishedLayout(slug);
  if (!layout || isTakeoverSlug(slug)) return { title: "Page not found", robots: { index: false, follow: false } };
  return pageMeta({ title: layout.seoTitle || layout.title, description: layout.seoDescription || `${layout.title}. Digital marketing in Delhi NCR.`, path: `/p/${slug}` });
}

export default async function BuilderPage({ params }: Params) {
  const { slug } = await params;
  // Take-over slugs (home, about, ...) live on their real routes, never under /p/.
  if (isTakeoverSlug(slug)) notFound();
  const layout = await getPublishedLayout(slug);
  if (!layout) notFound();
  const faqs = faqsFromBlocks(layout.blocks);
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Home", path: "" }, { name: layout.title, path: `/p/${slug}` }]), ...(faqs.length ? [faqJsonLd(faqs)] : [])]} />
      <BlockRenderer blocks={layout.blocks} />
    </>
  );
}
