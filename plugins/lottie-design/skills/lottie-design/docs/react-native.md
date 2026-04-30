# React Native Usage

Package: **`lottie-react-native`** (v7.x as of 2026). Bundles `lottie-ios` for iOS — no manual pod step required beyond `pod install`.

## Install

```bash
npm i lottie-react-native
# iOS
cd ios && pod install
```

Peer requirements (v7+):
- React 16.8+
- React Native 0.71+
- Works with Expo SDK 53+ (use `npx expo install lottie-react-native` to pin a compatible version).

## Remote URL

```tsx
import LottieView from 'lottie-react-native';

<LottieView
  source={{ uri: 'https://lottie.host/<uuid>/<id>.json' }}
  autoPlay
  loop
  style={{ width: 200, height: 200 }}
/>;
```

> Note: prefer `.json` over `.lottie` on RN — dotLottie support varies by version. Confirm with `lottie-react-native` release notes before shipping.

## Bundled asset

```tsx
<LottieView
  source={require('./assets/loader.json')}
  autoPlay
  loop
  style={{ width: 200, height: 200 }}
/>
```

## Imperative control

```tsx
import { useRef } from 'react';
import LottieView from 'lottie-react-native';

const ref = useRef<LottieView>(null);

<LottieView
  ref={ref}
  source={require('./success.json')}
  autoPlay={false}
  loop={false}
  onAnimationFinish={() => console.log('done')}
/>;

ref.current?.play();
ref.current?.reset();
ref.current?.play(30, 120); // play frames 30→120
```

## Caveats

- **Sizing**: always set `style.width` and `style.height` — Lottie won't size itself.
- **Android color overrides**: use `colorFilters` prop to tint layers by name.
- **Performance**: heavy animations (>1 MB) can drop frames on low-end Android. Convert to `.lottie` (offline tooling) or simplify the animation.
- **Hermes**: works fine — no special config.
- **Old Architecture vs New Architecture**: v7+ supports both.
