# Recording a Demo GIF

The README ships an SVG hero (`assets/hero.svg`). For a real animated demo (Reddit, Product Hunt), record a short GIF and replace it.

## Recommended tools

- **Windows**: ScreenToGif (free, fast). https://www.screentogif.com/
- **macOS**: Kap (free). https://getkap.co/
- **Linux**: peek. `apt install peek`
- **Cross-platform terminal**: asciinema → `agg` to convert to GIF.

## Recording script

Open Claude Code in a terminal sized to **900×500** (matches hero SVG aspect). Then capture this 30-second flow:

1. Start with an empty Vite React project (terminal at `~/demo-app`).
2. Type:
   ```
   /plugin install lottie-design@enegal-marketplace
   ```
   Show the install confirmation.
3. New prompt:
   ```
   add a checkout success animation
   ```
4. Watch the skill: catalog hits, gallery opens, you pick option 1, dep installs, component written, browser opens with the preview.
5. End with the green success line.

## Post-processing

- Trim to ≤ 15 seconds for Reddit (anything longer auto-converts to video).
- Cap width at 800px, 12-15 fps. Target file size < 5 MB.
- Save as `assets/demo.gif`.

## Updating the README

Replace this in `README.md`:

```md
<img src="assets/hero.svg" alt="Lottie Design Skill demo" width="900"/>
```

with:

```md
<img src="assets/demo.gif" alt="Lottie Design Skill demo" width="800"/>
```

Commit and push. Reddit / X / dev.to will then auto-render the GIF inline.
