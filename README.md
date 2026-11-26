# ClickSemrus — Digital Marketing Agency Website

Marketing website, blog engine and admin panel for **ClickSemrus**, a digital marketing agency in Delhi NCR (SEO, social media, Google and Meta ads, content, web development, e-commerce, branding, automation and CRM).

- **Live:** https://clicksemrus.vercel.app
- **Admin:** https://clicksemrus.vercel.app/admin
- **Repo:** https://github.com/jassi2019/clicksemrus (branch `main` auto-deploys to Vercel)

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, ISR) |
| UI | React 19, Tailwind CSS 4, Space Grotesk + Inter via `next/font`, lucide-react icons |
| 3D hero | three.js via @react-three/fiber, loaded client-side only |
| Data | Upstash Redis (posts, leads, analytics, settings, keyword snapshots); the site still runs without it |
| AI writers | Gemini (default), Groq and Anthropic Claude as fallbacks for trend and keyword articles |
| Search | Google Search Console API (keyword engine), Google Indexing API, IndexNow |
| Hosting | Vercel with scheduled crons (`vercel.json`) |
| Language | TypeScript strict, ESLint (`eslint-config-next`) |

## Features

**Marketing pages (all statically generated, SEO-ready)**

- Home with a 3D scroll hero, stats, trend-desk ticker, services, work, industries, process, Google reviews, Instagram feed, blog, lead form and FAQ.
- `/services` hub, 7 category hubs (`/services/[category]`) and 39 sub-service pages (`/services/[category]/[slug]`) rendered from one `ServicePageTemplate`: mesh hero with proof badges, sticky in-page sub-nav, numbered deliverables, 4-step process timeline, who-it-is-for, why-us band, related portfolio, FAQ and lead form. Legacy `/services/[slug]` URLs resolve to the new structure.
- `/industries/[slug]` (6 sectors) with pain points and fixes, channel playbook, 90-day plan, related work and FAQ.
- `/locations/[city]` (Delhi, Gurugram, Noida, Faridabad, Ghaziabad) with areas served, a local SEO checklist, popular services, LocalBusiness JSON-LD.
- `/case-studies` portfolio with **live previews**: full-page screenshots in a browser or phone frame that scroll on hover and open in an auto-scrolling modal. A `RelatedWork` strip shows relevant projects on every service, industry, location, about and pricing page.
- `/pricing` with plans, a feature comparison table, add-ons and pricing FAQ. `/about`, `/contact`, privacy and terms.
- Per-page metadata and canonicals, Open Graph image, JSON-LD (Organization, LocalBusiness, Service, FAQ, Breadcrumb, BlogPosting, Review), `sitemap.xml`, `robots.txt`, web manifest.

**Blog and growth engine**

- Markdown blog with categories, related posts and auto-interlinking to service pages.
- **Trending engine:** reads Google Trends India daily and writes a pure news/explainer article per trend with outbound source links. Live trends show on the blog even without a database.
- **Search Console keyword engine:** pulls queries and pages from GSC, scores uncovered opportunities and writes keyword-targeted posts for the best ones.
- **Blog-to-blog internal linking (SEO):** every article page shows tag/category-matched *Related reads*, a *More trending now* sidebar of 6–8 newest posts, and safe in-body links to other posts when a distinctive title phrase matches (`interlinkPosts` in `lib/markdown.ts`, max 2, first occurrence only, never touches markdown syntax). The blog index has a *Browse by topic* chip row (with counts) linking to each `/blog/category/<slug>` that has posts. This dense internal link graph helps Google crawl and rank the whole blog.
- **In-article images (copyright-free):** when a post is built/regenerated, `lib/articleImages.ts` fetches a relevant Pexels landscape photo and inserts one image after the first H2, with a `Photo: <credit> / Pexels (representative image)` caption rendered as a styled `<figure>`/`<figcaption>`. Requires `PEXELS_API_KEY`; with no key it degrades gracefully (no image, no error). The main cover still comes from `coverFor` (OpenAI → Pexels → branded render).
- **Title cleanup:** the trend writer prompt now asks for a natural 45–70-char headline, and `cleanTitle` (`lib/trending.ts`) strips broken slug/abbreviation prefixes like `"Pl: …"`. Applied on build/regenerate and via the admin `fixtitles` action (`POST /api/admin/seo {"action":"fixtitles"}`) to repair existing posts in bulk.
- **Rich results:** article pages emit `BlogPosting` (headline, datePublished, dateModified, author, image), `BreadcrumbList`, and `FAQPage` JSON-LD parsed from the `## FAQ` section (only when 2+ Q/A are found) for rich snippets and AI citations. Canonicals are set on every page.
- **Indexing:** every new URL is pushed to the Google Indexing API and IndexNow; the sitemap is resubmitted. `POST /api/admin/seo {"action":"indexAll"}` pings Google + IndexNow for all posts.
- Newsletter signup (Resend audience or Brevo list).

**GEO / AEO (AI answer-engine optimisation)**

- **Author bylines → real bio pages (E-E-A-T):** three editorial personas live in `src/lib/authors.ts` (name, role, credible India-focused bio, expertise tags, link) and are assigned to each post deterministically by category/slug-hash (`authorFor`, not stored on the Post). Bio pages at `/authors/<slug>` list that desk's articles and emit `Person` + `ProfilePage` JSON-LD (`personJsonLd`/`profilePageJsonLd` in `lib/seo.ts`); the article byline links to the author, and `articleJsonLd` now carries the `Person` author. Avatars are initials-based (`AuthorAvatar`), no photos or fabricated credentials. Author pages are in the sitemap.
- **Clean markdown versions for AI ingestion:** every article is served as plain markdown at `/blog/<slug>/md` (`text/markdown` — H1 title, meta line, author, canonical, raw body + sources). The article `<head>` advertises it via `<link rel="alternate" type="text/markdown">` (the `markdownPath` option on `pageMeta`). `/llms-full.txt` mirrors `/llms.txt` but embeds the full markdown body of the ~20 latest posts; `/llms.txt` links to both.
- **Cornerstone "by the numbers" fact strips (AI-citation lift):** honest, quotable industry-norm one-liners (`INDUSTRY_FACTS` in `lib/site.ts`, rendered by `FactStrip` as a semantic `<dl>`) on the homepage, `/services` and the SEO service hub. No fabricated ClickSemrus metrics — all framed as expectations/norms.
- **One-sentence direct answers:** each service family hub (`DIRECT_ANSWER` map) and each industry page opens with a single "What is X?" sentence for AI extraction.
- **Topical clusters on `/blog`:** the index now groups posts into *Latest news & insights* plus per-category clusters (Sports, Entertainment, Business, Technology, SEO, Social Media, …), each with a "See all <category>" link, on top of the existing *Browse by topic* chip row — a denser internal link graph. Blog index metadata targets "Digital marketing blog & trending news India".
- **Best / top / vs / how-to keyword pages:** a curated list of ~10 evergreen comparison/guide topics lives in `KEYWORD_TOPICS` (`lib/site.ts`); generate each as a real article with `POST /api/admin/seo {"action":"write","query":"<topic>"}` (one at a time; needs `GROQ_API_KEY`/AI writer).

**Conversion**

- Compact lead form (`LeadForm`) posting to `/api/lead`: name, phone with fixed +91 prefix, email, service chips, optional details, consent, honeypot. Leads are stored in Redis and optionally emailed via Resend.
- **Growth Score popup** (`GrowthPopup`): a short quiz that scores the visitor's marketing and hands off to the lead form.
- Floating **WhatsApp widget** and a mobile sticky call/WhatsApp bar.
- Google Reviews strip (Places API, refreshed by cron) and a live **Instagram feed** (Graph API or a feed URL).
- First-party page-view and event tracking (`/api/track`) plus optional GTM and GA4.

**Admin panel (`/admin`, password protected)**

| Section | What it does |
| --- | --- |
| Dashboard | Views chart, top pages, referrers, countries, devices, recent leads |
| Posts | Markdown editor with SEO preview, publish/unpublish, AI draft generation |
| Trending | Current Google Trends India, one-click article generation, auto-publish toggle |
| Search & Indexing | GSC keyword opportunities, keyword post generation, Indexing API and IndexNow status |
| Page builder | Block-based visual builder (Elementor-style) using the site's own design system: take over Home, About, Pricing, Contact or Services, or create new pages under `/p/<slug>`. See [Page builder](#page-builder) |
| Pages | Edit headlines, intros, stats, plan names/prices, office hours, CTA band and announcement bar without touching code (`src/lib/pageContent.ts`) |
| Code editor | Edit source files in the browser; every save is a GitHub commit that Vercel deploys. Shows deploy status and can revert a file to its previous commit. See [Code editor](#code-editor) |
| Leads | Lead table with status, CSV export, WhatsApp notification log |
| Visitors | Live activity and recent visitor sessions (first-party `cs_vid` cookie): pages, source, country/city, device, converted leads |
| Settings | Phone, WhatsApp, owner WhatsApp for alerts, GA ID, announcement bar, stats note, cron and AI writer toggles, WhatsApp test send |

## Page builder

Admin → **Page builder** (`/admin/builder`) edits whole pages from blocks, rendered with the same classes and components as the coded pages so they look native.

- **Blocks:** hero, rich text (markdown), features (icon or numbered cards, 2/3/4 columns), stats (animated counters), steps/timeline, services grid (pick from `SERVICES`), portfolio (pick from `WORK`), testimonials, FAQ (emits FAQ JSON-LD), CTA band, lead form, image, two columns, spacer and custom HTML (scripts, iframes and inline handlers are stripped). The registry with labels, defaults and the field schema that drives the editor form lives in `src/lib/builder.ts`; the renderer is `src/components/builder/BlockRenderer.tsx`.
- **Take over an existing page:** choose Home, About, Pricing, Contact or Services and "Start from current page". A seed layout (`src/lib/builderSeeds.ts`) approximating the coded page (using the current Pages-panel copy) is created as a draft. Once **published**, the route renders the layout instead of the coded JSX (metadata and JSON-LD stay as coded). **Unpublish** or **Revert to code version** puts the coded page back instantly.
- **New pages** are served at `/p/<slug>` (ISR, 60 s) with SEO title and description from the editor. Drafts return 404 publicly.
- **Editor:** block list with drag-to-reorder (or up/down), duplicate, delete; grouped add-block palette; the selected block's form on the right; SEO fields; Save draft, Publish, Unpublish; a live preview iframe (`/p/preview/<slug>`, admin-only, shows drafts) with desktop/phone widths; Ctrl+S saves. Unsaved work is autosaved to the browser's localStorage and offered for restore on the next visit.
- **Images:** the image fields have an Upload button (`POST /api/admin/upload`, up to 4 MB). Files are stored in Redis as base64 chunks and served from `/api/uploads/<id>` with immutable caching. Paste any external URL instead if you prefer.
- **Storage:** `layout:<slug>` in Redis, slugs in the `layouts:index` set. Publishing calls `revalidatePath` for the route and `/`.

## Code editor

Admin → **Code editor** (`/admin/code`) is an advanced tool for editing the codebase without a laptop. Files are read from and written to GitHub through the Contents API (`src/lib/github.ts`), so nothing is edited on the server itself.

- **Scope:** `src/app/**`, `src/components/**`, `src/lib/site.ts`, `src/lib/pageContent.ts`, `src/app/globals.css` and `README.md` (`.ts/.tsx/.css/.md/.json`). Everything else is refused by the API.
- **Editing:** a plain monospace textarea with line numbers, Tab inserts two spaces, **Ctrl+S** saves. Each save commits to `GITHUB_BRANCH` with the message `admin: edit <path>` (plus a Co-Authored-By line). If the file changed on GitHub since it was opened the save is refused and must be reloaded first.
- **Deploy status:** after a commit the editor polls `GET /api/admin/code?deploy=1`. With `VERCEL_TOKEN` + `VERCEL_PROJECT_ID` (+ `VERCEL_TEAM_ID` for team accounts) it shows Queued → Building → Live or Build failed with a link to the build log; without them it reports that the commit was pushed and Vercel will deploy in about two minutes.
- **Safety:** a syntax or type error breaks the *next* deploy only; the previously deployed version stays live until a build succeeds. **Revert this file** commits the version from the previous commit that touched the file. **History** lists the last commits for the open file.
- **Setup:** without `GITHUB_TOKEN` the page shows step-by-step instructions for creating a fine-grained personal access token (Repository access: only this repo; Permissions: Contents read and write) and adding it to Vercel.

## Environment variables

Set these in Vercel → Settings → Environment Variables (and in `.env.local` for development). Never commit real values.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin, e.g. `https://clicksemrus.vercel.app` |
| `NEXT_PUBLIC_CONTACT_PHONE` | recommended | Display phone, e.g. `+91 98xxx xxxxx` (Admin → Settings can override) |
| `NEXT_PUBLIC_WHATSAPP` | recommended | WhatsApp number in international digits, e.g. `9198xxxxxxxx` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | recommended | Contact email shown on the site |
| `NEXT_PUBLIC_GTM_ID` | optional | Google Tag Manager container ID |
| `NEXT_PUBLIC_GA_ID` | optional | GA4 measurement ID (fallback when not set in Settings) |
| `NEXT_PUBLIC_GOOGLE_REVIEW_URL` | optional | "Read all reviews" link on the reviews strip |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | recommended | Persistent storage for posts, leads, analytics, settings (`KV_REST_API_URL`/`KV_REST_API_TOKEN` also work) |
| `ADMIN_PASSWORD` | yes | Admin login password |
| `ADMIN_SECRET` | yes | Signs the admin session cookie |
| `CRON_SECRET` | yes | Bearer token Vercel sends to cron routes |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | optional | Service-account JSON (single line) with Search Console and Indexing API access |
| `GSC_SITE_URL` | optional | Search Console property, e.g. `sc-domain:clicksemrus.com` or the full URL |
| `INDEXNOW_KEY` | optional | IndexNow key; served at `/indexnow/<key>.txt` |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | optional | Primary AI writer (defaults to a flash-lite model) |
| `GROQ_API_KEY` / `GROQ_MODEL` | optional | Second AI writer, used when Gemini is unavailable |
| `ANTHROPIC_API_KEY` | optional | Third AI writer (Claude) |
| `GOOGLE_PLACE_ID` / `GOOGLE_PLACES_API_KEY` | optional | Google Business Profile reviews on the home page |
| `INSTAGRAM_FEED_URL` / `INSTAGRAM_ACCESS_TOKEN` | optional | Instagram feed: either a JSON feed URL or a Graph API token |
| `RESEND_API_KEY` / `LEAD_NOTIFY_EMAIL` / `RESEND_AUDIENCE_ID` | optional | Lead email notifications and newsletter audience |
| `BREVO_API_KEY` / `BREVO_LIST_ID` | optional | Newsletter list on Brevo (alternative to Resend) |
| `OWNER_WHATSAPP` | recommended | Owner's WhatsApp number (digits with country code, e.g. `9198xxxxxxxx`) that receives lead alerts. Admin → Settings → "Owner WhatsApp" overrides it; falls back to `NEXT_PUBLIC_WHATSAPP` |
| `WA_CLOUD_TOKEN` | optional | Meta WhatsApp Cloud API permanent (system user) access token |
| `WA_PHONE_NUMBER_ID` | optional | Phone number ID of the business number in the Meta app (not the number itself) |
| `WA_THANKYOU_TEMPLATE` | optional | Name of an approved Cloud API template for the lead thank-you, with two body variables: `{{1}}` first name, `{{2}}` agency name |
| `CALLMEBOT_APIKEY` | optional | CallMeBot API key (free, owner alerts only) |
| `CALLMEBOT_PHONE` | optional | The owner's number registered with CallMeBot, digits with country code |
| `GITHUB_TOKEN` | optional | Fine-grained personal access token with **Contents: read and write** on the repo; enables Admin → Code editor (github.com/settings/personal-access-tokens/new) |
| `GITHUB_REPO` | optional | Repository the code editor commits to, `owner/name` (default `jassi2019/clicksemrus`) |
| `GITHUB_BRANCH` | optional | Branch the code editor reads and commits (default `main`) |
| `VERCEL_TOKEN` | optional | Vercel account token (Account Settings → Tokens) for live deploy status in the code editor |
| `VERCEL_PROJECT_ID` | optional | Vercel project ID (Project → Settings → General) |
| `VERCEL_TEAM_ID` | optional | Vercel team ID (Team → Settings → General); only for projects under a team |

Without a database the site works fully, but leads, analytics and manually written posts reset on each cold start.

## WhatsApp notifications

Every enquiry from the lead form or the Growth Score popup (not the newsletter) triggers, after the lead is saved: an alert to the owner on WhatsApp, a thank-you WhatsApp to the lead, and the existing email (Resend). `src/lib/whatsapp.ts` picks the first configured provider and logs every attempt to `wa:log` (visible under the table on Admin → Leads). Admin → Settings shows which provider is active and has a "Send test WhatsApp to owner" button.

**Option 1: CallMeBot (free, owner alerts only, 5 minutes)**

1. Save the CallMeBot number `+34 644 59 55 95` in your phone and send it the WhatsApp message `I allow callmebot to send me messages`.
2. Within a minute it replies with your API key.
3. Set `CALLMEBOT_APIKEY` to that key and `CALLMEBOT_PHONE` to your own number (digits with country code, e.g. `9198xxxxxxxx`), redeploy.

CallMeBot can only message the number that registered, so the lead thank-you is skipped. The lead still gets a "Continue on WhatsApp" button on the thank-you screen, which opens a chat with the business number and a prefilled message.

**Option 2: Meta WhatsApp Cloud API (owner alerts + thank-you to the lead)**

1. In [Meta for Developers](https://developers.facebook.com/) create a Business app, add the WhatsApp product and connect (or verify) the business phone number.
2. Copy the **Phone number ID** from WhatsApp → API Setup into `WA_PHONE_NUMBER_ID`.
3. Create a System User in Business Settings with `whatsapp_business_messaging` and `whatsapp_business_management` permissions, generate a **permanent token** and set it as `WA_CLOUD_TOKEN`.
4. For the thank-you, create and submit a **Utility** template (e.g. `lead_thankyou`, language English) with body: `Hi {{1}}, thanks for contacting {{2}}! A strategist will call you within 2 business hours. Meanwhile reply here with your website and goals.` Once approved, set `WA_THANKYOU_TEMPLATE=lead_thankyou`.
5. Set `OWNER_WHATSAPP` (or Admin → Settings → Owner WhatsApp) to the number that should receive alerts and redeploy.

Without a template the thank-you is sent as plain text, which the Cloud API only delivers inside a 24-hour customer-service window (the lead must have messaged the business number first). The "Continue on WhatsApp" button on the thank-you screen is how the lead opens that window themselves.

## Local development

```bash
npm install
cp .env.example .env.local   # or create it; fill the variables above
npm run dev                  # http://localhost:3000
npm run lint                 # must be 0 errors
npm run build && npm start   # production build
```

Admin is at `/admin`; log in with `ADMIN_PASSWORD`.

## Deploy

Production deploys automatically from `main` on Vercel. `vercel.json` schedules two crons (times in UTC):

| Route | Schedule | Purpose |
| --- | --- | --- |
| `/api/cron/trending?limit=3` | `30 2 * * *` (08:00 IST) | Daily growth cron (below) |
| `/api/cron/reviews` | `0 3 * * *` | Refresh Google reviews cache |

Both routes require `Authorization: Bearer $CRON_SECRET`, which Vercel adds automatically.

### How the daily growth cron works

`/api/cron/trending` runs once a day and, in one pass:

1. **Trends** — fetches Google Trends for India, skips trends already covered, and writes up to `limit` new marketing-angle posts (AI writer if a key is set, template writer otherwise). Respects the auto-publish toggle in Admin → Settings.
2. **Keyword engine** — refreshes the Search Console snapshot (`src/lib/gsc.ts`), scores queries where the site gets impressions but no dedicated page, and writes keyword-targeted posts for the best uncovered ones (`src/lib/keywordPost.ts`).
3. **Indexing** — pings the Google Indexing API and IndexNow for every URL created, plus `/blog`, and resubmits the sitemap (`src/lib/indexing.ts`). Revalidates the affected paths.

You can trigger the same steps manually from Admin → Trending and Admin → Search & Indexing.

## Adding a portfolio item

1. Add an entry to `WORK` in `src/lib/site.ts` with `slug`, `title`, `client`, `industry` (must match an `INDUSTRIES` name to appear on that industry page), `type`, `cover`, `result`, `summary`, `challenge`, `approach`, `services` (service or category slugs; used by `workForService`) and optional `deliverables`, `url`, `instagram`, `facebook`, `appStore`, `playStore`.
2. Put the cover image at `public/work/<slug>.jpg` (3:2).
3. For the live preview, add full-page screenshots at `public/work/shots/<slug>-desktop.jpg` (1200px wide) and `public/work/shots/<slug>-mobile.jpg` (390px wide) and set `shotDesktop`, `shotDesktopSize`, `shotMobile`, `shotMobileSize` with the exact pixel dimensions. The frame uses the height to compute scroll distance and duration.
4. The item appears on `/case-studies`, the home page work grid and every `RelatedWork` strip that matches its services or industry.

## Project structure

```
src/
  app/
    page.tsx                     Home
    services/                    Hub, [category], [category]/[slug]
    industries/[slug]            Sector pages
    locations/[city]             City pages
    case-studies/                Portfolio and case study pages
    blog/                        Blog index, categories, posts
    pricing/ about/ contact/     Marketing pages
    admin/                       Admin panel (posts, trending, seo, leads, settings)
    api/                         lead, track, newsletter, ig-img, admin/*, cron/*
    sitemap.ts robots.ts manifest.ts opengraph-image.tsx
  components/                    UI: ServicePageTemplate, RelatedWork, WorkGrid, LeadForm,
                                 GrowthPopup, WhatsAppButton, InstagramFeed, Reviews, Reveal,
                                 TiltCard, Counter, ServiceArt, ServiceIcon, admin/*
  lib/
    site.ts                      SITE, SERVICES, SERVICE_CATEGORIES, INDUSTRIES, LOCATIONS, WORK, INDUSTRY_FACTS, KEYWORD_TOPICS + helpers
    authors.ts                   Editorial personas (E-E-A-T) + deterministic author assignment
    seo.ts                       Metadata and JSON-LD builders (incl. Person/ProfilePage)
    posts.ts db.ts               Posts, leads, settings on Redis
    trending.ts keywordPost.ts   Trend and keyword article writers
    gsc.ts indexing.ts google.ts Search Console, Indexing API, IndexNow, Google auth
    ai.ts llm.ts                 AI writer providers and JSON repair
    reviews.ts instagram.ts      Google reviews and Instagram feed
    analytics.ts markdown.ts     First-party tracking, markdown rendering and interlinking
  content/seed-posts.ts          Evergreen seed articles
public/
  work/                          Portfolio covers and shots/ (full-page screenshots)
vercel.json                      Cron schedules
```

## Update log (November 2026)

### Trending content engine v2
- Sources: Google Trends India daily RSS **ranked by search traffic** plus Google News India top stories (general, sports, entertainment, business, technology). Publisher-name "trends" (e.g. a newspaper's name) are skipped.
- Each article is written from the **actual source articles** (first ~2.6k characters of up to 3 sources are fetched and passed to the model) as an intent-matched explainer: direct answer, what happened, intent section (score / cast / dates / numbers), why it is trending, 4 FAQs, and a short marketing angle. Titles start with the exact trending phrase.
- One article per topic (stable slug = topic), up to 12 per run, each run capped at ~200s of writing so it stays inside the function budget.
- Runs: Vercel cron daily (`vercel.json`) **and** `.github/workflows/trending.yml` daily (GitHub Actions calls `/api/cron/trending?limit=1&keywords=3` with the `CRON_SECRET` repository secret). Trigger manually with `gh workflow run trending.yml`.
- **Publishing (owner's rule, 26 Nov 2026): digital marketing only, ONE article every other day.** On 21 Nov the whole site (home and services too) dropped from ~1.5k impressions/day to ~5 during the November 2026 core update, with no manual action; the likely cause is ~70 auto-generated off-topic news posts on an agency domain. So: the daily Vercel cron writes one digital-marketing article when the last article is 40h+ old (`trend:lastAt`), from Search Console marketing queries first, then `KEYWORD_QUEUE` (its first block is our own angle on topics a competitor covers, never copied). Trend news runs only on an explicit `trend=1`; every `source: "trend"` post is **noindex** and left out of the sitemap, llms.txt and the home page. Writers never publish the template when the AI fails (they throw; the topic is skipped). Every article interlinks 2-3 of our pages (`lib/internalLinks.ts`).
- **News only, never the template:** trend posts are published only when the AI news writer succeeds (`buildTrendPost` retries once, then throws and the topic is skipped). The marketing-style trend template (`composeTrendPost`) is a base for the writer, not a page: `liveTrendPosts` is no longer rendered on home, `/blog`, categories, article pages, `.md` or the sitemap — only stored posts are. `generateJson` falls through Claude -> Gemini -> Groq, so set `GROQ_API_KEY` as a free backup for Gemini 503s.
- **Publish a trend post on demand:** `gh workflow run trending.yml -R jassi2019/clicksemrus -f topic="GTA 6"` — the route's `?topic=` param pulls sources from a Google News search for that query, writes one news article now (ignores the every-other-day gap, replaces a same-slug post), generates the cover and pings the index.
- Every run also: writes keyword articles from Search Console opportunities, generates covers, pings Google Indexing API + IndexNow, and re-submits the sitemap.

### Homepage
- **Hero v2**: perspective "growth board" that tilts with the cursor, auto-loops Day 0 → Month 3 (click a stage to hold it for 7s), phone preview per stage (website, Maps ranking, ad, real top reel with its likes, WhatsApp chat), count-up KPIs, glowing chart, confetti at Month 3. Pure CSS/SVG, no WebGL.
- **Service ticker**: tilted two-row icon chip marquee.
- **Reels showcase** (replaces the stats cards): tabs for brand reels and AI videos pulled live via Instagram business discovery (`getClientReels` in `src/lib/reels.ts`, pinned post codes first), spotlight on tap (others blur), all links go to the ClickSemrus Instagram. Native playback needs `media_url`, which Instagram only returns for accounts connected to the Meta business; otherwise the spotlight shows the thumbnail with an "Our Instagram" button.
- Instagram feed: official Graph API via the linked Facebook Page (`INSTAGRAM_USER_ID` + Meta token), 10-minute refresh, 4 latest posts.
- Blog cards: equal heights, branded 1200x630 covers from `/api/cover`.
- **Redis budget (important):** Upstash free tier allows 500k commands/month. Post reads go through Next's data cache (`listDbPosts` / `getPost` in `src/lib/posts.ts`, tag `posts`, 1-hour TTL) so a render costs at most one Redis round-trip per hour instead of `smembers` + one `get` per post per request — that pattern burned the whole quota in ~3 days and 500'd every blog page (Nov 2026). Writes call `revalidateTag("posts")`. If Redis is unreachable, `getAllPosts` serves the seed posts so `/blog`, home, sitemap and llms.txt stay 200; article pages 500 (Google treats 5xx as temporary, unlike 404). Check usage at console.upstash.com → database → Usage.
- **Database switch (22 Nov 2026):** production now uses a fresh Upstash DB (`clicksemrus-2`, us-east-1, second Upstash account). The previous DB's credentials stay on Vercel as `UPSTASH_OLD_REDIS_REST_URL/TOKEN`; the daily cron calls `mergeOldRedis` (`src/lib/mergeOld.ts`) which copies every key missing from the live DB (posts, settings, content overrides, covers, leads) — it errors harmlessly while the old quota is exhausted and completes itself once that resets (~1 Dec). Remove the `UPSTASH_OLD_*` vars after the merge reports `remaining: 0`.
- Scroll performance: static blobs, earlier/faster reveal, no 3D tilt cards on phones, no splash on phones.
- **Targeting is pan-India (Nov 2026):** tagline, home/services/industries/pricing/about/contact titles and descriptions say "in India"; Delhi NCR stays only in the address, LocalBusiness schema and `/locations/*` pages. Keyword articles are written for all of India.
- **Mobile performance rules (measured Nov 2026, 4x-throttled phone):** no `backdrop-filter`, CSS `filter` blobs, `will-change` on tall screenshots, SVG `<g>` animations or infinite `animate-ping/pulse` on phones (`@media (max-width:767px),(hover:none)` block at the end of globals.css) — infinite pings forced every later overlapping block into its own GPU layer (~208 MP of textures → blank content while flinging). The hero journey's numbers are written to the DOM by `Count` (never React state per frame), the stage loop pauses off-screen, and on phones the stages jump without tweens. `AutoScrollRow` only runs its rAF loop while visible and pauses during page scroll. Result: fling-scroll slow frames 55 → 4, long tasks 20 → 2.
- **Phones never clip the hero:** the hero grid uses `minmax(0,1fr)` tracks with `min-w-0` columns. A nowrap row inside an `auto` grid column (the proof chips) otherwise sets the column's min-content to ~636px and the headline, buttons and story board get cut off at the right on a 390px screen.
- **Auto-scroll rows / footer / compare table (26 Nov 2026):** `AutoScrollRow` pauses 6 s on touchstart and resumes on touchend *or* touchcancel (a page swipe that starts on the row used to freeze it for good); the reels row also runs on desktop (`mobileOnly={false}`). `FooterWatch` sets `html.at-footer` while the footer is visible so the growth-score tab and chat bubble hide instead of covering footer links. Phones: no `main` bottom padding (body already reserves the bottom bar), and the pricing compare table fits all three plans without sideways scroll.
- **Blog sidebar form:** `LeadForm compact` is the one-column sidebar variant (name, +91 phone, email, service select, consent, full-width button) inside the dark `.lead-side` card; the article grid is `minmax(0,1fr) + 320px`. Never put the full form in the sidebar again.
- **Window scroll (important):** `<html>` is the scrolling element — do **not** put `h-full`/fixed height on `<html>`, and keep `overflow-x: hidden` on `html`, never on `body`. If `<html>` is height-capped while `<body>` grows, the body silently becomes a nested scroll container: `window.scrollY` stays ~0, the page clamps early, and `<Link>` clicks + scroll-driven reveal/header feel "dead". `<body>` uses `min-h-screen` only.

### WhatsApp
- Meta Cloud API with a permanent system-user token; owner alert + lead thank-you on every enquiry; named-parameter templates `clicksemrus_lead_alert` / `clicksemrus_thank_you` (text fallback while pending). Test from Admin → Settings.

### Admin
- Page builder (`/admin/builder`), code editor (`/admin/code`, GitHub-backed), text content (`/admin/pages`), visitors (`/admin/visitors`), Search & Indexing (`/admin/seo`), leads with WhatsApp log.

### Blog feature images
- **Owner-supplied covers (Nov 2026):** all 29 live articles use images the owner made, stored as 1200px WebP in `public/covers/<slug>.webp`. DB posts point `cover` at that path in Redis; seed posts carry `cover:` in `src/content/seed-posts.ts`. They take priority over the generated covers below (cron `ensureCover` only fills posts without a cover). After editing posts directly in Redis, refresh cached pages with `gh workflow run trending.yml -R jassi2019/clicksemrus -f refresh=1`.
- Every post gets a feature image. Order: **OPENAI_API_KEY** (gpt-image-1 illustration, stored in Redis, served at `/api/cover-img/<slug>`) -> **PEXELS_API_KEY** (relevant stock photo, topic words then a category theme, with credit) -> the branded `/api/cover` render (title + category on a gradient). Covers are generated on publish and by the cron; regenerate all from Admin -> Search & Indexing -> "Regenerate blog covers".
- Env: `OPENAI_API_KEY` (optional, paid, ~$0.01-0.04/image, from platform.openai.com), `PEXELS_API_KEY` (free, from pexels.com/api).
