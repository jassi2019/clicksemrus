# ClickSemrus — Digital Marketing Agency Website

Next.js 16 + Tailwind site for ClickSemrus (Delhi NCR) with SEO, a built-in admin panel, first-party traffic analytics, lead capture and an automatic trending-topic blog.

## Live

- Site: https://clicksemrus.vercel.app
- Admin: https://clicksemrus.vercel.app/admin (password is the `ADMIN_PASSWORD` env var in Vercel)

## What is inside

| Area | Details |
| --- | --- |
| Pages | Home, Services (9 service pages), Results, Pricing, Blog, Blog categories, About, Contact, Privacy, Terms |
| SEO | Per-page metadata, canonical URLs, Open Graph image, JSON-LD (Organization/LocalBusiness, Service, FAQ, BlogPosting, Breadcrumb), sitemap.xml, robots.txt, manifest |
| Conversion | Lead forms on every key page, WhatsApp floating button, sticky CTAs, FAQ, pricing, testimonials |
| Tracking | First-party page-view + event tracking (`/api/track`) shown on the admin dashboard; optional GA4 and Meta Pixel from Settings |
| Admin panel | Dashboard (views chart, top pages, referrers, countries, devices, leads), Posts (markdown editor with SEO preview), Trending engine, Leads (CSV export), Settings |
| Trending blog | Reads Google Trends India daily, writes a marketing-angle article per trend with outbound links to the news sources, auto-interlinks to service pages, related posts. Live trends show on the blog even without a database; the daily cron stores them permanently when a database is connected |
| AI writer | Optional. Set `ANTHROPIC_API_KEY` and trend posts are written by Claude instead of the template writer |

## Environment variables (Vercel → Settings → Environment Variables)

| Name | Required | Purpose |
| --- | --- | --- |
| `ADMIN_PASSWORD` | yes | Admin login |
| `ADMIN_SECRET` | yes | Signs the admin session cookie |
| `CRON_SECRET` | yes | Protects the daily cron endpoint (Vercel sends it automatically) |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical URL, e.g. `https://clicksemrus.vercel.app` |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | recommended | Persistent storage for posts, leads, analytics, settings. Added automatically when you connect Upstash Redis from the Vercel Storage tab (`KV_REST_API_URL`/`KV_REST_API_TOKEN` also work) |
| `ANTHROPIC_API_KEY` | optional | Richer AI-written trend articles |
| `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` | optional | Email notification for every lead |
| `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_CONTACT_EMAIL` | optional | Defaults for contact details (can also be set in Admin → Settings) |

Without a database the site works fully, but leads, analytics and manually written posts reset on each cold start. Connect Upstash Redis (free tier) to persist everything.

## Daily cron

`vercel.json` schedules `/api/cron/trending?limit=3` at 02:30 UTC (08:00 IST). It fetches Google Trends India and publishes up to 3 new posts. Toggle it in Admin → Settings.

## Local development

```bash
npm install
cp .env.example .env.local   # fill values
npm run dev
```

## Customising

- Brand details and services: `src/lib/site.ts`
- Evergreen seed articles: `src/content/seed-posts.ts`
- Trend article templates and topic classification: `src/lib/trending.ts`
- Auto-interlink keyword map: `src/lib/markdown.ts`
