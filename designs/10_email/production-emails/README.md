# Production Emails

Faithful records of every customer email that currently exists in
Mailchimp (folder **First Capsule Prelaunch**, audience **Goool Apparel
LLC** `8db4c1ea41`). **The Mailchimp drafts are the source of truth** —
edit there first, then mirror the change here.

| File | Campaign | When it sends |
|---|---|---|
| `01_welcome_youre-in.html` | "Email: You're in." | Automatically to every new signup, once the Welcome automation is turned on in Mailchimp |
| `02_launch_door-is-open.html` | "Email: The door is open." | **Never automatically.** Held as a draft; owner presses send on launch day when checkout opens |

Shared design: black `#0A0A0A` ground, white GOOOL wordmark header
(loaded live from goool.shop/brand/), red `#C1121F` eyebrow + pill
button, text-only 2x2 product grid with capsule prices, gray footer with
Mailchimp's real unsubscribe/preferences merge links and
hello@goool.shop. No stock photos, no em dashes, no discounts or
fake urgency.

Concept boards (signup UX, future order/shipping emails, owner
dashboard) live in `../mockups_email-experience/`. Future flows
(order confirmation, shipping, abandoned cart) get added here when
they actually exist in the sending system.
