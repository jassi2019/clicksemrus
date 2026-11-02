import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: "Admin | ClickSemrus", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-2">
      <AdminNav />
      <div className="md:pl-60">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">{children}</div>
      </div>
    </div>
  );
}
