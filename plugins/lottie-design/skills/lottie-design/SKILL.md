---
name: lottie-design
description: Search, fetch, and integrate free Lottie animations into React, React Native, Flutter, and Vanilla web projects. Use when the user asks for any Lottie/dotLottie/animation work — loaders, success checkmarks, splash screens, empty states, onboarding, micro-interactions. Triggers on keywords like "lottie", "dotlottie", ".lottie", "animasyon ekle", "splash animation", "loader animation", "success animation", "empty state animation".
---

# Lottie Design Skill

You help the user find free Lottie animations and embed them in their project with framework-correct code.

## When to use this skill

Trigger on any of:
- Explicit keywords: `lottie`, `dotlottie`, `.lottie`, `lottiefiles`
- Animation needs paired with framework: "loading spinner for my React app", "splash animation Flutter", "404 empty state animation"
- User pastes a `lottiefiles.com` URL or `lottie.host` URL

Do NOT trigger for:
- CSS animations / Framer Motion / GSAP requests (different domain)
- SVG sprite work
- User asking you to *author* a Lottie JSON from scratch (out of scope — tell them this skill embeds existing animations only)

## Files in this skill

```
SKILL.md                       this file
catalog.json                   curated metadata (id, title, tags, category, jsonUrl, lottieUrl, source, license)
catalog.md                     human-readable category index
templates/
  react.tsx.template           @lottiefiles/dotlottie-react snippet
  react-native.tsx.template    lottie-react-native v7 snippet
  flutter.dart.template        lottie pub.dev v3 snippet
  vanilla.html.template        @lottiefiles/dotlottie-wc snippet
scripts/
  extract-url.js               Node: lottiefiles.com page → lottie.host JSON URL
  generate-preview.js          Node: JSON/lottie URL → standalone preview HTML
  fetch-lottie.sh              bash: page URL → download JSON to disk
docs/
  react.md, react-native.md, flutter.md, vanilla.md, search-strategy.md
preview-template.html          base HTML for live preview
```

## Workflow

### Step 1 — Identify need + framework

Ask the user (or infer from project files):
- What animation? ("loading spinner", "success checkmark", "empty cart", "rocket launch")
- Which framework? Detect from `package.json` (react, react-native), `pubspec.yaml` (flutter), or plain HTML.
- Size + behavior (autoplay/loop/hover-trigger/once).

If both are clear from the message, skip the question.

### Step 2 — Search for animation

**Search order (stop at first good match):**

1. **Catalog first.** Read `catalog.json`. Filter by `tags` and `category` against the user's keywords. Score matches by tag overlap. If you find ≥1 strong match, surface up to 3 options to the user with `title`, `category`, `preview` page URL.

2. **Catalog miss → LottieFiles search index.** Use WebFetch on `https://lottiefiles.com/free-animations/<topic>` (e.g. `/loading`, `/success`). The index page returns 200 and lists `/free-animation/<slug>` links. Extract 3–5 candidate slugs.

3. **Resolve direct URL** (best-effort). Run `node scripts/extract-url.js https://lottiefiles.com/free-animation/<slug>`. **Note:** individual animation pages are often gated by Cloudflare and return a challenge. The script detects this and exits with code `6`. When that happens:
   - Tell the user: "Cloudflare blocked auto-resolve. Open <pageUrl> in a browser, click the **Get URL** button next to the animation, and paste the `lottie.host` URL here."
   - When they paste the URL, skip directly to Step 4.

4. **LottieFiles down or CF-blocked → useAnimations fallback.** Use the catalog's `ua-*` entries (already curated). For names not in the catalog, the URL pattern is `https://raw.githubusercontent.com/useAnimations/react-useanimations/master/src/lib/<camelCaseName>/<camelCaseName>.json`. License is CC-BY 4.0 (attribution required).

Show the user 2–3 options with title + preview link. Wait for their pick unless they said "just pick the best one".

### Step 3 — Resolve direct URL

For the chosen animation:
- If `lottieUrl` (dotLottie) is available, prefer it over `jsonUrl` (smaller, faster).
- Validate the URL is reachable: `curl -sI <url>` should return 200 and a sensible content-type (`application/json`, `application/zip`, or `application/octet-stream`).

### Step 4 — Generate code

Read `templates/<framework>.template` and fill placeholders:
- `{{src}}` — direct URL (lottie.host preferred)
- `{{sourceUrl}}` — original lottiefiles.com page (for the license comment)
- `{{componentName}}` — PascalCase derived from animation title (e.g. `SuccessCheckAnimation`)
- `{{width}}`, `{{height}}` — default 200, override if user specified

Write the rendered code to a sensible path in the user's project. For React/RN, place under `src/components/animations/` or wherever the project's components live (detect via existing structure). For Flutter, under `lib/widgets/`. For vanilla, just print the snippet or write to a standalone HTML file.

### Step 5 — Dependency check (do NOT auto-install)

After writing the component, check the project's manifest:
- React: `package.json` has `@lottiefiles/dotlottie-react`?
- React Native: `package.json` has `lottie-react-native` ≥7.0?
- Flutter: `pubspec.yaml` has `lottie:` ≥3.0?
- Vanilla: no install needed (script tag CDN).

If missing, **tell the user the install command** but do NOT run it. Example: `npm i @lottiefiles/dotlottie-react`.

### Step 6 — Optional preview

If the user asks "preview" / "test it" / "show how it looks":
```
node scripts/generate-preview.js <jsonOrLottieUrl> <name>
```
This writes `preview-<name>.html` to the cwd. Tell the user to open it in a browser.

## Rules

- **No premium animations.** If a URL contains `/premium/` or the page indicates "Pro" / "Paid", skip it and find a free alternative.
- **Always include a license comment** at the top of generated files: `// Source: <pageUrl> — Lottie Simple License (commercial use allowed, attribution optional).`
- **Prefer dotLottie over JSON** for production (smaller payload).
- **Don't inline JSON > 50KB into source files.** Always use a URL or place under a static assets folder.
- **Don't run npm/yarn/pub install yourself.** Suggest the command and let the user run it.
- **Don't fabricate `lottie.host` URLs.** If you can't resolve a real URL via the catalog or `extract-url.js`, say so and ask the user to paste a LottieFiles page link.
- **License copyleft note**: if the user *modifies* an animation, the modified file must retain the Lottie Simple License. Mention this once if the user asks about editing.

## Catalog usage notes

- The catalog is a curated starter set, not exhaustive. ~150 entries across 10 categories.
- If a catalog entry's URL stops working, fall back to web fetch and update the entry inline (edit `catalog.json`).
- Categories: `loader`, `success`, `error`, `empty-state`, `onboarding`, `social-share`, `payment`, `ecommerce`, `weather`, `character`.

See `docs/search-strategy.md` for detailed matching heuristics, and `docs/<framework>.md` for advanced per-framework usage (controllers, segments, hover triggers, asset bundling).
