#!/usr/bin/env node
// extract-url.js — resolve a lottiefiles.com page URL to a direct .json/.lottie URL.
// Usage: node extract-url.js <lottiefiles-page-url>
// Stdout: a single direct URL on success, exit 0.
// Stderr + exit 1 on failure.

const pageUrl = process.argv[2];
if (!pageUrl) {
  console.error('Usage: node extract-url.js <lottiefiles-page-url>');
  process.exit(2);
}

if (pageUrl.includes('/premium/')) {
  console.error('Refusing premium animation. Free animations only.');
  process.exit(3);
}

const { spawnSync } = require('child_process');

function fetchHtml(url) {
  const result = spawnSync(
    'curl',
    [
      '-sL',
      '--max-time', '20',
      '-A',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      '-H', 'Accept-Language: en-US,en;q=0.9',
      '-H', 'Sec-Fetch-Dest: document',
      '-H', 'Sec-Fetch-Mode: navigate',
      '-H', 'Sec-Fetch-Site: none',
      '-H', 'Upgrade-Insecure-Requests: 1',
      url,
    ],
    { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 },
  );
  if (result.status !== 0) {
    throw new Error(`curl exit ${result.status}: ${result.stderr}`);
  }
  return result.stdout;
}

(async () => {
  try {
    const html = fetchHtml(pageUrl);
    if (!html || html.length < 500) {
      console.error('Fetch returned empty/short response (possibly blocked).');
      process.exit(4);
    }

    // Cloudflare challenge detection — common on individual lottiefiles.com pages.
    if (
      /Just a moment\.\.\.|cf_chl_opt|challenges\.cloudflare\.com|cf-mitigated/i.test(
        html,
      )
    ) {
      console.error(
        'Blocked by Cloudflare challenge. Open the page in a browser, click the "Get URL" button on the animation, and paste the lottie.host URL directly.',
      );
      process.exit(6);
    }

    // Strategy 1 — parse __NEXT_DATA__ JSON.
    const nextMatch = html.match(
      /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
    );
    if (nextMatch) {
      try {
        const data = JSON.parse(nextMatch[1]);
        const candidates = [];
        const walk = (obj) => {
          if (!obj || typeof obj !== 'object') return;
          for (const [k, v] of Object.entries(obj)) {
            if (
              typeof v === 'string' &&
              (v.endsWith('.json') || v.endsWith('.lottie')) &&
              (v.includes('lottie.host') || v.includes('lottiefiles.com'))
            ) {
              candidates.push({ key: k, url: v });
            } else if (typeof v === 'object') walk(v);
          }
        };
        walk(data);
        // Prefer .lottie over .json, prefer keys named lottieUrl/animationUrl.
        candidates.sort((a, b) => {
          const score = (c) =>
            (c.url.endsWith('.lottie') ? 2 : 0) +
            (/lottie|animation/i.test(c.key) ? 1 : 0);
          return score(b) - score(a);
        });
        if (candidates.length) {
          console.log(candidates[0].url);
          process.exit(0);
        }
      } catch (e) {
        // fall through to regex
      }
    }

    // Strategy 2 — regex over raw HTML for any lottie.host URL.
    const regex =
      /https:\/\/lottie\.host\/[a-f0-9-]+\/[A-Za-z0-9_-]+\.(?:json|lottie)/g;
    const matches = [...new Set(html.match(regex) || [])];
    if (matches.length) {
      const lottie = matches.find((u) => u.endsWith('.lottie'));
      console.log(lottie || matches[0]);
      process.exit(0);
    }

    // Strategy 3 — assets-vN / assetsN.lottiefiles.com fallback.
    const assetsRegex =
      /https:\/\/assets[0-9]*(?:-v\d+)?\.lottiefiles\.com\/packages\/[A-Za-z0-9_-]+\.json/g;
    const assets = [...new Set(html.match(assetsRegex) || [])];
    if (assets.length) {
      console.log(assets[0]);
      process.exit(0);
    }

    console.error('No direct Lottie URL found on page.');
    process.exit(5);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
