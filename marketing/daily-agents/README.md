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

**Consolidation 2026-10-28 (owner decision):** only 1/6 and 3/6 stay scheduled. 2/6, 4/6, 5/6 and 6/6 are paused at claude.ai/code/routines and preserved for on-demand use (run them from the routines page); none is deleted. 4/6 is repositioned as the GOAL Claude Creative QA & Second-Opinion Specialist (read-only Google Drive). The daily Instagram production, viral research, Higgsfield production and the owner's Daily Command Brief live in the separate GOAL ChatGPT systems. The continuous-learning layer is `marketing/learning/GOAL-OPERATING-KNOWLEDGE.md` plus `GOAL-EXPERIMENT-LEDGER.md`.

| Routine | State | Connector |
|---|---|---|
| 1/6 Performance & Consumer Intelligence | scheduled, `0 10 * * *` UTC | Metricool, read-only (4 tools) |
| 2/6 Marketing Director strategy | paused, on demand | none |
| 3/6 AEO, SEO & Ecommerce | scheduled, `30 11 * * *` UTC | none |
| 4/6 Creative QA & Second-Opinion Specialist | paused, on demand | Google Drive, read-only (4 tools) |
| 5/6 Higgsfield Video Specialist | paused, on demand | none |
| 6/6 Marketing Director owner brief | paused | none |

**Open scheduling task (not solved in this pass):** the routine cron is fixed UTC, so the two scheduled routines drift by an hour against America/New_York across daylight-saving changes (an hour late until 2026-11-01, then an hour early again from March 2027). Fix later with a timezone-aware schedule if the routine API gains one; otherwise edit the two cron lines at each change, never as part of another patch.

Each routine's message is `00-GLOBAL-RULES.md` followed by its role file. The live copies are at https://claude.ai/code/routines (edit, pause or delete there). Cron times are UTC and set for Eastern Standard Time (UTC-5); until DST ends on 2026-11-01 they run one hour later in local time, and in March 2027 they need moving back one hour.

Routine limits: no Instagram, Metricool, Meta Ads, Stripe or email access (agents write DATA NOT AVAILABLE); website and web research only. Nothing is posted, bought or emailed. Model: claude-sonnet-5-5. Environment: goal athletics. Repo: gdove90/portugoool-site.
