import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/posts";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const settings = await getSettings();
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted text-sm">Tracking IDs, contact details and the trending engine.</p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
