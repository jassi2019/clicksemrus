import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listLayouts } from "@/lib/builderStore";
import BuilderList from "@/components/admin/builder/BuilderList";

export const dynamic = "force-dynamic";

export default async function BuilderAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const layouts = await listLayouts();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Page builder</h1>
        <p className="text-muted text-sm">Build whole pages from blocks, in the site&apos;s own design. Take over an existing page or create a new one under /p/your-slug. Nothing changes on the live site until you publish.</p>
      </div>
      <BuilderList layouts={layouts} />
    </div>
  );
}
