# Lottie Catalog

Curated free Lottie animations bundled with this skill. 48 entries seed; extend by adding rows to `catalog.json`.

Two source pools:
- **useAnimations** (CC-BY 4.0) — attribution required for commercial use. ~38 micro-icon animations, hosted on GitHub raw.
- **LottieFiles community** (Lottie Simple License) — commercial use allowed, attribution optional. ~10 entries from the public assets CDN.

## Categories

### loader (6)
- `ua-loading` — Loading Spinner
- `ua-loading2` — Loading Dots
- `ua-loading3` — Loading Pulse
- `lf-loader-bouncing-ball` — Bouncing Ball Loader
- `lf-loader-dots` — Three Dots Loader
- `lf-loader-circle` — Circle Spinner

### success (3)
- `ua-checkmark` — Animated Checkmark
- `ua-checkbox` — Animated Checkbox
- `lf-success-confetti` — Success Confetti Burst

### error (3)
- `ua-error` — Error X Icon
- `ua-alert-circle` — Alert Circle
- `ua-alert-triangle` — Alert Triangle

### empty-state (4)
- `ua-info` — Info Icon
- `ua-help` — Help Icon
- `ua-search` — Search to X Toggle
- `lf-empty-box` — Empty Box State

### social-share (11)
- `ua-heart`, `ua-bookmark`, `ua-thumb-up`, `ua-star`, `ua-share`
- `ua-facebook`, `ua-twitter`, `ua-instagram`, `ua-linkedin`, `ua-github`, `ua-youtube`

### onboarding (13)
- `ua-mail`, `ua-lock`, `ua-user-plus`, `ua-user-minus`
- `ua-settings`, `ua-notification`, `ua-menu`, `ua-play-pause`
- `ua-volume`, `ua-microphone`, `ua-video`, `ua-visibility`
- `lf-onboarding-rocket` — Rocket Launch

### ecommerce (6)
- `ua-trash`, `ua-download`, `ua-folder`, `ua-archive`, `ua-edit`, `ua-copy`

### payment (1)
- `lf-payment-card` — Credit Card Payment

### character (1)
- `lf-character-wave` — Character Waving

## Notes

- **Catalog miss → web fetch.** The skill auto-falls-back to LottieFiles search when the catalog has no good match.
- **License copy in generated code.** Skill writes a `// Source: <url> — <license>` header. For CC-BY entries, an attribution string belongs near the rendered animation (e.g. footer credit) per CC-BY terms.
- **Adding entries.** Append a row to `catalog.json` with the schema in `SKILL.md`. Verify reachability with `curl -sI <jsonUrl>`.
- **Replacing dead URLs.** Some `lottie.host` URLs change when creators delete originals. If a fetch fails, run `node scripts/extract-url.js <new-page-url>` to resolve a replacement.
