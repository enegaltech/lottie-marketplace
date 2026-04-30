# Lottie Catalog

Curated free Lottie animations bundled with this skill. **87 entries** seed; extend by adding rows to `catalog.json` and re-running `node scripts/enrich-catalog.js`.

Two source pools:
- **useAnimations** (CC-BY 4.0) — attribution required for commercial use. ~77 micro-icon animations, hosted on GitHub raw.
- **LottieFiles community** (Lottie Simple License) — commercial use allowed, attribution optional. ~10 entries from the public assets CDN.

## Categories

### loader (6)
- `ua-loading` — Loading Spinner
- `ua-loading2` — Loading Dots
- `ua-loading3` — Loading Pulse
- `lf-loader-bouncing-ball` — Bouncing Ball Loader
- `lf-loader-dots` — Three Dots Loader
- `lf-loader-circle` — Circle Spinner

### success (5)
- `ua-checkmark` — Animated Checkmark
- `ua-checkbox` — Animated Checkbox
- `ua-radio-button` — Radio Button
- `ua-toggle` — Toggle Switch
- `lf-success-confetti` — Success Confetti Burst

### error (4)
- `ua-error` — Error X Icon
- `ua-alert-circle` — Alert Circle
- `ua-alert-triangle` — Alert Triangle
- `ua-alert-octagon` — Alert Octagon

### empty-state (4)
- `ua-info` — Info Icon
- `ua-help` — Help Icon
- `ua-search` — Search to X Toggle
- `lf-empty-box` — Empty Box State

### social-share (16)
- `ua-heart`, `ua-bookmark`, `ua-thumb-up`, `ua-star`, `ua-share`, `ua-pocket`
- `ua-facebook`, `ua-twitter`, `ua-instagram`, `ua-linkedin`, `ua-github`, `ua-youtube`, `ua-youtube2`
- `ua-behance`, `ua-codepen`, `ua-dribbble`

### onboarding (43)
- Auth/account: `ua-mail`, `ua-lock`, `ua-user-plus`, `ua-user-minus`, `ua-user-x`
- Navigation: `ua-home`, `ua-explore`, `ua-arrow-up`, `ua-arrow-down`, `ua-arrow-up-circle`, `ua-arrow-down-circle`, `ua-arrow-left-circle`, `ua-arrow-right-circle`, `ua-scroll-down`
- Menus: `ua-menu`, `ua-menu2`, `ua-menu3`, `ua-menu4`, `ua-plus-to-x`
- Settings: `ua-settings`, `ua-settings2`, `ua-notification`, `ua-notification2`
- Media: `ua-play-pause`, `ua-play-pause-circle`, `ua-skip-back`, `ua-skip-forward`, `ua-volume`, `ua-microphone`, `ua-microphone2`, `ua-video`, `ua-video2`, `ua-airplay`
- Window: `ua-maximize-minimize`, `ua-maximize-minimize2`, `ua-zoom-in`, `ua-zoom-out`
- Visibility: `ua-visibility`, `ua-visibility2`
- Time: `ua-calendar`, `ua-activity`, `ua-infinity`
- Splash: `lf-onboarding-rocket` — Rocket Launch

### ecommerce (7)
- `ua-trash`, `ua-trash2`, `ua-download`, `ua-folder`, `ua-archive`, `ua-edit`, `ua-copy`

### payment (1)
- `lf-payment-card` — Credit Card Payment

### character (1)
- `lf-character-wave` — Character Waving

## Schema

Each entry in `catalog.json`:

```json
{
  "id": "ua-checkmark",
  "title": "Animated Checkmark",
  "category": "success",
  "tags": ["check","success","ok","done","complete"],
  "jsonUrl": "https://raw.githubusercontent.com/.../checkmark.json",
  "lottieUrl": null,
  "preview": "https://github.com/.../checkmark.json",
  "author": "useAnimations",
  "source": "github",
  "license": "CC-BY-4.0",
  "attributionRequired": true,
  "sizeKb": 1,
  "frames": 45,
  "duration": 1.5,
  "dimensions": { "w": 32, "h": 32 },
  "dominantColor": "#000000"
}
```

Metadata fields (`sizeKb`, `frames`, `duration`, `dimensions`, `dominantColor`) are auto-populated by `scripts/enrich-catalog.js`.

## Notes

- **Catalog miss → web fetch.** Skill auto-falls-back to LottieFiles search when the catalog has no good match.
- **License copy in generated code.** Skill writes a `// Source: <url> — <license>` header. CC-BY entries also get a ready-to-paste attribution string.
- **Adding entries.** Append a row to `catalog.json` (without metadata fields) and run `node scripts/enrich-catalog.js` to backfill them.
- **Replacing dead URLs.** When a `lottie.host` URL stops working (creator deletion), run `node scripts/extract-url.js <new-page-url>` to resolve a replacement, then update the catalog entry.
