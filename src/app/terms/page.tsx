import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Terms of Service", description: `Terms for using the ${SITE.name} website and services.`, path: "/terms" });

export default function Terms() {
  return (
    <section className="container-x pt-16 md:pt-24 pb-16 max-w-3xl prose">
      <h1 className="font-display text-4xl font-bold text-fg">Terms of Service</h1>
      <h2>Use of this website</h2>
      <p>Content on this site is for general information. Results shown are representative and depend on industry, budget and execution. No ranking or revenue outcome is guaranteed.</p>
      <h2>Services</h2>
      <p>Service engagements are governed by a separate written proposal and agreement. Fees exclude GST and third-party ad spend unless stated.</p>
      <h2>Intellectual property</h2>
      <p>All content, design and code on this website belong to {SITE.legalName} unless otherwise credited. Trend articles link to and credit their original news sources.</p>
      <h2>Contact</h2>
      <p>Questions about these terms: {SITE.email}</p>
    </section>
  );
}
