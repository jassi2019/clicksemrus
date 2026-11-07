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
- **Trending engine:** reads Google Trends India daily and writes a marketing-angle article per trend with outbound source links. Live trends show on the blog even without a database.
- **Search Console keyword engine:** pulls queries and pages from GSC, scores uncovered opportunities and writes keyword-targeted posts for the best ones.
- **Indexing:** every new URL is pushed to the Google Indexing API and IndexNow; the sitemap is resubmitted.
- Newsletter signup (Resend audience or Brevo list).

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
| Leads | Lead table with status, CSV export |
| Settings | Phone, WhatsApp, GA ID, announcement bar, stats note, cron and AI writer toggles |

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

Without a database the site works fully, but leads, analytics and manually written posts reset on each cold start.

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
    site.ts                      SITE, SERVICES, SERVICE_CATEGORIES, INDUSTRIES, LOCATIONS, WORK + helpers
    seo.ts                       Metadata and JSON-LD builders
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
