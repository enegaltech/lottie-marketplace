#!/usr/bin/env node
// scrape-candidates.js — discover Lottie JSON files from known sample repos and
// emit a candidates.json file ready for manual review + merge into catalog.json.
//
// Strategy: hit GitHub's tree API for a list of seed repos that ship sample
// animations under permissive licenses (MIT/Apache). For each *.json file:
//   1. fetch raw content
//   2. validate it has bodymovin signature ("v": "5.x.x", layers[])
//   3. extract metadata (w, h, fr, op, sizeKb, dominantColor)
//   4. classify into a category by filename heuristics
//   5. write to candidates.json
//
// Reviewer then opens candidates.json, prunes/edits, and runs:
//   node scripts/merge-candidates.js
// to fold them into catalog.json.
//
// Usage: node scripts/scrape-candidates.js [--limit 80] [--seed <repo>]

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const limitArg = args.indexOf('--limit');
const limit = limitArg >= 0 ? parseInt(args[limitArg + 1], 10) : 80;
const seedArg = args.indexOf('--seed');
const seedOverride = seedArg >= 0 ? args[seedArg + 1] : null;

// repo + branch + license + path filter (regex match) + skip filter
const SEEDS = seedOverride
  ? [{ repo: seedOverride, branch: 'master', license: 'MIT (assumed)', match: /\.json$/ }]
  : [
      {
        repo: 'airbnb/lottie-android',
        branch: 'master',
        license: 'Apache-2.0',
        match: /(sample-compose|sample)\/src\/main\/(assets|res\/raw)\/[^/]+\.json$/,
        skip: /^|^/, // none
      },
      {
        repo: 'xvrh/lottie-flutter',
        branch: 'master',
        license: 'MIT (mirror)',
        match: /^example\/assets\/lottiefiles\/[^/]+\.json$/,
        skip: /(LottieLogo|GradientColor|DynamicGradient|Tests\/|Mobilo\/|Logo\/|Animation-17|edited-landscape)/,
      },
    ];

function gh(url) {
  const r = spawnSync(
    'curl',
    [
      '-sL',
      '--max-time', '20',
      '-H', 'Accept: application/vnd.github+json',
      url,
    ],
    { encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 },
  );
  if (r.status !== 0) throw new Error(`gh fetch ${r.status}: ${r.stderr}`);
  return JSON.parse(r.stdout);
}

function fetchRaw(url) {
  const r = spawnSync(
    'curl',
    ['-sL', '--max-time', '20', url],
    { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 },
  );
  if (r.status !== 0) return null;
  return r.stdout;
}

function rgbToHex(r, g, b) {
  const to = (v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

function findColor(json) {
  const walk = (n) => {
    if (!n || typeof n !== 'object') return null;
    if (Array.isArray(n)) {
      for (const x of n) {
        const c = walk(x);
        if (c) return c;
      }
      return null;
    }
    if ((n.ty === 'fl' || n.ty === 'st') && n.c && Array.isArray(n.c.k)) {
      const k = n.c.k;
      if (typeof k[0] === 'number' && k.length >= 3) return rgbToHex(k[0], k[1], k[2]);
      if (k[0] && Array.isArray(k[0].s) && k[0].s.length >= 3)
        return rgbToHex(k[0].s[0], k[0].s[1], k[0].s[2]);
    }
    for (const key of ['layers', 'shapes', 'it']) {
      if (n[key]) {
        const c = walk(n[key]);
        if (c) return c;
      }
    }
    return null;
  };
  return walk(json);
}

function classify(filename) {
  const f = filename.toLowerCase();
  const C = (cat, tags) => ({ category: cat, tags });
  if (/(load|loader|spinner|preload|wait|progress|typing)/.test(f))
    return C('loader', ['loading', 'spinner']);
  if (/(success|done|complete|check|tick|approve|invite|confetti)/.test(f))
    return C('success', ['success', 'done']);
  if (/(error|fail|alert|warn|reject|x_pop|bug)/.test(f))
    return C('error', ['error', 'fail']);
  if (/(empty|no.?internet|offline|404|nothing)/.test(f))
    return C('empty-state', ['empty', 'no-data']);
  if (/(swipe|scroll|onboard|welcome|tutorial|walkthrough|fingerprint|touch.?id|permission|notification|location|map|wave|hello)/.test(f))
    return C('onboarding', ['onboarding']);
  if (/(payment|cash|money|wallet|credit|card|coin|bitcoin|finance|iap)/.test(f))
    return C('payment', ['payment']);
  if (/(cart|shop|store|deliver|trash|delete|trophy|medal|rating|star|print|download|upload|edit|copy|archive)/.test(f))
    return C('ecommerce', ['ecommerce']);
  if (/(weather|rain|snow|cloud|sun|storm|thunder|fog|wind|hurricane|tornado)/.test(f))
    return C('weather', ['weather']);
  if (/(walk|jump|run|wave|dance|character|person|man|woman|kid|emoji|penguin|dog|cat|bird|frog|fish|wolf|bb8)/.test(f))
    return C('character', ['character']);
  if (/(facebook|twitter|instagram|linkedin|github|youtube|tiktok|behance|dribbble|codepen|pocket|share|heart|like|bookmark|thumb)/.test(f))
    return C('social-share', ['social']);
  return C('uncategorized', []);
}

function titleCase(s) {
  return s
    .replace(/[-_]+/g, ' ')
    .replace(/\.json$/i, '')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/\.json$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const candidates = [];
const existing = new Set(
  JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'catalog.json'), 'utf8'))
    .map((e) => e.jsonUrl),
);

for (const seed of SEEDS) {
  console.log(`\n=== ${seed.repo} (${seed.license}) ===`);
  let tree;
  try {
    tree = gh(`https://api.github.com/repos/${seed.repo}/git/trees/${seed.branch}?recursive=1`);
  } catch (e) {
    console.error(`  gh tree failed: ${e.message}`);
    continue;
  }
  if (!tree.tree) {
    console.error(`  no tree, response: ${JSON.stringify(tree).slice(0, 200)}`);
    continue;
  }

  const matches = tree.tree.filter(
    (t) =>
      t.type === 'blob' &&
      seed.match.test(t.path) &&
      !(seed.skip && seed.skip.test(t.path)),
  );
  console.log(`  matched ${matches.length} json files`);

  let added = 0;
  for (const m of matches) {
    if (added >= limit) break;
    const rawUrl = `https://raw.githubusercontent.com/${seed.repo}/${seed.branch}/${m.path.split('/').map(encodeURIComponent).join('/')}`;
    if (existing.has(rawUrl)) continue;

    const raw = fetchRaw(rawUrl);
    if (!raw) continue;
    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!json.v || !Array.isArray(json.layers)) continue; // not bodymovin

    const filename = m.path.split('/').pop();
    const { category, tags } = classify(filename);
    if (category === 'uncategorized') continue; // skip uncertain

    const sizeKb = Math.round(Buffer.byteLength(raw, 'utf8') / 1024);
    if (sizeKb > 1500) continue; // too big
    const fr = json.fr || 30;
    const ip = json.ip || 0;
    const op = json.op || 0;
    const frames = Math.max(0, Math.round(op - ip));
    const duration = +(frames / fr).toFixed(2);
    if (frames < 5 || frames > 1500) continue; // bogus or epic-length

    const id = `gh-${slugify(seed.repo.split('/').pop())}-${slugify(filename)}`;
    candidates.push({
      id,
      title: titleCase(filename),
      category,
      tags: [...new Set([...tags, ...slugify(filename).split('-').filter((t) => t.length >= 3)])].slice(0, 6),
      jsonUrl: rawUrl,
      lottieUrl: null,
      preview: `https://github.com/${seed.repo}/blob/${seed.branch}/${m.path}`,
      author: seed.repo,
      source: 'github-mirror',
      license: seed.license.includes('Apache') ? 'Apache-2.0' : 'Lottie Simple License',
      attributionRequired: false,
      sizeKb,
      frames,
      duration,
      dimensions: json.w && json.h ? { w: json.w, h: json.h } : null,
      dominantColor: findColor(json) || null,
    });
    added++;
    if (added % 10 === 0) process.stdout.write(`  +${added}…\r`);
  }
  console.log(`  added ${added} candidates`);
}

const outPath = path.join(__dirname, '..', 'candidates.json');
fs.writeFileSync(outPath, JSON.stringify(candidates, null, 2) + '\n', 'utf8');
console.log(`\nWrote ${candidates.length} candidates to ${outPath}`);
console.log('Review, prune, then run: node scripts/merge-candidates.js');
