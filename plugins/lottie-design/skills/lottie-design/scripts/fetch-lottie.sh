#!/usr/bin/env bash
# fetch-lottie.sh — resolve a lottiefiles.com page URL and download the JSON/lottie.
# Usage: ./fetch-lottie.sh <lottiefiles-page-url> <output-path>
# Example: ./fetch-lottie.sh https://lottiefiles.com/free-animation/loader-xyz ./loader.json

set -euo pipefail

PAGE_URL="${1:-}"
OUT_PATH="${2:-}"

if [ -z "$PAGE_URL" ] || [ -z "$OUT_PATH" ]; then
  echo "Usage: $0 <lottiefiles-page-url> <output-path>" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIRECT_URL="$(node "$SCRIPT_DIR/extract-url.js" "$PAGE_URL")"

if [ -z "$DIRECT_URL" ]; then
  echo "Could not resolve direct URL for $PAGE_URL" >&2
  exit 3
fi

echo "Resolved: $DIRECT_URL"
curl -sL --fail "$DIRECT_URL" -o "$OUT_PATH"
echo "Saved $(wc -c < "$OUT_PATH") bytes to $OUT_PATH"
echo "Source: $PAGE_URL — Lottie Simple License (free animations on lottiefiles.com)"
