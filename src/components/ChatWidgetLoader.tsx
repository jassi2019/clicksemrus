"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

/** Mounts the chat widget after the first user interaction or 4s, whichever comes first. Hidden on /admin. */
export default function ChatWidgetLoader({ enabled }: { enabled: boolean }) {
  const path = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll", "touchstart"];
    const arm = () => setReady(true);
    const t = setTimeout(arm, 4000);
    events.forEach((e) => window.addEventListener(e, arm, { once: true, passive: true }));
    return () => {
      clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
  }, []);

  if (!ready || path?.startsWith("/admin")) return null;
  return <ChatWidget enabled={enabled} />;
}
