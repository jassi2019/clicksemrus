import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { digits, whatsappStatus } from "@/lib/whatsapp";
import SettingsForm from "@/components/admin/SettingsForm";
import WhatsAppTest from "@/components/admin/WhatsAppTest";

export const dynamic = "force-dynamic";

export default async function SettingsAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const settings = await getSettings();
  const wa = whatsappStatus();
  const owner = digits(settings.ownerWhatsapp) || digits(process.env.OWNER_WHATSAPP) || digits(settings.whatsapp) || digits(SITE.whatsapp);
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted text-sm">Tracking IDs, contact details, WhatsApp alerts and the trending engine.</p>
      </div>
      <div className="card p-5 space-y-3 !transform-none">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-semibold">WhatsApp notifications</h2>
          <span className={`badge ${wa.provider === "none" ? "bg-surface-2 text-muted" : "bg-lime text-[#0b0b14]"}`}>{wa.label}</span>
        </div>
        <p className="text-sm text-muted">{wa.detail}</p>
        <p className="text-sm">Owner alerts go to <strong>+{owner}</strong>{wa.thankYouTemplate ? <>; lead thank-you uses template <code className="text-xs bg-surface-2 px-1.5 py-0.5 rounded">{wa.thankYouTemplate}</code></> : wa.provider === "cloud" ? "; lead thank-you is plain text (only delivered inside a 24h window, set WA_THANKYOU_TEMPLATE for an approved template)" : ""}.</p>
        <WhatsAppTest disabled={wa.provider === "none"} />
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
