import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getVisitorOverview } from "@/lib/visitors";
import VisitorsPanel from "@/components/admin/VisitorsPanel";

export const dynamic = "force-dynamic";

export default async function VisitorsAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const data = await getVisitorOverview();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Visitors</h1>
        <p className="text-muted text-sm">Live sessions from the first-party tracker. Refreshes every 20 seconds.</p>
      </div>
      <VisitorsPanel initial={data} />
    </div>
  );
}
