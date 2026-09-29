# Wear the Feeling · Instagram launch, month 1

GOOOL ATHLETICS' first paid Instagram campaign. It runs on Instagram only and uses the "Wear the Feeling" idea: make them feel the goal first, then show the gear.

Claude Design, the owner's Chief Design Officer, is briefed as **Executive Creative Director** for this campaign.

Opened 2026-09-28. No ad has been published yet.

## What's here

| File or folder | What it is |
|---|---|
| `CLAUDE-DESIGN-PROMPTS.md` | Paste-ready prompts: the setup brief, the Ad 1 fix, Ads 1–3, plus the Meta Ads Manager copy and links for each ad |
| `assets/ad01/`, `assets/ad02/`, `assets/ad03/` | Each ad's attachments, copied under their original names. Drag the whole folder into Claude Design. Canonical files stay in `public/` and `goool advertising/`. |

## Week 1 so far

| # | Ad | Format | Product and landing page | Status |
|---|---|---|---|---|
| 1 | The Roar | 3-card carousel + 9:16 | Matchday Tee · `/shop/goool-athletics-modern-sport-performance-tee` | Sent to Claude Design, then the fix |
| 2 | Every Fan. One Word. | Single image, 4:5 + 9:16 | Core Capsule range · `/shop` | Prompt given |
| 3 | Put It On Before Kickoff. | Single image, 4:5 + 9:16 | Core Hoodie · Red, black · `/shop/goool-heavyweight-hoodie?color=Black` | Prompt given |

The research-backed target is **8–10 ads covering 6–8 distinct concepts**:
- 3 sound-on Reels
- 2 real-product statics
- 1 real-product carousel
- 1–2 atmosphere-led emotional pieces

Claude Design delivers still images. Reels need a video tool, and the owner decides which one.

## Rules every ad follows

- **Delivery claim:** "US delivery in 7–12 business days". That's what the site promises; never write 5–7. The standard trust line is "Secure checkout · US delivery in 7–12 business days · Limited drop".
- **9:16 safe box:** all text and the logo stay inside x 65–1015, y 270–1248 on 1080 x 1920.
- **Real product only:** use the store's own images, unaltered. They are renders, not photos of samples, so copy never says "photo" or "real shot".
- **AI images are for emotion and atmosphere only.** Meta labels ads with AI-generated photorealistic people as "AI info".
- **Blocked posts:** 08 The Leap, 09 The Rush and 10 For the Crowd show Nike or adidas marks, so they can't run until retouched. 02 The Strike is excluded.
- **Off limits:** the video commercial, until the owner approves it.
- **Words:** GOOOL is a soccer and futbol brand: "soccer" and "futbol" are both fine; never "football". No made-to-order wording. GOOOL always has three O's.

## Meta Ads Manager setup (week 1)

- **Campaign:**
  - Objective: Traffic, with the performance goal "Maximize landing page views". This works without a pixel; a Sales objective does not.
  - Name: `GOOOL_M1_FEEL_TRAFFIC-LPV_US_2026-10`. Never shorten "Wear the Feeling" to its initials.
- **Ad set:**
  - One ad set, US only, age 18+.
  - Advantage+ audience with suggestions: ages 18–44 and futbol-culture and streetwear interests.
  - Manual placements: Instagram Feed, Profile feed, Stories, Reels, Explore and Explore home.
- **Every ad:**
  - Use placement customisation: the 4:5 file for feed placements, the 9:16 file for Stories and Reels.
  - Turn **off** the Advantage+ creative enhancements: image expansion, background generation, overlays, text improvements, music, stickers, and touch-ups unless you've previewed them. Otherwise Meta can alter the real product images.
- **Tracking:** the full links in the prompts file carry UTM tags. Alternatively, paste the plain page link as the website URL and put everything after `?` into Tracking → URL parameters. Either works. Nothing on the site records UTMs today, so they are insurance for later.
- **Budget (owner decision):**

  | Plan | Per day | Week 1 | Month 1 |
  |---|---|---|---|
  | Lean | $25 | $175 | ~$750 |
  | Standard | $40 | $280 | $1,000–1,500 cap |
  | Push | $75 | $525 | ~$2,250 |

  Set a Meta account spending limit equal to the monthly cap. At about 25% contribution per order, month 1 is a capped launch investment, not first-order profit.
- **Edits:** none for days 0–7, except fixing broken links or disapprovals. Make all changes in one weekly batch.
- **Day-7 cull:** this applies only to ads with at least 1,000 impressions and $10–15 spend.
  - Pause an ad if its outbound CTR is under 0.6% **and** its cost per landing page view is more than 2× the median.
  - Keep an ad if its outbound CTR is at least 1.2% **and** its cost per landing page view is at or below the median.
  - Add 3–4 new concepts in the same batch.
- **Results:** with no pixel, read them from these four places:
  - Ads Manager landing page views
  - Stripe orders per day against the pre-ad baseline
  - GOOOL20 codes issued (the Mailchimp `goool20` tag) and redeemed (Stripe)
  - Instagram Insights

## Open owner decisions

- Daily budget and monthly cap
- Instagram handle, and whether the ad account is ready
- Which video tool makes the Reels
- Whether AI-rendered-shirt emotion images may run before a physical sample is photographed. Ad 1 card 1 is one.

Source research (2026-09-28): the workflow `wf_96a57196-7de` research phase covered brand and campaign, the creative inventory, Instagram ad practice and the store audit. Its plan-drafting stage did not finish; Ads 2–3 were built from its research. A second workflow, `wf_e8585691-9bb`, drafted Ad 3 concepts; it was stopped at the owner's request for a prompt straight away.
