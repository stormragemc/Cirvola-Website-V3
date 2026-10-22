# Notes for Claude Code

Cirvola's public website. Read README.md first.

## Architecture
- Next.js App Router + TypeScript. Every page is statically generated; only `app/api/*` runs on the server.
- Content lives in `content/*.ts`. Change words there, not in components. `[[text]]` renders as a visible dashed placeholder (`<Txt>` in `components/Text.tsx`).
- Pages: `app/<page>/page.tsx`. Shared layout (header, footer, compose panel): `app/layout.tsx`. Interactive pieces are client components in `components/`.
- Forms are uncontrolled; `lib/forms.ts` holds the shared submit/validation helpers (same messages everywhere).
- API route handlers in `app/api/*/route.ts`; shared server code in `lib/server/`. `MAIL_DRY_RUN=true` writes emails to `.mail-outbox/`.
- With no `ANTHROPIC_API_KEY`, `/api/visualize` and `/api/lab-combine` return demo output from `lib/server/demo.ts`.
- Images are plain `<img>` and fonts are `@font-face` in `app/globals.css` on purpose (see README, Packages).
- When JSX mixes text and values in one run, build a single string (`{`Source: ${name}`}`), so the text renders as one node exactly like the static markup did.

## Design system (keep consistent)
- Colours (`app/globals.css` `:root`): cream #fcf9f4, paper #f3eee3, sage #dce4d2, forest #103d2c, moss #48654b, leaf #24734f, ink #17291d, zest #f7a928 (primary buttons/accents), peel #e07609 (decoration), peel-ink #a65200 (small orange text, AA contrast).
- Type: Anybody (variable width 50–150%) for display, usually `font-stretch: 72–85%`, weight 800+. Hanken Grotesk for text. The signature move is width as meaning: squeezed thin "waste" → wide black "wonder".
- Motion follows Emil Kowalski's rules: custom ease-out curves (`--ease-out`), UI transitions under 300 ms, `scale(0.97)` on press, never animate from scale(0), hover effects gated behind `(hover: hover)`, everything respects `prefers-reduced-motion`. One orchestrated moment per page (the hero bloom); scroll fade-ins only on /events, by request.
- Sentence case everywhere. No all-caps eyebrow labels, no "→" appended to button text, no `A · B · C` meta strings.

## Content guardrails
- Stats need a source. Plans stay plans. No eco-enzyme health claims. No plate-leftover valorisation. Don't name the eco-tour host restaurant. Don't publish budget allocations.
- Testimonials must be real and permitted.

## npm policy
Use a package only when it makes that component clearly better. See the Packages table at the end of README.md.
