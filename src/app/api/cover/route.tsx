import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Branded blog cover, rendered on the fly: /api/cover?t=Title&c=Category&k=trend|guide&s=slug
 * Deterministic for a given query, cached for a year at the edge. 1200x630, crisp at any size.
 */

const PALETTES = [
  ["#0b0b14", "#1a1340", "#4f46e5"],
  ["#0b0b14", "#0e2a3a", "#0ea5e9"],
  ["#120b14", "#3b1f6b", "#7c3aed"],
  ["#0b1410", "#0f3a2e", "#16a34a"],
  ["#14110b", "#4a2b05", "#f59e0b"],
  ["#140b0f", "#5a1130", "#db2777"],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const title = (sp.get("t") || "ClickSemrus").slice(0, 120);
  const category = (sp.get("c") || "Marketing").slice(0, 40);
  const kind = sp.get("k") === "trend" ? "Trending in India" : "Guide";
  const seed = sp.get("s") || title;
  const [a, b, c] = PALETTES[hash(seed) % PALETTES.length];
  const logoBuf = await fetch(new URL("../../../../public/logo-160.png", import.meta.url)).then((r) => r.arrayBuffer());
  const bytes = new Uint8Array(logoBuf);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const logo = `data:image/png;base64,${btoa(bin)}`;
  const fontSize = title.length > 80 ? 48 : title.length > 50 ? 56 : 66;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: `linear-gradient(135deg, ${a} 0%, ${b} 55%, ${c} 130%)`, color: "white", fontFamily: "sans-serif", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -140, top: -160, width: 520, height: 520, borderRadius: 520, background: c, opacity: 0.35, filter: "blur(40px)", display: "flex" }} />
        <div style={{ position: "absolute", left: -120, bottom: -200, width: 420, height: 420, borderRadius: 420, background: "#ffffff", opacity: 0.08, filter: "blur(30px)", display: "flex" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.6 }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: "100%", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={logo} width={56} height={56} alt="" style={{ borderRadius: 999 }} />
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>Click<span style={{ color: "#a5b4fc" }}>Semrus</span></div>
            <div style={{ display: "flex", marginLeft: "auto", gap: 12 }}>
              <div style={{ display: "flex", padding: "8px 18px", borderRadius: 999, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)", fontSize: 22, fontWeight: 700 }}>{category}</div>
              <div style={{ display: "flex", padding: "8px 18px", borderRadius: 999, background: kind === "Guide" ? "#f59e0b" : "#ef4444", color: "#0b0b14", fontSize: 22, fontWeight: 800 }}>{kind}</div>
            </div>
          </div>
          <div style={{ display: "flex", fontSize, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1000, textShadow: "0 6px 30px rgba(0,0,0,0.35)" }}>{title}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "rgba(255,255,255,0.75)" }}>
            <span>Digital Marketing Agency · Delhi NCR</span>
            <span>clicksemrus.vercel.app/blog</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "cache-control": "public, max-age=31536000, immutable" } }
  );
}
