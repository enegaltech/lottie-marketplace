# Search Strategy

How the skill picks an animation for a user request.

## Step 1 — Normalize query

Lowercase, strip punctuation, split into tokens. Detect language: Turkish keywords (`yükleniyor`, `başarılı`, `hata`, `kalp`, `roket`) → translate via this map:

| TR | EN |
|---|---|
| yükleniyor / yüklenme / spinner | loading, spinner |
| başarılı / tamam / onay | success, check, ok |
| hata / başarısız | error, fail |
| boş / yok | empty, no-data |
| kalp / beğeni | heart, like |
| roket / fırlatma | rocket, launch |
| ödeme / kart | payment, card, credit |
| sepet | cart, ecommerce |
| menü | menu, hamburger |
| kilit / şifre | lock, password |
| bildirim / zil | notification, bell |
| sosyal / paylaş | share, social |

## Step 2 — Score catalog entries

For each entry in `catalog.json`:
- `+3` per token that matches a `tags[]` element exactly
- `+2` if a token is a substring of `title`
- `+1` if a token equals `category`
- `0` otherwise

Sort desc. If the top score ≥ 3 → strong match, surface top 3.
If top score 1–2 → weak match, surface top 3 BUT also offer "search LottieFiles for more".
If top score 0 → skip catalog, go to Step 3.

## Step 3 — Web fallback

WebFetch the index page (these return 200):
```
https://lottiefiles.com/free-animations/<topic>     # e.g. /loading, /success, /error
```

Extract `/free-animation/<slug>` links from the response. Filter:
- MUST contain `/free-animation/`
- MUST NOT contain `/premium/` or `/pro/`

Take first 3 slugs. For each, run:
```
node scripts/extract-url.js https://lottiefiles.com/free-animation/<slug>
```

**Cloudflare reality check:** individual animation pages are usually behind a CF challenge. The script exits code 6 with a clear message. When that happens, tell the user to open the page in a browser, click **Get URL**, and paste the `lottie.host` URL — then proceed with that URL directly.

If you only need a quick win and the user wants something working *now*, prefer the catalog or the useAnimations GitHub mirror over fighting CF.

## Step 4 — Surface to user

Present 2–3 options compactly:

```
1. **Three Dots Loader** (loader)
   Preview: https://lottiefiles.com/animations/three-dots-loader-xyz
   Source: lottiefiles · Lottie Simple License (no attribution required)

2. **Bouncing Ball Loader** (loader)
   Preview: https://lottiefiles.com/animations/bouncing-ball-abc
   Source: lottiefiles · Lottie Simple License
```

Wait for user pick. If user says "first one" / "1" / "ok" / "use that", proceed with option 1.

## Step 5 — License-aware code generation

When filling templates:

- If entry `license` is `Lottie Simple License` and `attributionRequired` is `false`:
  - Header comment: `// Source: <pageUrl> — Lottie Simple License (commercial use allowed, attribution optional)`
  - `{{attributionNote}}` → empty string

- If entry `license` is `CC-BY-4.0` and `attributionRequired` is `true`:
  - Header comment: `// Source: <pageUrl> — CC-BY 4.0 (attribution required)`
  - `{{attributionNote}}` → ` (attribution: "<author>" required for commercial use)`
  - Tell the user: "this animation needs an attribution credit somewhere visible (e.g. footer)"

- For unknown licenses (web fetch results): default to Lottie Simple License header but warn the user to verify.

## Step 6 — Caching (optional)

If the user is searching repeatedly in the same session, cache resolved URLs in memory (skill state, not disk) to avoid re-scraping. No persistence between Claude sessions.

## Heuristics for picking framework

If user didn't specify, infer from cwd:
- `package.json` with `"react-native"` dep → React Native
- `package.json` with `"react"` dep but no RN → React
- `pubspec.yaml` exists → Flutter
- `index.html` at root, no package manager → Vanilla
- Multiple match (e.g. monorepo) → ASK the user.

## Anti-patterns

- ❌ Fabricating `lottie.host` UUIDs that "look real" — only use URLs returned by the catalog or `extract-url.js`.
- ❌ Skipping the license check.
- ❌ Inlining a multi-MB JSON into a source file.
- ❌ Recommending paid/premium animations.
- ❌ Auto-running `npm install` / `flutter pub add` without telling the user first.
