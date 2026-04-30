# Vanilla Web Usage

Recommended (2026): **`<dotlottie-wc>` web component** from `@lottiefiles/dotlottie-wc`. Plays both `.json` and `.lottie`, no build step needed.

## Drop-in via CDN

```html
<script src="https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js" type="module"></script>

<dotlottie-wc
  src="https://lottie.host/<uuid>/<id>.lottie"
  autoplay
  loop
  style="width:300px;height:300px"
></dotlottie-wc>
```

## Imperative control

```html
<dotlottie-wc id="hero" src="..." style="width:300px;height:300px"></dotlottie-wc>
<button onclick="hero.play()">Play</button>
<button onclick="hero.pause()">Pause</button>
<button onclick="hero.stop()">Stop</button>

<script>
  const hero = document.getElementById('hero');
  hero.addEventListener('complete', () => console.log('finished'));
  hero.addEventListener('frame', (e) => console.log('frame', e.detail.currentFrame));
</script>
```

## Attributes

| Attribute | Notes |
|---|---|
| `src` | URL or relative path to `.json` / `.lottie` |
| `autoplay` | Boolean attribute |
| `loop` | Boolean or number |
| `speed` | `1` default |
| `mode` | `forward` \| `reverse` \| `bounce` \| `reverse-bounce` |
| `segment` | `"start,end"` frame range |

## Legacy `lottie-web` path

Only use `lottie-web` when you need bodymovin parity or are extending an existing pipeline:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
<div id="anim" style="width:300px;height:300px"></div>
<script>
  lottie.loadAnimation({
    container: document.getElementById('anim'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://lottie.host/<uuid>/<id>.json'
  });
</script>
```

## Self-host (no CDN)

```bash
npm i @lottiefiles/dotlottie-wc
```

```html
<script type="module" src="/node_modules/@lottiefiles/dotlottie-wc/dist/dotlottie-wc.js"></script>
```

Or bundle through Vite/Rollup if you have a build step.
