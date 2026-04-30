# Angular Usage

Package: **`ngx-lottie`** + peer **`lottie-web`**. Standalone-component compatible. Angular 17+ recommended.

## Install

```bash
npm i ngx-lottie lottie-web
```

## Configure (standalone bootstrap)

`main.ts`:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideLottieOptions({ player: () => player }),
  ],
});
```

Or in `app.config.ts` if you use that pattern.

## Component usage

```ts
import { Component, Input } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [LottieComponent],
  template: `
    <ng-lottie
      [options]="options"
      [styles]="{ width: size + 'px', height: size + 'px' }"
    />
  `,
})
export class LoaderComponent {
  @Input() size = 200;

  options: AnimationOptions = {
    path: 'https://lottie.host/<uuid>/<id>.json',
    autoplay: true,
    loop: true,
  };
}
```

## Local asset

Place under `src/assets/animations/loader.json` and reference:

```ts
options: AnimationOptions = {
  path: '/assets/animations/loader.json',
  autoplay: true,
  loop: true,
};
```

## Imperative control

```ts
import { AnimationItem } from 'lottie-web';

@Component({ /* ... */ })
export class LoaderComponent {
  private anim?: AnimationItem;

  onAnimate(item: AnimationItem) {
    this.anim = item;
  }

  play() { this.anim?.play(); }
  stop() { this.anim?.stop(); }
}
```

```html
<ng-lottie [options]="options" (animationCreated)="onAnimate($event)" />
```

## Notes

- `ngx-lottie` wraps `lottie-web` (Bodymovin renderer); for native dotLottie playback prefer the web component `@lottiefiles/dotlottie-wc` mounted in a passthrough Angular component.
- Lazy-load the player to keep initial bundle small: `provideLottieOptions({ player: () => import('lottie-web').then(m => m.default) })`.
