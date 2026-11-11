import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HideOnAdmin from "@/components/HideOnAdmin";
import Tracker from "@/components/Tracker";
import Splash from "@/components/Splash";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileBar from "@/components/MobileBar";
import GrowthPopup from "@/components/GrowthPopup";
import JsonLd from "@/components/JsonLd";
import { orgJsonLd, websiteJsonLd } from "@/lib/seo";
import { getSettings } from "@/lib/posts";
import Script from "next/script";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["digital marketing agency delhi", "digital marketing agency delhi ncr", "seo agency delhi", "social media marketing agency delhi", "google ads agency gurugram", "meta ads agency noida", "clicksemrus"],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: { type: "website", locale: SITE.locale, url: SITE.url, siteName: SITE.name, title: `${SITE.name} | ${SITE.tagline}`, description: SITE.description },
  twitter: { card: "summary_large_image", site: SITE.twitterHandle },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#07070f", width: "device-width", initialScale: 1 };

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-WXKGP7JR";
const GA_FALLBACK = process.env.NEXT_PUBLIC_GA_ID || "";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings().catch(() => ({} as Awaited<ReturnType<typeof getSettings>>));
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col has-mobile-bar">
        <JsonLd data={[orgJsonLd(), websiteJsonLd()]} />
        <Script id="gtm" strategy="lazyOnload">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}</Script>
        <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="gtm" /></noscript>
        {settings.announcement && (
          <div className="bg-gradient-to-r from-brand to-brand-2 text-center text-xs font-semibold text-white py-2 px-4">{settings.announcement}</div>
        )}
        <Splash />
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <HideOnAdmin><Footer /></HideOnAdmin>
        <WhatsAppButton number={settings.whatsapp || SITE.whatsapp} />
        <MobileBar phone={settings.phone || SITE.phone} />
        <GrowthPopup />
        <Tracker />
        {(settings.gaId || GA_FALLBACK) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaId || GA_FALLBACK}`} strategy="lazyOnload" />
            <Script id="ga4" strategy="lazyOnload">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.gaId || GA_FALLBACK}');`}</Script>
          </>
        )}
        {settings.metaPixel && (
          <Script id="meta-pixel" strategy="lazyOnload">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${settings.metaPixel}');fbq('track','PageView');`}</Script>
        )}
      </body>
    </html>
  );
}
