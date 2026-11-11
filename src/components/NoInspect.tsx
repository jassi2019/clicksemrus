"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Casual-copy deterrents on public pages: no context menu, no image drag, and the common
 * DevTools / view-source shortcuts are swallowed. This cannot stop a determined user
 * (browser menus and the network tab still work); it only removes the easy paths.
 * Disabled on /admin so the owner can debug.
 */
export default function NoInspect() {
  const path = usePathname();
  useEffect(() => {
    if (path?.startsWith("/admin")) return;
    if (process.env.NODE_ENV !== "production") return;
    const onContext = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, [contenteditable='true']")) return; // keep paste menus on form fields
      e.preventDefault();
    };
    const onDrag = (e: DragEvent) => { if ((e.target as HTMLElement | null)?.tagName === "IMG") e.preventDefault(); };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      const combo = (e.ctrlKey || e.metaKey) && e.shiftKey && ["I", "J", "C", "K"].includes(k);
      const viewSource = (e.ctrlKey || e.metaKey) && !e.shiftKey && ["U", "S"].includes(k);
      if (e.key === "F12" || combo || viewSource) { e.preventDefault(); e.stopPropagation(); }
    };
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("dragstart", onDrag);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("dragstart", onDrag);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [path]);
  return null;
}
