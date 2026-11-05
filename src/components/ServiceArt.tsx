/**
 * Nine abstract, monochrome-indigo illustrations, one per service slug.
 * Rendered inline so they ship with the HTML and respect currentColor.
 */
const ART: Record<string, React.ReactNode> = {
  seo: (
    <>
      <circle cx="36" cy="36" r="22" />
      <path d="M52 52l18 18" strokeWidth="6" strokeLinecap="round" />
      <path d="M26 40c4-10 16-10 20 0" />
      <path d="M22 30h28" strokeDasharray="4 4" />
    </>
  ),
  "social-media-marketing": (
    <>
      <circle cx="24" cy="24" r="10" />
      <circle cx="60" cy="40" r="10" />
      <circle cx="30" cy="62" r="10" />
      <path d="M32 29l19 7M38 56l15-9" />
      <circle cx="60" cy="40" r="3" fill="currentColor" />
    </>
  ),
  "google-ads-ppc": (
    <>
      <path d="M20 26h48v30H20z" />
      <path d="M28 40h22M28 48h14" />
      <path d="M50 60l6 10 4-4 6 6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="58" cy="34" r="4" fill="currentColor" />
    </>
  ),
  "meta-ads": (
    <>
      <path d="M16 54c6-24 14-36 24-36s14 12 18 24c3 9 6 12 10 12s8-6 12-18" />
      <path d="M16 54c4 0 8-4 12-14" />
      <circle cx="40" cy="22" r="3" fill="currentColor" />
    </>
  ),
  "content-marketing": (
    <>
      <path d="M22 16h32l14 14v42H22z" strokeLinejoin="round" />
      <path d="M54 16v14h14" />
      <path d="M30 40h26M30 50h26M30 60h16" />
      <circle cx="62" cy="62" r="4" fill="currentColor" />
    </>
  ),
  "web-design-development": (
    <>
      <path d="M14 20h60v40H14z" />
      <path d="M14 30h60" />
      <circle cx="21" cy="25" r="1.5" fill="currentColor" /><circle cx="27" cy="25" r="1.5" fill="currentColor" /><circle cx="33" cy="25" r="1.5" fill="currentColor" />
      <path d="M36 52l-8-8 8-8M52 36l8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 70h24" strokeLinecap="round" />
    </>
  ),
  "influencer-marketing": (
    <>
      <circle cx="44" cy="30" r="10" />
      <path d="M26 66c2-12 10-18 18-18s16 6 18 18" />
      <path d="M62 18l4 8 8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1z" strokeLinejoin="round" />
    </>
  ),
  "whatsapp-email-marketing": (
    <>
      <path d="M16 26h48v34H16z" />
      <path d="M16 26l24 18 24-18" />
      <circle cx="66" cy="24" r="10" fill="currentColor" stroke="none" opacity=".9" />
      <path d="M62 24h8M66 20v8" stroke="#fff" strokeLinecap="round" />
    </>
  ),
  "branding-creative": (
    <>
      <path d="M20 60L52 28l10 10-32 32H20z" strokeLinejoin="round" />
      <path d="M46 34l10 10" />
      <circle cx="64" cy="20" r="6" />
      <path d="M22 22l4-6 4 6M24 22h4" strokeLinecap="round" />
    </>
  ),
};

export default function ServiceArt({ slug, className = "" }: { slug: string; className?: string }) {
  const art = ART[slug] || ART.seo;
  return (
    <svg
      viewBox="0 0 88 88"
      width="88"
      height="88"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={`service-art text-brand ${className}`}
      aria-hidden="true"
    >
      {art}
    </svg>
  );
}
