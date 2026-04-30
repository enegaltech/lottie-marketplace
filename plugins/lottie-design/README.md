# lottie-design

Claude Code skill for finding and integrating free Lottie animations. By [Enegaltech](https://enegaltech.com).

## What it does

- Searches a curated catalog (~48 entries) plus LottieFiles fallback for free Lottie animations
- Generates framework-correct integration code for:
  - **React** (`@lottiefiles/dotlottie-react`)
  - **React Native** (`lottie-react-native` v7+)
  - **Flutter** (`lottie` pub.dev v3.3+)
  - **Vanilla web** (`@lottiefiles/dotlottie-wc` web component)
- Generates a standalone preview HTML for any Lottie URL
- License-aware: emits source comments and warns when attribution is required (CC-BY entries)

## Triggers

The skill activates automatically when you ask Claude for things like:

- "add a loading spinner Lottie to my React app"
- "splash animation Flutter"
- "success checkmark animation"
- "lottie ekle", "animasyon önizleme", ".lottie göm"

## Files

- `SKILL.md` — agent instructions
- `catalog.json` — curated metadata (48 verified animations: useAnimations + LottieFiles community)
- `templates/` — framework code templates
- `scripts/extract-url.js` — resolve a LottieFiles page URL to a direct `.lottie`/`.json` URL
- `scripts/generate-preview.js` — produce a standalone preview HTML
- `scripts/fetch-lottie.sh` — page URL → downloaded JSON
- `docs/` — per-framework usage guides + search strategy
- `preview-template.html` — base HTML for live previews

## Licenses

The catalog mixes two license pools — the skill emits the correct attribution per entry:

- **useAnimations** entries (`ua-*`) — CC-BY 4.0. Commercial use OK; attribution required.
- **LottieFiles community** entries (`lf-*`) — Lottie Simple License. Commercial use OK; attribution optional.

When the skill writes integration code, it adds a `// Source: <url> — <license>` comment. For CC-BY entries it also tells you to add a visible credit (e.g. footer).

## Caveats

- LottieFiles individual animation pages are usually behind a Cloudflare challenge. `extract-url.js` detects this and asks you to paste the `lottie.host` URL manually (use the **Get URL** button on the LottieFiles page).
- The catalog is a 48-entry seed. Extend by appending rows to `catalog.json` (schema documented in `SKILL.md`).
- The skill does not auto-install npm/pub dependencies — it surfaces the install command and lets you run it.
