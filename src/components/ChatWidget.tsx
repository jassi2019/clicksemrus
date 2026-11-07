"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { trackEvent } from "./Tracker";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING = "Hi, I'm Semi from ClickSemrus. What are you trying to grow?";
const CHIPS: { label: string; prompt: string; href: string }[] = [
  { label: "Pricing", prompt: "What are your pricing packages?", href: "/pricing" },
  { label: "Free audit", prompt: "How does the free audit work?", href: "/contact" },
  { label: "SEO", prompt: "I want more organic traffic from Google.", href: "/services/seo" },
  { label: "Ads", prompt: "I want leads from Google or Meta ads.", href: "/services/paid-ads" },
  { label: "Social", prompt: "I need help with Instagram and social media.", href: "/services/social-media-marketing" },
  { label: "Website", prompt: "I need a new website or landing page.", href: "/services/web-design-development" },
];
const MAX_TURNS = 12;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/;
const NAME_RE = /(?:my name is|i am|i'm|this is)\s+([A-Za-z][A-Za-z .'-]{1,40})/i;

export default function ChatWidget({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const contact = useRef<{ name?: string; email?: string; phone?: string }>({});
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const userTurns = msgs.filter((m) => m.role === "user").length;
  const limitReached = userTurns >= MAX_TURNS;

  useEffect(() => {
    if (open) listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  async function maybeSendLead(text: string) {
    if (leadSent) return;
    const c = contact.current;
    const email = text.match(EMAIL_RE)?.[0];
    const phone = text.match(PHONE_RE)?.[0];
    const name = text.match(NAME_RE)?.[1];
    if (email) c.email = email;
    if (phone) c.phone = phone;
    if (name) c.name = name.trim();
    if (!c.email || !c.phone) return;
    setLeadSent(true);
    const transcript = msgs.map((m) => `${m.role === "user" ? "Visitor" : "Semi"}: ${m.content}`).join("\n").slice(-1500);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: c.name || "Chat visitor", email: c.email, phone: c.phone, source: "chat", page: window.location.pathname, message: `From chat:\n${transcript}\n${text}` }),
      });
      trackEvent("lead_submitted");
    } catch {}
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy || limitReached) return;
    setInput("");
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setBusy(true);
    void maybeSendLead(content);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m.content).slice(-MAX_TURNS * 2) }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "Something went wrong.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        const snapshot = acc;
        setMsgs((cur) => [...cur.slice(0, -1), { role: "assistant", content: snapshot }]);
      }
    } catch (err) {
      const message = err instanceof Error && err.name !== "AbortError" ? err.message : "Something went wrong.";
      setMsgs((cur) => [...cur.slice(0, -1), { role: "assistant", content: `${message} You can also WhatsApp us or use the contact form.` }]);
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function toggle() {
    setOpen((o) => !o);
    if (!open) trackEvent("chat_open");
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Close chat" : "Chat with Semi"}
        aria-expanded={open}
        className="fixed bottom-[8.5rem] md:bottom-[4.9rem] right-4 md:right-5 z-40 grid place-items-center w-12 h-12 rounded-full bg-[#0b0b14] text-white shadow-[0_10px_30px_-8px_rgba(11,11,20,.7)] hover:bg-brand hover:scale-105 transition"
      >
        {open ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat with ClickSemrus"
          className="fixed z-40 bottom-[12rem] md:bottom-[8.5rem] right-4 md:right-5 left-4 sm:left-auto sm:w-[360px] max-h-[min(70vh,560px)] card !transform-none flex flex-col overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-[#0b0b14] text-white">
            <span className="w-9 h-9 rounded-full bg-brand grid place-items-center font-bold">S</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-tight">Semi</p>
              <p className="text-[11px] text-white/60">ClickSemrus growth assistant</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1.5 rounded-full hover:bg-white/10"><X size={16} /></button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap leading-relaxed ${m.role === "user" ? "bg-brand text-white rounded-br-md" : "bg-surface-2 rounded-bl-md"}`}>
                  {m.content || (busy ? <Loader2 size={14} className="animate-spin" /> : "")}
                </div>
              </div>
            ))}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {CHIPS.map((c) =>
                  enabled ? (
                    <button key={c.label} type="button" onClick={() => send(c.prompt)} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-surface hover:bg-surface-2">{c.label}</button>
                  ) : (
                    <Link key={c.label} href={c.href} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-surface hover:bg-surface-2">{c.label}</Link>
                  )
                )}
              </div>
            )}
            {!enabled && msgs.length === 1 && <p className="text-xs text-muted">Pick a topic above, or <Link href="/contact" className="text-brand font-semibold">book a free call</Link>.</p>}
            {leadSent && <p className="text-xs text-lime">Got your details. A strategist will reach out within 2 business hours.</p>}
          </div>

          {enabled && (
            <form
              onSubmit={(e) => { e.preventDefault(); void send(input); }}
              className="p-3 border-t border-border flex gap-2 items-center"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={limitReached ? "Chat limit reached. WhatsApp us instead." : "Type your question"}
                disabled={busy || limitReached}
                maxLength={1500}
                className="input !py-2.5 text-sm flex-1 min-w-0"
                aria-label="Message"
              />
              <button disabled={busy || limitReached || !input.trim()} className="btn btn-primary !p-2.5 shrink-0 disabled:opacity-50" aria-label="Send">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
