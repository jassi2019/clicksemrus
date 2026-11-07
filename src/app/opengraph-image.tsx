import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${SITE.name} - ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "linear-gradient(135deg,#07070f 0%,#1a1340 50%,#0b2a33 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${SITE.url}/logo.png`} width={64} height={64} alt="" style={{ borderRadius: 999 }} />
          <div style={{ fontSize: 40, fontWeight: 700 }}>Click<span style={{ color: "#22d3ee" }}>Semrus</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 1000 }}>We turn clicks into customers.</div>
          <div style={{ fontSize: 30, color: "#a5a7bd" }}>SEO • Social Media • Google & Meta Ads • Content • Web Design</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#a5a7bd" }}>
          <span>{SITE.tagline}</span>
          <span>{SITE.url.replace("https://", "")}</span>
        </div>
      </div>
    ),
    size
  );
}
