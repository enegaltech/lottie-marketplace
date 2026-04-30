# Enegal Marketplace

A Claude Code plugin marketplace by [Enegaltech](https://enegaltech.com). Currently hosts:

- **lottie-design** — free Lottie animation search + integration for React, React Native, Flutter, and Vanilla web.

## Install

In Claude Code:

```
/plugin marketplace add enegaltech/lottie-marketplace
/plugin install lottie-design@enegal-marketplace
```

## Update

```
/plugin marketplace update enegal-marketplace
```

## Structure

```
lottie-marketplace/
├── .claude-plugin/
│   └── marketplace.json          # marketplace manifest
└── plugins/
    └── lottie-design/
        ├── .claude-plugin/
        │   └── plugin.json       # plugin manifest
        ├── skills/
        │   └── lottie-design/    # the actual skill
        │       ├── SKILL.md
        │       ├── catalog.json
        │       ├── catalog.md
        │       ├── preview-template.html
        │       ├── templates/
        │       ├── scripts/
        │       └── docs/
        └── README.md
```

## License

- Marketplace metadata + skill code: MIT
- Bundled animation references inherit their upstream license (per-entry in `catalog.json`):
  - `ua-*` entries — CC-BY 4.0 (attribution required)
  - `lf-*` entries — Lottie Simple License (attribution optional)
