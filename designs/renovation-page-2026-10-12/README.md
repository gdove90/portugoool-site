# Closed for renovation (2026-10-12)

Owner decision, 2026-10-12: every piece is being redesigned to remove the
lettering it currently carries, so goool.shop shows a "Closed for renovation"
page to the public. The full store stays open to the owner's team behind a
password.

- Mock-up shown to the owner: `renovation-mockup.html`, `mockup-*.png`.
- As built: `built-*.png` (`src/components/Gate.tsx` + `Gate.module.css`).
- Visual language is the live v84 site: Barlow Condensed 600 display, Inter
  body, ink/paper, V1.2 strike. No old wordmark artwork.

## How it works

- `src/middleware.ts` sends every request without the `goool_gate` cookie to
  `/gate`. Gated API calls get a 401 JSON instead of a redirect.
- `/api/preview` checks the password server-side against `PREVIEW_KEY`
  (case-insensitive) and sets the cookie for 30 days.
- Open without a password: Stripe and Apliiq callbacks, the deliver-emails
  and intake-maintenance scheduled functions (`/api/fulfillment-ops`,
  `/api/intake/maintenance`), `/print/`, the newsletter signup, order
  tracking and `/success`, legal pages, unsubscribe, fonts, icons, OG image.

## On / off

- On: `PREVIEW_KEY` set in Netlify's **production** context, then deploy.
- Off (reopen the store): delete `PREVIEW_KEY` from Netlify production and
  redeploy. Never put `PREVIEW_KEY` in a local `.env` used for a production
  build.
- Lock everyone out of existing sessions: bump `GATE_VERSION` in
  `src/lib/gate.ts` and redeploy.
