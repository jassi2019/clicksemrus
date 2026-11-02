import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Privacy Policy", description: `How ${SITE.name} collects, uses and protects your data.`, path: "/privacy-policy", noindex: false });

export default function Privacy() {
  return (
    <section className="container-x pt-16 md:pt-24 pb-16 max-w-3xl prose">
      <h1 className="font-display text-4xl font-bold text-fg">Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
      <h2>What we collect</h2>
      <p>When you fill a form on this website we collect your name, phone number, email and the details you share about your business. We also collect anonymous usage data (pages viewed, device type, referrer) through first-party analytics and, where enabled, Google Analytics and Meta Pixel.</p>
      <h2>How we use it</h2>
      <p>To respond to your enquiry, prepare your audit, and send you relevant marketing information. We never sell your data.</p>
      <h2>Cookies</h2>
      <p>We use essential cookies for the admin area and analytics cookies to understand traffic. You can block cookies in your browser settings.</p>
      <h2>Your rights</h2>
      <p>You may request access to, correction of, or deletion of your personal data by emailing {SITE.email}.</p>
      <h2>Contact</h2>
      <p>{SITE.legalName}, {SITE.address}. Email: {SITE.email}</p>
    </section>
  );
}
