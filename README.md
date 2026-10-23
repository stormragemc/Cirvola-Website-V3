# Cirvola website

Waste to wonder. The public website for Cirvola, built with [Next.js](https://nextjs.org) (App Router, TypeScript). Five pages plus legal pages:

| Page | What's on it |
| --- | --- |
| `/` Home | Hero, *What's happening* carousel (auto-fed from upcoming events), problem statistics with sources, the problem, the circular loop + before/after sliders, testimonials + real workshop ratings, programmes and impact, partner logos |
| `/events` | Request a programme / See upcoming sessions, then Workshops, Booths and public exhibitions, Funding, pitch programmes and competitions, and Impact and achievements (fast fade-in on scroll) |
| `/recipes` | **Idea Studio**: a visitor's valorisation idea → AI concept image, process diagram, animated storyboard (downloadable as video) and brief, emailed to Cirvola. Then **The Cirvola Cookbook** |
| `/lab` | **R&D Lab**: the Valorisation Bench game (28 discoveries + AI inventions), open briefs, lab notebook, Valorise It! game, valorisers network sign-up |
| `/about` | Horizontal clickable timeline (chapters + milestone posts), team, mentors |
| `/privacy`, `/terms` | PDPA privacy policy and terms (including idea-submission terms) |

The **Request a programme** button on every page opens a Gmail-style compose panel in the bottom-right. It sends a branded HTML email to `cirvola.zerowaste@gmail.com`, plus a confirmation copy to the sender.

## How it's built

- `content/*.ts`: **all the words, events, recipes, timeline, team and lab data.** Edit these to update the site. `[[text]]` shows as a dashed placeholder box.
- `app/`: one folder per page (`page.tsx`), the shared layout (`layout.tsx`), `not-found.tsx`, `sitemap.ts`, `robots.ts`, and `app/globals.css` (the whole design system).
- `components/`: React components. Interactive parts are client components (`'use client'`): the compose panel and header, the home carousel, loop and sliders, the Idea Studio and Cookbook, the Lab bench and join form, and the About timeline. Everything else renders to static HTML at build time.
- `app/api/*/route.ts`: the API routes (`enquiry`, `idea`, `join`, `visualize`, `lab-combine`). Shared server code is in `lib/server/`.
- `public/`: fonts (self-hosted Anybody + Hanken Grotesk, OFL) and images.

All pages are statically generated; only the API routes run on the server.

## Run it locally

```bash
npm install
cp .env.example .env.local    # then fill it in (see below)
npm run dev                   # → http://localhost:3000
```

Other scripts: `npm run build` and `npm start` (production build), `npm run lint`, `npm run typecheck`.

Put `MAIL_DRY_RUN=true` in `.env.local` to save emails to `.mail-outbox/` (`.eml` + an `.html` preview) instead of sending them. Without `ANTHROPIC_API_KEY`, the Idea Studio and Lab run in **demo mode** and draw sample sketches.

## Deploy (Vercel, free)

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → import the repo**. Vercel detects Next.js automatically; no build settings are needed.
3. Under **Settings → Environment Variables**, add:
   - `SITE_URL`: your live URL, e.g. `https://cirvola.vercel.app` (later your own domain)
   - `GMAIL_USER` = `cirvola.zerowaste@gmail.com`
   - `GMAIL_APP_PASSWORD`: see below
   - `ANTHROPIC_API_KEY`: from console.anthropic.com (turns on live AI)
   - optional: `ANTHROPIC_MODEL` (default `claude-sonnet-5-5`), `SEND_CONFIRMATION=false`, `CIRVOLA_INBOX`
4. Redeploy (`SITE_URL` is read at build time for canonical links and the sitemap). Then test the compose panel and Idea Studio on the live site.

**Gmail App Password:** sign in to cirvola.zerowaste@gmail.com → Google Account → Security → turn on 2-Step Verification → search "App passwords" → create one named "Website" → paste the 16 characters into `GMAIL_APP_PASSWORD`. Emails are sent from that Gmail account to itself, with Reply-To set to the visitor, so hitting Reply answers them directly.

> The Idea Studio makes three Claude calls per visualisation (brief, concept image, storyboard). With Sonnet, that's a few cents per idea. Set a monthly spend limit in the Anthropic console. The storyboard call can take 30–50 s, so `/api/visualize` sets `maxDuration = 60`.

## Before launch: placeholders and things to confirm

Anything we didn't know shows on the site as a **dashed orange box**. Find them all with:

```bash
grep -rn "\[\[" content/
```

Also confirm:

- **Partner logos and naming:** add official logo files for **Singapore Airlines** and **Resource Impactz** in `public/images/logos/` and set `logo:` in `content/home.ts`. Check every partner is happy to be shown, and that the SIA Charity Run booth can be named publicly before 14 Nov.
- **Testimonials:** three placeholders in `content/home.ts`. Use real quotes with permission, or delete the cards.
- **Team:** roles follow the latest (BSF) deck plus Gabriel. Lukas Ho and Jennifer Clarissa Ferianto appear in the older Hult deck; add them back in `content/about.ts` if they're still on the team. Confirm the portrait for Nicholas Wang.
- **Dates and venues:** events show month and year only (`date: 'YYYY-MM'` in `content/events.ts`). Still to confirm: the Resource Impactz workshop date and venue, the exact Clean & Green Singapore 2025 date, the Baby Shark Fund award month (listed as Sep 2026) and the Hult Prize round.
- **VJC numbers:** the home page (`ourNumbers` in `content/stats.ts`) and the Events impact section (`schoolImpact`) say about 200 VJC students took part. Confirm attendance before launch.
- **Recipes:** quantities for the calamansi bars, chocolate, candied peel and corn recipes.
- **About timeline:** "How we met" story, plus Srihari's restaurant detail.
- **Valorise It! URL:** `site.gameUrl` in `content/site.ts` still points to the temporary chatgpt.site host.
- **Phone:** +65 8168 7741 (from the BSF deck). The Hult deck had +65 9247 4508.
- **Legal:** add the registered entity name / UEN to `site.legalName` once incorporated, and have `/privacy` and `/terms` reviewed.

## Content rules (keep these)

- Every statistic carries a source link (`content/stats.ts`). Don't add numbers you can't back up.
- Plans stay plans: proposed dates say "to be confirmed", pilots say "proposed".
- No health, medical or disinfecting claims for eco-enzyme.
- Never suggest valorising plate leftovers for food.
- The eco-tour partner restaurant is not named.
- Budget / use-of-funds slides are not published.

## Packages

The site keeps its dependencies small. Packages are used where they make a component clearly better:

| Area | Package | Why |
| --- | --- | --- |
| Pages, routing, API routes | `next`, `react` | Static pages, client-side navigation, route handlers |
| Email (`lib/server/mail.ts`) | `nodemailer` | Battle-tested SMTP, MIME building, better errors. Resend is still supported over HTTP |
| Claude calls (`lib/server/anthropic.ts`) | `@anthropic-ai/sdk` | Typed responses and one retry on transient errors |
| SVG sanitising (`lib/server/anthropic.ts`) | `isomorphic-dompurify` | Proper parser-based sanitising of model SVG, followed by the external `url()` clean-up |

Kept as plain code on purpose, because a package would change how they look or behave: the carousel, before/after sliders, recipe dialogs (native `<dialog>`), scroll reveal and count-up animation. Images are plain `<img>` tags (not `next/image`) so they're served exactly as authored, and fonts are self-hosted with `@font-face` in `globals.css` (not `next/font`), so the font names used by the storyboard video export still work.

Still worth considering later: `@upstash/ratelimit` if spam appears (the current limiter is per server instance), and `zod` for request validation.
