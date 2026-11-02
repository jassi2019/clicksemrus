"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
    setLoading(false);
    if (res.ok) router.push(sp.get("next") || "/admin");
    else setErr("Wrong password");
  }
  return (
    <form onSubmit={submit} className="grid gap-3">
      <input type="password" className="input" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
      {err && <p className="text-accent text-sm">{err}</p>}
      <button className="btn btn-primary" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
