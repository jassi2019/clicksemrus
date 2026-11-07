import { notFound } from "next/navigation";
import { ALL_SUB_SERVICES, SITE, findSubService } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const revalidate = 3600;

export function generateStaticParams() {
  return ALL_SUB_SERVICES.map((x) => ({ category: x.category.slug, slug: x.service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const hit = findSubService(slug, category);
  if (!hit) return {};
  return pageMeta({
    title: `${hit.service.name} in Delhi NCR | ${SITE.name}`,
    description: `${hit.service.headline}. ${hit.service.description}`.slice(0, 158),
    path: `/services/${hit.category.slug}/${hit.service.slug}`,
    keywords: hit.service.keywords,
  });
}

export default async function SubServicePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const hit = findSubService(slug, category);
  if (!hit) notFound();
  return <ServicePageTemplate s={hit.service} category={hit.category} path={`/services/${hit.category.slug}/${hit.service.slug}`} />;
}
