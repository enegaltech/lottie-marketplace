#!/usr/bin/env node
// enrich-catalog.js — fetch each catalog URL, parse the Lottie JSON, extract metadata,
// and update catalog.json in place.
//
// Adds fields per entry:
//   - dominantColor (hex, derived from first fill shape)
//   - frames        (op - ip)
//   - duration      (seconds, frames / fr)
//   - sizeKb        (rounded)
//   - dimensions    ({ w, h })
//
// Usage: node scripts/enrich-catalog.js [--dry]

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const dry = process.argv.includes('--dry');
const catalogPath = path.join(__dirname, '..', 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

function fetchJson(url) {
  const r = spawnSync(
    'curl',
    ['-sL', '--max-time', '20', '-H', 'Accept: application/json', url],
    { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 },
  );
  if (r.status !== 0) throw new Error(`curl exit ${r.status}`);
  return r.stdout;
}

function rgbToHex(r, g, b) {
  const to = (v) =>
    Math.round(Math.max(0, Math.min(1, v)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

function findDominantColor(json) {
  // Walk layers → shapes/items → find first fill (`ty: 'fl'`) with a static color.
  function walk(node) {
    if (!node || typeof node !== 'object') return null;
    if (Array.isArray(node)) {
      for (const item of node) {
        const c = walk(item);
        if (c) return c;
      }
      return null;
    }
    if ((node.ty === 'fl' || node.ty === 'st') && node.c && Array.isArray(node.c.k)) {
      const k = node.c.k;
      // Static color: c.k = [r, g, b, a]
      if (typeof k[0] === 'number' && k.length >= 3) {
        return rgbToHex(k[0], k[1], k[2]);
      }
      // Animated: c.k = [{ s: [r,g,b,a], t: ... }, ...]
      if (k[0] && Array.isArray(k[0].s) && k[0].s.length >= 3) {
        return rgbToHex(k[0].s[0], k[0].s[1], k[0].s[2]);
      }
    }
    if (node.layers) {
      const c = walk(node.layers);
      if (c) return c;
    }
    if (node.shapes) {
      const c = walk(node.shapes);
      if (c) return c;
    }
    if (node.it) {
      const c = walk(node.it);
      if (c) return c;
    }
    return null;
  }
  return walk(json);
}

let enriched = 0;
let failed = 0;
const failures = [];

for (const entry of catalog) {
  try {
    const raw = fetchJson(entry.jsonUrl);
    const sizeKb = Math.round(Buffer.byteLength(raw, 'utf8') / 1024);
    const json = JSON.parse(raw);
    const fr = json.fr || 30;
    const ip = typeof json.ip === 'number' ? json.ip : 0;
    const op = typeof json.op === 'number' ? json.op : 0;
    const frames = Math.max(0, Math.round(op - ip));
    const duration = +(frames / fr).toFixed(2);
    const w = json.w || null;
    const h = json.h || null;
    const dominantColor = findDominantColor(json) || null;

    entry.sizeKb = sizeKb;
    entry.frames = frames;
    entry.duration = duration;
    entry.dimensions = w && h ? { w, h } : null;
    entry.dominantColor = dominantColor;

    enriched++;
    process.stdout.write(
      `  ${entry.id.padEnd(28)} ${String(sizeKb).padStart(4)}KB ${String(
        frames,
      ).padStart(4)}f ${duration}s ${dominantColor || 'no-color'}\n`,
    );
  } catch (err) {
    failed++;
    failures.push({ id: entry.id, error: err.message });
    process.stdout.write(`  ${entry.id.padEnd(28)} FAILED: ${err.message}\n`);
  }
}

console.log(`\nEnriched: ${enriched}, Failed: ${failed}`);
if (failures.length) console.log('Failures:', JSON.stringify(failures, null, 2));

if (!dry) {
  fs.writeFileSync(
    catalogPath,
    JSON.stringify(catalog, null, 2) + '\n',
    'utf8',
  );
  console.log(`Wrote ${catalogPath}`);
} else {
  console.log('Dry run — no file written.');
}
