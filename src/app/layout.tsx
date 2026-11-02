import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Tracker from "@/components/Tracker";
import WhatsAppButton from "@/components/WhatsAppButton";
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
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#07070f", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings().catch(() => ({} as Awaited<ReturnType<typeof getSettings>>));
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={[orgJsonLd(), websiteJsonLd()]} />
        {settings.announcement && (
          <div className="bg-gradient-to-r from-brand to-brand-2 text-center text-xs font-semibold text-white py-2 px-4">{settings.announcement}</div>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton number={settings.whatsapp || SITE.whatsapp} />
        <Tracker />
        {settings.gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.gaId}');`}</Script>
          </>
        )}
        {settings.metaPixel && (
          <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${settings.metaPixel}');fbq('track','PageView');`}</Script>
        )}
      </body>
    </html>
  );
}
