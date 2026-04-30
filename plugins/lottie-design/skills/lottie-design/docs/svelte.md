# Svelte Usage

Package: **`@lottiefiles/dotlottie-svelte`** (WASM-based, plays JSON + dotLottie). SvelteKit and standalone Svelte both supported.

## Install

```bash
npm i @lottiefiles/dotlottie-svelte
# or pnpm add / yarn add / bun add
```

## Minimal usage

```svelte
<script lang="ts">
  import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
</script>

<DotLottieSvelte
  src="https://lottie.host/<uuid>/<id>.lottie"
  autoplay
  loop
  style="width: 200px; height: 200px;"
/>
```

## With component prop

```svelte
<script lang="ts">
  import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
  export let size: number = 200;
</script>

<DotLottieSvelte
  src="https://lottie.host/<uuid>/<id>.lottie"
  autoplay
  loop
  style="width: {size}px; height: {size}px;"
/>
```

## Local asset (Vite / SvelteKit)

```ts
import animation from '$lib/assets/loader.lottie?url';
```

```svelte
<DotLottieSvelte src={animation} autoplay loop />
```

## Imperative control

```svelte
<script lang="ts">
  import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
  import type { DotLottie } from '@lottiefiles/dotlottie-web';

  let dotLottie: DotLottie | null = null;

  function play() { dotLottie?.play(); }
  function stop() { dotLottie?.stop(); }
</script>

<DotLottieSvelte
  src="..."
  loop={false}
  autoplay={false}
  on:dotlottieReady={(e) => (dotLottie = e.detail)}
/>

<button on:click={play}>Play</button>
<button on:click={stop}>Stop</button>
```

## Notes

- SvelteKit SSR: dotlottie ships browser-only WASM. Wrap in `{#if browser}` or import dynamically.
- Bundle size: ~150 KB gzipped (WASM core).
