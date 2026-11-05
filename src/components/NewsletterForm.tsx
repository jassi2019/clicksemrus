"use client";
import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not subscribe.");
      setState("done");
      setMsg("You're in. First issue lands within two weeks.");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Could not subscribe.");
    }
  }

  if (state === "done")
    return <p className="text-sm text-lime inline-flex items-center gap-2" role="status"><CheckCircle2 size={16} /> {msg}</p>;

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap gap-2 max-w-sm">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="input !py-2.5 text-sm flex-1 min-w-0"
        aria-label="Email address"
        autoComplete="email"
      />
      <button disabled={state === "loading"} className="btn btn-primary !py-2.5 !px-4 text-sm shrink-0 disabled:opacity-60" aria-label="Subscribe">
        {state === "loading" ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
      </button>
      {state === "error" && <p className="text-xs text-accent basis-full" role="alert">{msg}</p>}
    </form>
  );
}
