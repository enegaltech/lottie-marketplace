# React Usage

Recommended package (2026): **`@lottiefiles/dotlottie-react`** (WASM-based, plays both `.json` and `.lottie`). The older `lottie-react` redirects to it.

## Install

```bash
npm i @lottiefiles/dotlottie-react
# or
pnpm add @lottiefiles/dotlottie-react
```

## Minimal usage

```tsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function Loader() {
  return (
    <DotLottieReact
      src="https://lottie.host/<uuid>/<id>.lottie"
      autoplay
      loop
      style={{ width: 200, height: 200 }}
    />
  );
}
```

## Imperative control with `dotLottieRefCallback`

```tsx
import { useState } from 'react';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';

export function HoverPlay({ src }: { src: string }) {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

  return (
    <div
      onMouseEnter={() => dotLottie?.play()}
      onMouseLeave={() => dotLottie?.stop()}
    >
      <DotLottieReact
        src={src}
        loop={false}
        autoplay={false}
        dotLottieRefCallback={setDotLottie}
        style={{ width: 96, height: 96 }}
      />
    </div>
  );
}
```

## Local asset (Vite/Webpack)

Drop the `.json` or `.lottie` file under `src/assets/` and import it:

```tsx
import animation from './assets/loader.lottie?url'; // Vite

<DotLottieReact src={animation} autoplay loop />;
```

## Common props

| Prop | Type | Notes |
|---|---|---|
| `src` | `string` | URL or imported asset URL |
| `autoplay` | `boolean` | Default `false` |
| `loop` | `boolean \| number` | `true` = forever, number = N times |
| `speed` | `number` | 1.0 = normal |
| `mode` | `'forward' \| 'reverse' \| 'bounce' \| 'reverse-bounce'` | |
| `segment` | `[number, number]` | Frame range |

## Bundle size note

`@lottiefiles/dotlottie-react` ships a WASM core (~150 KB gzipped). For projects that already pull in `lottie-web` and don't need dotLottie playback, sticking with `lottie-web` is fine — but new projects should default to dotlottie-react.
