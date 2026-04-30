<div align="center">

# 🎬 Enegal Marketplace

### Claude Code'un en hızlı Lottie animasyon entegrasyonu

**Tek komutla** ücretsiz Lottie animasyonlarını React, React Native, Flutter veya Vanilla projene göm.
Arama, indirme, framework-spesifik kod üretimi, canlı preview — hepsi Claude'un içinden.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-orange)](https://docs.claude.com/claude-code)
[![Plugin Version](https://img.shields.io/badge/version-1.0.0-green.svg)](.claude-plugin/marketplace.json)
[![Lottie](https://img.shields.io/badge/Lottie-Free%20Animations-ff0066)](https://lottiefiles.com)

[Kurulum](#-kurulum) • [Neler Yapar](#-neler-yapar) • [Frameworkler](#-desteklenen-frameworkler) • [Katalog](#-katalog) • [Örnekler](#-örnekler) • [SSS](#-sss)

</div>

---

## 🚀 Kurulum

Claude Code'da iki satır yaz, gerisi otomatik:

```
/plugin marketplace add enegaltech/lottie-marketplace
/plugin install lottie-design@enegal-marketplace
```

Bitti. Artık Claude'a `"loading animation ekle"` deyip animasyonun projeye düşmesini izle.

---

## ⚡ Neler Yapar

> Senaryo: Müşterinin React projesinde "checkout sonrası başarı animasyonu" lazım. Eskiden 20 dakika.

**Eski yol** ❌
1. lottiefiles.com'a gir
2. Arat, ön izle, beğen
3. JSON indir, projeye taşı
4. lottie-react paketini ara
5. Component yaz
6. Width/height/loop ayarla
7. Lisans kontrol et
8. Compile, test et

**Yeni yol** ✅
> "checkout success animasyonu ekle"

Claude:
- 🔍 Katalogda **"success"** etiketli 3 animasyon önerir
- 🎯 Sen seçersin, doğru `lottie.host` URL'i çözer
- 📝 `@lottiefiles/dotlottie-react` snippet'i `src/components/animations/CheckoutSuccess.tsx` altına yazar
- 📦 Eksik dep varsa `npm i` komutunu söyler (otomatik kurmaz — sen onaylarsın)
- ⚖️ Lisans yorumu ekler (commercial use OK / attribution needed)
- 🖼️ İstersen `preview-CheckoutSuccess.html` üretir, browser'da test edersin

**Toplam süre: 30 saniye.**

---

## 🎨 Neler Animasyon Bulabilirsin

| Kategori | Örnekler |
|---|---|
| 🔄 **Loaders** | Spinner, dots, pulse, bouncing ball, circle |
| ✅ **Success** | Checkmark, checkbox, confetti burst |
| ❌ **Error** | X icon, alert circle, alert triangle |
| 📭 **Empty State** | Empty box, info icon, help, search |
| 🎉 **Onboarding** | Rocket launch, mail, lock, settings, notification, menu, hamburger |
| 💳 **Payment** | Credit card, checkout |
| 🛒 **E-commerce** | Trash, download, folder, archive, edit, copy |
| ❤️ **Social** | Heart, like, bookmark, thumb up, star, share, FB/TW/IG/LI/GH/YT logos |
| 👤 **Character** | Wave/greeting, person animations |
| 🎵 **Media** | Play/pause, volume, microphone, video |

**48 verified animasyon** + LottieFiles fallback (binlerce). Katalogda yoksa, Claude LottieFiles'tan canlı arar.

---

## 🛠️ Desteklenen Frameworkler

Skill her framework için canonical 2026 paketini kullanır. Tek bir kaynak animasyonu 4 farklı şekilde projene uydurur:

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
Paket: `@lottiefiles/dotlottie-react` (WASM, dotLottie native)

### 📱 React Native

```tsx
import LottieView from 'lottie-react-native';

<LottieView
  source={{ uri: 'https://lottie.host/<uuid>/<id>.json' }}
  autoPlay loop
  style={{ width: 200, height: 200 }}
/>
```
Paket: `lottie-react-native` v7+ (RN 0.71+, Expo SDK 53+)

### 🦋 Flutter

```dart
import 'package:lottie/lottie.dart';

Lottie.network(
  'https://lottie.host/<uuid>/<id>.json',
  width: 200, height: 200, repeat: true,
);
```
Paket: `lottie` v3.3+ (pure-Dart, iOS/Android/Web/Desktop)

### 🌐 Vanilla Web

```html
<script src="https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js" type="module"></script>

<dotlottie-wc
  src="https://lottie.host/<uuid>/<id>.lottie"
  autoplay loop
  style="width:300px;height:300px"
></dotlottie-wc>
```
Paket: `@lottiefiles/dotlottie-wc` web component (no build step)

---

## 📚 Katalog

48 verified entry, **iki lisans havuzu**:

| Pool | Adet | Lisans | Attribution |
|---|---|---|---|
| 🟢 **useAnimations** (`ua-*`) | 38 | CC-BY 4.0 | ✅ Required |
| 🔵 **LottieFiles community** (`lf-*`) | 10 | Lottie Simple License | ⚪ Optional |

Skill her zaman generated kodun başına lisans yorumu yazar. CC-BY entry seçersen ekstra "footer credit" hatırlatması yapar.

**Genişletmek mi istiyorsun?** `catalog.json`'a row ekle (schema `SKILL.md`'de) ve PR aç.

---

## 💡 Örnekler

### Örnek 1 — React app'e loader

> **Sen:** "react projeme bir loading animasyonu ekle, mavi tonlarda"

Claude katalogdan 3 spinner önerir → seçersin → `src/components/Loader.tsx` yazılır → `npm i @lottiefiles/dotlottie-react` komutu söylenir → preview HTML üretir → browser'da gösterir.

### Örnek 2 — Flutter splash

> **Sen:** "flutter splash screen için rocket lottie"

Claude `lf-onboarding-rocket` çözer → `lib/widgets/splash_animation.dart` yazılır → `pubspec.yaml`'a `lottie: ^3.3.2` eklenmesini söyler.

### Örnek 3 — Vanilla 404 page

> **Sen:** "404 sayfası için empty box animasyonu, sade html"

Claude `lf-empty-box` URL'i + `<dotlottie-wc>` snippet'i `404.html`'e gömer.

### Örnek 4 — Custom URL

> **Sen:** "şu lottiefiles URL'ini RN projeme ekle: https://lottiefiles.com/free-animation/heart-..."

CF blocklarsa "Get URL butonundan paste et" der → URL verince doğrudan component oluşturur.

---

## 🎯 Kullanım Senaryoları

- 🏗️ **MVP hızlandırma** — saatlerce animasyon arama yerine 30 sn
- 🎨 **Design system** — markanla uyumlu animasyon havuzu kurma
- 📲 **Cross-platform** — aynı animasyon, 4 framework, sıfır manuel taşıma
- 🛒 **E-commerce conversion** — checkout/empty-cart/success animasyonları
- 🎓 **Onboarding flows** — first-time user experience
- 🎬 **Marketing landing pages** — hero animasyonu < 1 dakikada
- 🐛 **Error states** — boring "Something went wrong" ekranları yerine character

---

## 🏗️ Yapı

```
lottie-marketplace/
├── .claude-plugin/marketplace.json    # marketplace manifest
└── plugins/lottie-design/
    ├── .claude-plugin/plugin.json     # plugin manifest
    └── skills/lottie-design/
        ├── SKILL.md                   # agent talimatları
        ├── catalog.json               # 48 verified entry
        ├── catalog.md                 # human-readable index
        ├── preview-template.html      # canlı preview base
        ├── templates/                 # 4 framework template
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
            └── search-strategy.md     # TR→EN keyword map
```

---

## 🆕 Update

Plugin yeni versiyonu çıkınca:

```
/plugin marketplace update enegal-marketplace
```

Tek komut, sıfır breaking change endişesi (semver).

---

## ❓ SSS

**Q: LottieFiles paid mı? Ücret var mı?**
A: Hayır. Sadece **free** animasyonlar. Skill premium URL'leri reddeder.

**Q: Cloudflare individual page'leri blokluyor — ne olacak?**
A: Skill bunu detect eder, sana "Get URL" butonundan paste etmeni söyler. Katalog ve search index zaten çalışıyor — çoğu durumda CF dert değil.

**Q: Animation custom yapabilir miyim?**
A: Şu an scope dışı. Skill **embed** odaklı, **author** değil. Custom Lottie için After Effects + Bodymovin lazım.

**Q: Production-ready mi?**
A: 48 katalog entry'sinin URL'i 200 dönüyor (test edildi). Ama LottieFiles community URL'leri creator silebilir — link rot riski var. CI ile aylık check eklenebilir.

**Q: Türkçe arama yapabilir miyim?**
A: Evet. `docs/search-strategy.md` TR→EN map içerir: "yükleniyor", "başarılı", "kalp", "roket"...

**Q: Başka skill ekleyecek misiniz?**
A: Yes — bu marketplace genişleyecek. Roadmap aşağıda.

---

## 🗺️ Roadmap

- [ ] **catalog v2**: 48 → 200+ entry (otomatik scrape + manuel curation)
- [ ] **CI link checker**: monthly URL health check
- [ ] **icon-design skill**: Lordicon, useAnimations icon library full coverage
- [ ] **animation-author skill**: Lottie JSON yazma asistanı (After Effects export pipeline)
- [ ] **figma-to-lottie**: Figma vector → Lottie export skill
- [ ] **preview gif export**: preview.html'i animated gif/mp4'e çevirme

---

## 📜 Lisans

- Marketplace metadata + skill kodu: **MIT** ([LICENSE](LICENSE))
- Animasyon referansları upstream lisansını miras alır:
  - `ua-*` entries → CC-BY 4.0
  - `lf-*` entries → Lottie Simple License

---

## 🤝 Katkı

PR'lar açık. Yeni katalog entry, framework template, skill — hepsi welcome.
Issue açmadan büyük değişiklik yapma.

**Maintained by [Enegaltech](https://enegaltech.com)** — `info@enegaltech.com`

<div align="center">

⭐ **Faydalıysa yıldız ver** — marketplace büyüsün diye

</div>
