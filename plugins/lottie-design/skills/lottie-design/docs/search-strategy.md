# Search Strategy

How the skill picks an animation for a user request.

## Step 1 — Normalize query

Lowercase, strip punctuation, split into tokens. Detect language and translate non-English keywords to English search terms via these maps. If a token matches multiple languages, score against the dominant language of the rest of the prompt.

### Turkish (TR)

| TR | EN |
|---|---|
| yükleniyor / yüklenme / spinner / dönen | loading, spinner |
| başarılı / tamam / onay / başardı | success, check, ok |
| hata / başarısız / yanlış | error, fail |
| uyarı / dikkat | alert, warning |
| boş / yok / veri yok | empty, no-data |
| kalp / beğeni / sevgi | heart, like |
| yıldız / favori | star, favorite |
| roket / fırlatma | rocket, launch |
| ödeme / kart / fatura | payment, card, credit |
| sepet / mağaza | cart, ecommerce, store |
| menü / hamburger | menu, hamburger |
| kilit / şifre / güvenlik | lock, password, secure |
| bildirim / zil | notification, bell |
| sosyal / paylaş | share, social |
| posta / mail / e-posta | mail, email, envelope |
| ayarlar / dişli | settings, gear, config |
| arama / büyüteç | search, magnifier |
| oynat / duraklat | play, pause |
| ses / mikrofon | sound, microphone, audio |
| video / kamera | video, camera |
| indir / yükle (yüklemek) | download, upload |
| sil / çöp | delete, trash |
| selam / merhaba / el sallama | wave, hello, greet |
| onboarding / başlangıç / karşılama | onboarding, welcome |

### Spanish (ES)

| ES | EN |
|---|---|
| cargando / cargador | loading, spinner |
| éxito / completado / hecho | success, done, complete |
| error / fallo | error, fail |
| advertencia / alerta | warning, alert |
| vacío / sin datos | empty, no-data |
| corazón / me gusta | heart, like |
| estrella / favorito | star, favorite |
| cohete / lanzamiento | rocket, launch |
| pago / tarjeta | payment, card |
| carrito / tienda | cart, ecommerce |
| menú | menu |
| candado / contraseña | lock, password |
| notificación / campana | notification, bell |
| compartir / social | share, social |
| correo / email | mail, email |
| ajustes / configuración | settings, config |
| buscar / búsqueda | search |
| reproducir / pausa | play, pause |

### German (DE)

| DE | EN |
|---|---|
| laden / lädt | loading, spinner |
| erfolg / erfolgreich / fertig | success, done |
| fehler / fehlgeschlagen | error, fail |
| warnung / achtung | warning, alert |
| leer / keine daten | empty, no-data |
| herz / gefällt mir | heart, like |
| stern / favorit | star, favorite |
| rakete / start | rocket, launch |
| zahlung / karte | payment, card |
| warenkorb / einkaufswagen | cart, ecommerce |
| menü | menu |
| schloss / passwort | lock, password |
| benachrichtigung / glocke | notification, bell |
| teilen / sozial | share, social |
| post / e-mail | mail, email |
| einstellungen | settings |
| suche / suchen | search |
| abspielen / pause | play, pause |

### French (FR)

| FR | EN |
|---|---|
| chargement / chargeur | loading, spinner |
| succès / réussi / terminé | success, done |
| erreur / échec | error, fail |
| avertissement / alerte | warning, alert |
| vide / pas de données | empty, no-data |
| cœur / j'aime | heart, like |
| étoile / favori | star, favorite |
| fusée / lancement | rocket, launch |
| paiement / carte | payment, card |
| panier / boutique | cart, ecommerce |
| menu | menu |
| verrou / mot de passe | lock, password |
| notification / cloche | notification, bell |
| partager / social | share, social |
| courrier / email | mail, email |
| paramètres / réglages | settings |
| recherche / chercher | search |
| lire / pause | play, pause |

### Japanese (JA)

| JA | EN |
|---|---|
| 読み込み / ローディング / スピナー | loading, spinner |
| 成功 / 完了 / OK | success, done |
| エラー / 失敗 | error, fail |
| 警告 / 注意 | warning, alert |
| 空 / データなし | empty, no-data |
| ハート / いいね | heart, like |
| 星 / お気に入り | star, favorite |
| ロケット / 発射 | rocket, launch |
| 支払い / カード | payment, card |
| カート / ストア | cart, ecommerce |
| メニュー | menu |
| 鍵 / パスワード | lock, password |
| 通知 / ベル | notification, bell |
| 共有 / ソーシャル | share, social |
| メール | mail, email |
| 設定 | settings |
| 検索 | search |
| 再生 / 一時停止 | play, pause |

## Color name → hex map

If the user mentions a color in any supported language, resolve to a hex (or hue family) and match against each entry's `dominantColor` field. Score by HSL hue distance (±30° = strong, ±60° = weak, else 0).

| Hue family | Names (multi-lingual) | Reference hex |
|---|---|---|
| Red | red, kırmızı, rouge, rojo, rot, 赤 | `#E53935` |
| Pink | pink, pembe, rose, rosa, rosa, ピンク | `#EC407A` |
| Orange | orange, turuncu, oranje, naranja, オレンジ | `#FB8C00` |
| Yellow | yellow, sarı, jaune, amarillo, gelb, 黄色 | `#FDD835` |
| Green | green, yeşil, vert, verde, grün, 緑 | `#43A047` |
| Mint / teal | mint, teal, turkuaz, turquoise, ターコイズ | `#26A69A` |
| Cyan | cyan, açık mavi, cyan | `#00BCD4` |
| Blue | blue, mavi, bleu, azul, blau, 青 | `#1E88E5` |
| Indigo | indigo, lacivert, indigo | `#3F51B5` |
| Purple | purple, mor, violet, púrpura, lila, 紫 | `#8E24AA` |
| Magenta | magenta, fuşya, magenta | `#D81B60` |
| Brown | brown, kahverengi, marron, café, braun, 茶色 | `#795548` |
| Black | black, siyah, noir, negro, schwarz, 黒 | `#000000` |
| White | white, beyaz, blanc, blanco, weiß, 白 | `#FFFFFF` |
| Gray | gray, grey, gri, gris, grau, グレー | `#9E9E9E` |
| Gold | gold, altın, doré, dorado, gold, 金 | `#FFD700` |
| Silver | silver, gümüş, argent, plata, silber, 銀 | `#C0C0C0` |

**Hue family extraction**:
1. Convert the entry's `dominantColor` hex to HSL: `H ∈ [0,360)`, `S`, `L`.
2. If `S < 0.1` → entry is grayscale → only matches "white" / "black" / "gray" by `L` (≥0.85 white, ≤0.15 black, else gray).
3. Otherwise compute hue distance (modular): `min(|H_user − H_entry|, 360 − |H_user − H_entry|)`.
4. Strong match: ≤30°. Weak: ≤60°. Else: no match.

Score from this stage feeds the 0.2 color weight in Step 3 of the SKILL workflow.

---

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
