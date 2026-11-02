import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/Logo";

export default function Login() {
  return (
    <div className="min-h-[80vh] grid place-items-center">
      <div className="card p-8 w-full max-w-sm">
        <Logo />
        <h1 className="font-display text-2xl font-bold mt-6">Admin login</h1>
        <p className="text-muted text-sm mt-1 mb-6">Manage posts, leads, settings and the trending engine.</p>
        <Suspense><LoginForm /></Suspense>
      </div>
    </div>
  );
}
