# Vue Usage

Package: **`@lottiefiles/dotlottie-vue`** (Vue 3, WASM core, plays JSON + dotLottie). Works with Vite, Nuxt, Quasar.

## Install

```bash
npm i @lottiefiles/dotlottie-vue
```

## Minimal usage

```vue
<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
</script>

<template>
  <DotLottieVue
    src="https://lottie.host/<uuid>/<id>.lottie"
    autoplay
    loop
    :style="{ width: '200px', height: '200px' }"
  />
</template>
```

## With prop

```vue
<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

const props = withDefaults(defineProps<{ size?: number }>(), { size: 200 });
</script>

<template>
  <DotLottieVue
    src="https://lottie.host/<uuid>/<id>.lottie"
    autoplay
    loop
    :style="{ width: props.size + 'px', height: props.size + 'px' }"
  />
</template>
```

## Local asset (Vite)

```ts
import animation from '@/assets/loader.lottie?url';
```

Then bind:

```vue
<DotLottieVue :src="animation" autoplay loop />
```

## Imperative control

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import type { DotLottie } from '@lottiefiles/dotlottie-web';

const dotLottie = ref<DotLottie | null>(null);

function onReady(instance: DotLottie) {
  dotLottie.value = instance;
}
</script>

<template>
  <DotLottieVue
    src="..."
    :loop="false"
    :autoplay="false"
    @dotLottieReady="onReady"
  />
  <button @click="dotLottie?.play()">Play</button>
  <button @click="dotLottie?.stop()">Stop</button>
</template>
```

## Nuxt notes

`dotlottie-vue` is browser-only (WASM). In Nuxt:
```vue
<ClientOnly>
  <DotLottieVue ... />
</ClientOnly>
```
