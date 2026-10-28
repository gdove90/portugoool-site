# GOAL daily Claude agent system (set up 2026-10-28)

Six Claude cloud routines run every morning in sequence, Eastern Time, and hand off through report files committed to the `daily-brief` branch of this repo (never main). The owner reads one brief at 8:00 AM.

| ET | Agent | Prompt file | Report file (marketing/daily-brief/YYYY-MM-DD/) |
|---|---|---|---|
| 5:00 AM | Performance & Consumer Intelligence | 01 | 01-performance-intelligence.md |
| 5:45 AM | Marketing Director, strategy run | 02 | 02-daily-strategy.md |
| 6:30 AM | AEO, SEO & Ecommerce | 03 | 03-search-ecommerce.md |
| 7:00 AM | Creative Director | 04 | 04-creative-package.md |
| 7:30 AM | Higgsfield Video Specialist | 05 | 05-video-plan.md |
| 8:00 AM | Marketing Director, owner brief | 06 | 06-OWNER-BRIEF.md |

Each routine's message is `00-GLOBAL-RULES.md` followed by its role file. The live copies are at https://claude.ai/code/routines (edit, pause or delete there). Cron times are UTC and set for Eastern Standard Time (UTC-5); until DST ends on 2026-11-01 they run one hour later in local time, and in March 2027 they need moving back one hour.

Routine limits: no Instagram, Metricool, Meta Ads, Stripe or email access (agents write DATA NOT AVAILABLE); website and web research only. Nothing is posted, bought or emailed. Model: claude-sonnet-5-5. Environment: goal athletics. Repo: gdove90/portugoool-site.
