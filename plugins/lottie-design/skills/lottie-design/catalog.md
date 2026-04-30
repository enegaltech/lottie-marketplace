# Lottie Catalog

**140 verified entries** across 11 categories. Extend by adding rows to `catalog.json` and re-running `node scripts/enrich-catalog.js` to backfill metadata.

## Source pools

| Source | Count | License | Attribution |
|---|---|---|---|
| **useAnimations** (`ua-*`) | 79 | CC-BY 4.0 | ✅ Required |
| **LottieFiles community** (assets CDN, `lf-*` legacy) | 8 | Lottie Simple License | ⚪ Optional |
| **xvrh/lottie-flutter mirror** (`lf-*-*`) | 53 | Lottie Simple License (MIT mirror) | ⚪ Optional |

## Categories

### loader (25)
useAnimations: `ua-loading`, `ua-loading2`, `ua-loading3`
LottieFiles: `lf-loader-bouncing-ball`, `lf-loader-dots`, `lf-loader-circle`
Mirror: `lf-loader-bounching-ball-xvrh`, `lf-loader-cube`, `lf-loader-dna`, `lf-loader-glow`, `lf-loader-iphone`, `lf-loader-lego`, `lf-loader-disc`, `lf-loader-semicircle`, `lf-loader-material`, `lf-loader-material-2`, `lf-loader-material-wave`, `lf-loader-preloader`, `lf-loader-simple`, `lf-loader-slack`, `lf-loader-soda`, `lf-loader-spinner`, `lf-loader-splashy`, `lf-loader-trail`, `lf-loader-typing`

### success (9)
`ua-checkmark`, `ua-checkbox`, `ua-radio-button`, `ua-toggle`, `lf-success-confetti`, `lf-success-check-pop`, `lf-success-invite`, `lf-success-done`, `lf-success-qr-scan`

### error (7)
`ua-error`, `ua-alert-circle`, `ua-alert-triangle`, `ua-alert-octagon`, `lf-error-file`, `lf-error-no-internet`, `lf-error-x-pop`

### empty-state (5)
`ua-info`, `ua-help`, `ua-search`, `lf-empty-box`, `lf-empty-status`

### social-share (16)
`ua-heart`, `ua-bookmark`, `ua-thumb-up`, `ua-star`, `ua-share`, `ua-pocket`,
`ua-facebook`, `ua-twitter`, `ua-instagram`, `ua-linkedin`, `ua-github`, `ua-youtube`, `ua-youtube2`,
`ua-behance`, `ua-codepen`, `ua-dribbble`

### onboarding (53)
- **Auth**: `ua-mail`, `ua-lock`, `ua-user-plus`, `ua-user-minus`, `ua-user-x`, `lf-onboarding-touch-id`, `lf-onboarding-fingerprint`, `lf-onboarding-permission`, `lf-onboarding-notification`
- **Navigation**: `ua-home`, `ua-explore`, `ua-arrow-up`, `ua-arrow-down`, `ua-arrow-up-circle`, `ua-arrow-down-circle`, `ua-arrow-left-circle`, `ua-arrow-right-circle`, `ua-scroll-down`, `lf-onboarding-walking-arrow`
- **Menus**: `ua-menu`, `ua-menu2`, `ua-menu3`, `ua-menu4`, `ua-plus-to-x`
- **Settings**: `ua-settings`, `ua-settings2`, `ua-notification`, `ua-notification2`
- **Media**: `ua-play-pause`, `ua-play-pause-circle`, `ua-skip-back`, `ua-skip-forward`, `ua-volume`, `ua-microphone`, `ua-microphone2`, `ua-video`, `ua-video2`, `ua-airplay`, `lf-onboarding-play-pause`
- **Window**: `ua-maximize-minimize`, `ua-maximize-minimize2`, `ua-zoom-in`, `ua-zoom-out`
- **Visibility**: `ua-visibility`, `ua-visibility2`
- **Time**: `ua-calendar`, `ua-activity`, `ua-infinity`
- **Gestures**: `lf-onboarding-swipe`, `lf-onboarding-pull-refresh`
- **Location**: `lf-onboarding-location`, `lf-onboarding-location-marker`
- **Splash**: `lf-onboarding-rocket`

### ecommerce (11)
`ua-trash`, `ua-trash2`, `ua-download`, `ua-folder`, `ua-archive`, `ua-edit`, `ua-copy`,
`lf-ecom-rating`, `lf-ecom-trophy`, `lf-ecom-medal`, `lf-ecom-print`

### payment (6)
`lf-payment-card`, `lf-payment-credit-card`, `lf-payment-cash`, `lf-payment-money`, `lf-payment-wallet`, `lf-payment-iap`

### character (3)
`lf-character-wave`, `lf-character-walker`, `lf-character-penguin`

### weather (5)
`lf-weather-fog`, `lf-weather-hurricane`, `lf-weather-thunder`, `lf-weather-tornado`, `lf-weather-windy`

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
- **License copy in generated code.** Skill writes `// Source: <url> — <license>` header. CC-BY entries also get a ready-to-paste attribution string.
- **Mirror disclosure.** `github-mirror` source means the JSON is hosted in `xvrh/lottie-flutter` (MIT) but the animation itself was originally posted to lottiefiles.com under Lottie Simple License. Both licenses allow commercial use without attribution.
- **Adding entries.** Append a row to `catalog.json` (without metadata fields) and run `node scripts/enrich-catalog.js`.
- **Replacing dead URLs.** When a `lottie.host` URL stops working, run `node scripts/extract-url.js <new-page-url>` (best-effort; CF often blocks).
