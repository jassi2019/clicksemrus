import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getLayout } from "@/lib/builderStore";
import BuilderEditor from "@/components/admin/builder/BuilderEditor";

export const dynamic = "force-dynamic";

export default async function BuilderEdit({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;
  const layout = await getLayout(slug);
  if (!layout) notFound();
  return <BuilderEditor initial={layout} />;
}
