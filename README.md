<div align="center">

# Enegal Claude Lottie Marketplace

### The fastest way to ship Lottie animations from Claude Code

**Two commands** to drop free Lottie animations into React, React Native, Flutter, or Vanilla projects.
Search, fetch, framework-correct code, live preview — all from inside Claude.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-orange)](https://docs.claude.com/claude-code)
[![Plugin Version](https://img.shields.io/badge/version-1.0.0-green.svg)](.claude-plugin/marketplace.json)
[![Lottie](https://img.shields.io/badge/Lottie-Free%20Animations-ff0066)](https://lottiefiles.com)

[Install](#-install) • [What It Does](#-what-it-does) • [Frameworks](#-supported-frameworks) • [Catalog](#-catalog) • [Examples](#-examples) • [FAQ](#-faq)

</div>

---

## 🚀 Install

Two lines in Claude Code, the rest is automatic:

```
/plugin marketplace add enegaltech/lottie-marketplace
/plugin install lottie-design@enegal-marketplace
```

Done. Now say `"add a loading animation"` and watch it land in your project.

---

## ⚡ What It Does

> Scenario: a client's React app needs a "checkout success animation". Used to take 20 minutes.

**Old way** ❌
1. Open lottiefiles.com
2. Search, preview, pick one
3. Download JSON, move to project
4. Look up the right `lottie-react` package
5. Write the component
6. Tweak width / height / loop
7. Check the license
8. Compile and test

**New way** ✅
> "add a checkout success animation"

Claude:
- 📦 **Auto-installs** `@lottiefiles/dotlottie-react` upfront (detects pnpm/yarn/npm/bun)
- 🔍 Suggests 3 catalog entries tagged **`success`**
- 🎯 You pick one — it resolves the direct `lottie.host` URL
- 📝 Writes a `@lottiefiles/dotlottie-react` component to `src/components/animations/CheckoutSuccess.tsx` (TS or JS, auto-detected)
- 🧩 Standardized props: `<CheckoutSuccess size={160} />`
- ⚖️ Adds a license header + a ready-to-paste attribution string for CC-BY entries
- 🖼️ Offers `preview-CheckoutSuccess.html` and auto-opens it in the default browser

**Total time: 30 seconds.**

---

## 🎨 Animation Categories

| Category | Examples |
|---|---|
| 🔄 **Loaders** | Spinner, dots, pulse, bouncing ball, circle |
| ✅ **Success** | Checkmark, checkbox, confetti burst |
| ❌ **Error** | X icon, alert circle, alert triangle |
| 📭 **Empty State** | Empty box, info icon, help, search |
| 🎉 **Onboarding** | Rocket launch, mail, lock, settings, notification, menu |
| 💳 **Payment** | Credit card, checkout |
| 🛒 **E-commerce** | Trash, download, folder, archive, edit, copy |
| ❤️ **Social** | Heart, like, bookmark, thumb up, star, share, FB/TW/IG/LI/GH/YT logos |
| 👤 **Character** | Wave/greeting, person animations |
| 🎵 **Media** | Play/pause, volume, microphone, video |

**140 verified entries** across 11 categories + LottieFiles fallback (thousands more). If the catalog misses, Claude searches LottieFiles live.

---

## 🛠️ Supported Frameworks

The skill ships canonical 2026 packages for each platform. One source animation, four idiomatic integrations:

### ⚛️ React

```tsx
// Source: https://lottiefiles.com/animations/lf20_jbrw3hcz — Lottie Simple License
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function CheckoutSuccess() {
  return (
    <DotLottieReact
      src="https://assets5.lottiefiles.com/packages/lf20_jbrw3hcz.json"
      autoplay
      loop
      style={{ width: 200, height: 200 }}
    />
  );
}
```
Package: `@lottiefiles/dotlottie-react` (WASM, native dotLottie playback)

### 📱 React Native

```tsx
import LottieView from 'lottie-react-native';

<LottieView
  source={{ uri: 'https://lottie.host/<uuid>/<id>.json' }}
  autoPlay loop
  style={{ width: 200, height: 200 }}
/>
```
Package: `lottie-react-native` v7+ (RN 0.71+, Expo SDK 53+)

### 🦋 Flutter

```dart
import 'package:lottie/lottie.dart';

Lottie.network(
  'https://lottie.host/<uuid>/<id>.json',
  width: 200, height: 200, repeat: true,
);
```
Package: `lottie` v3.3+ (pure-Dart, iOS/Android/Web/Desktop)

### 🌐 Vanilla Web

```html
<script src="https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js" type="module"></script>

<dotlottie-wc
  src="https://lottie.host/<uuid>/<id>.lottie"
  autoplay loop
  style="width:300px;height:300px"
></dotlottie-wc>
```
Package: `@lottiefiles/dotlottie-wc` web component (no build step required)

---

## 📚 Catalog

140 verified entries across **two license pools**:

| Pool | Count | License | Attribution |
|---|---|---|---|
| 🟢 **useAnimations** (`ua-*`) | 79 | CC-BY 4.0 | ✅ Required |
| 🔵 **LottieFiles community** (`lf-*`) | 61 | Lottie Simple License | ⚪ Optional |

The skill always emits a license header comment in generated code. If you pick a CC-BY entry, it also reminds you to add a visible footer credit.

**Want to extend the catalog?** Append a row to `catalog.json` (schema documented in `SKILL.md`) and open a PR.

---

## 💡 Examples

### Example 1 — Loader for a React app

> **You:** "add a loading animation to my React app, blue tones"

Claude installs `@lottiefiles/dotlottie-react` → suggests 3 spinners from the catalog → you pick one → writes `src/components/animations/Loader.tsx` (or `.jsx` if no TS) with a standardized `size` prop → opens a preview HTML in your browser.

### Example 2 — Flutter splash screen

> **You:** "I need a rocket lottie for the Flutter splash screen"

Claude appends `lottie: ^3.3.2` to `pubspec.yaml` and runs `flutter pub get` → resolves `lf-onboarding-rocket` → writes `lib/widgets/splash_animation.dart` with `<RocketSplash size={240} />`.

### Example 3 — Vanilla 404 page

> **You:** "empty box animation for a 404 page, plain HTML"

Claude embeds `lf-empty-box` URL with a `<dotlottie-wc>` snippet directly into `404.html`.

### Example 4 — Custom URL

> **You:** "add this lottiefiles URL to my RN project: https://lottiefiles.com/free-animation/heart-..."

If Cloudflare blocks auto-resolve, the skill says "paste the URL from the Get URL button" → once you paste, it builds the component immediately.

---

## 🎯 Use Cases

- 🏗️ **MVP velocity** — 30 seconds instead of an hour of animation hunting
- 🎨 **Design systems** — build a brand-aligned animation library
- 📲 **Cross-platform** — same animation, four frameworks, zero manual porting
- 🛒 **E-commerce conversion** — checkout / empty-cart / success animations
- 🎓 **Onboarding flows** — first-time user experience polish
- 🎬 **Marketing landing pages** — hero animation in under a minute
- 🐛 **Error states** — replace boring "Something went wrong" screens with character

---

## 🏗️ Structure

```
lottie-marketplace/
├── .claude-plugin/marketplace.json    # marketplace manifest
└── plugins/lottie-design/
    ├── .claude-plugin/plugin.json     # plugin manifest
    └── skills/lottie-design/
        ├── SKILL.md                   # agent instructions
        ├── catalog.json               # 48 verified entries
        ├── catalog.md                 # human-readable index
        ├── preview-template.html      # live preview base
        ├── templates/                 # 4 framework templates
        │   ├── react.tsx.template
        │   ├── react-native.tsx.template
        │   ├── flutter.dart.template
        │   └── vanilla.html.template
        ├── scripts/
        │   ├── extract-url.js         # LF page → direct URL
        │   ├── generate-preview.js    # URL → preview.html
        │   └── fetch-lottie.sh        # page → downloaded JSON
        └── docs/                      # framework usage guides
            ├── react.md
            ├── react-native.md
            ├── flutter.md
            ├── vanilla.md
            └── search-strategy.md     # search heuristics + i18n keyword map
```

---

## 🆕 Update

When a new plugin version drops:

```
/plugin marketplace update enegal-marketplace
```

One command, semver-safe.

---

## ❓ FAQ

**Q: Are LottieFiles animations paid?**
A: No — only **free** animations. The skill rejects premium URLs.

**Q: Cloudflare blocks individual pages — what happens?**
A: The skill detects this and asks you to paste the URL from the **Get URL** button. The catalog and search index already work — CF is rarely a blocker.

**Q: Can I author custom animations?**
A: Out of scope. The skill is **embed**-focused, not **author**-focused. For custom Lottie you still need After Effects + Bodymovin.

**Q: Is it production-ready?**
A: All 48 catalog URLs return 200 (tested). LottieFiles community URLs can rot if creators delete them — a monthly CI link check is on the roadmap.

**Q: Can I search in non-English?**
A: Yes. `docs/search-strategy.md` includes a Turkish→English keyword map (`yükleniyor`, `başarılı`, `kalp`, `roket`...) and the pattern can be extended.

**Q: Will more skills be added?**
A: Yes — this marketplace will grow. Roadmap below.

---

## 🗺️ Roadmap

- [ ] **catalog v2**: 48 → 200+ entries (auto-scrape + manual curation)
- [ ] **CI link checker**: monthly URL health check
- [ ] **icon-design skill**: full Lordicon + useAnimations icon coverage
- [ ] **animation-author skill**: Lottie JSON authoring assistant (After Effects export pipeline)
- [ ] **figma-to-lottie**: Figma vector → Lottie export skill
- [ ] **preview gif export**: convert preview.html into animated GIF / MP4

---

## 📜 License

- Marketplace metadata + skill code: **MIT** ([LICENSE](LICENSE))
- Animation references inherit upstream licenses:
  - `ua-*` entries → CC-BY 4.0
  - `lf-*` entries → Lottie Simple License

---

## 🤝 Contributing

PRs welcome. New catalog entries, framework templates, or skills — all welcome.
Open an issue before large changes.

**Maintained by [Enegaltech](https://enegaltech.com)** — `info@enegaltech.com`

<div align="center">

⭐ **Star this repo** — help the marketplace grow

</div>
