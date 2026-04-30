# Flutter Usage

Package: **`lottie`** on pub.dev (v3.3.x as of 2026), maintained by `xvrh`. Pure-Dart renderer — no native plugin, works on iOS, Android, Web, macOS, Windows, Linux.

## Install

`pubspec.yaml`:
```yaml
dependencies:
  lottie: ^3.3.2
```

Then `flutter pub get`.

## Network URL

```dart
import 'package:lottie/lottie.dart';

Lottie.network(
  'https://lottie.host/<uuid>/<id>.json',
  width: 200,
  height: 200,
  fit: BoxFit.contain,
  repeat: true,
);
```

## Local asset

`pubspec.yaml`:
```yaml
flutter:
  assets:
    - assets/animations/loader.json
```

```dart
Lottie.asset('assets/animations/loader.json', width: 200, height: 200);
```

## Controlled animation

```dart
class Wave extends StatefulWidget {
  const Wave({super.key});
  @override
  State<Wave> createState() => _WaveState();
}

class _WaveState extends State<Wave> with TickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Lottie.network(
      'https://lottie.host/<uuid>/<id>.json',
      controller: _controller,
      onLoaded: (composition) {
        _controller
          ..duration = composition.duration
          ..forward();
      },
    );
  }
}
```

## dotLottie (.lottie) support

`lottie` v3+ supports dotLottie via `LottieBuilder` / `Lottie.asset` when the file extension is `.lottie`. For network:

```dart
Lottie.network('https://lottie.host/<uuid>/<id>.lottie');
```

## Caveats

- **Network caching**: `Lottie.network` caches per Dart isolate. For persistent disk cache, wrap with your own `flutter_cache_manager` integration.
- **Web build**: works, but very large animations (>500 KB JSON) may degrade frame rate. Use `.lottie` (compressed) when possible.
- **No image/audio asset support inline**: external image refs in JSON require `imageProviderFactory` callback.
