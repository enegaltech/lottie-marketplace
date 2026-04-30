#!/usr/bin/env node
// build-embeddings.js — OPTIONAL: precompute Voyage AI embeddings for the catalog.
//
// Why: Claude already does semantic ranking from prompt-time, but precomputed
// embeddings make ranking deterministic + fast for very large catalogs (500+).
// For our 140-entry catalog this is purely opt-in; the SKILL workflow does NOT
// require embeddings.
//
// Usage:
//   VOYAGE_API_KEY=... node scripts/build-embeddings.js
//   VOYAGE_MODEL=voyage-3-lite node scripts/build-embeddings.js   # cheaper
//
// Output: writes catalog-embeddings.json next to catalog.json with a map
// { id: number[] } of unit-normalized vectors. Loaded by skill consumers
// who want offline cosine-sim ranking.
//
// API: https://docs.voyageai.com/reference/embeddings-api

const fs = require('fs');
const path = require('path');

const apiKey = process.env.VOYAGE_API_KEY;
if (!apiKey) {
  console.error('Set VOYAGE_API_KEY to build embeddings (https://www.voyageai.com).');
  console.error('This script is optional. Skill works without embeddings via Claude semantic ranking.');
  process.exit(2);
}

const model = process.env.VOYAGE_MODEL || 'voyage-3';
const catalogPath = path.join(__dirname, '..', 'catalog.json');
const outPath = path.join(__dirname, '..', 'catalog-embeddings.json');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

function buildText(e) {
  const parts = [
    e.title,
    e.category,
    Array.isArray(e.tags) ? e.tags.join(' ') : '',
    e.dominantColor ? `color ${e.dominantColor}` : '',
    e.duration != null ? `${e.duration}s` : '',
  ];
  return parts.filter(Boolean).join(' · ');
}

function normalize(v) {
  let n = 0;
  for (const x of v) n += x * x;
  n = Math.sqrt(n) || 1;
  return v.map((x) => x / n);
}

async function embedBatch(texts) {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: texts, model }),
  });
  if (!res.ok) throw new Error(`Voyage API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.data.map((d) => normalize(d.embedding));
}

(async () => {
  const out = {};
  const BATCH = 32;
  for (let i = 0; i < catalog.length; i += BATCH) {
    const slice = catalog.slice(i, i + BATCH);
    const texts = slice.map(buildText);
    process.stdout.write(`Batch ${i / BATCH + 1}/${Math.ceil(catalog.length / BATCH)}… `);
    const vecs = await embedBatch(texts);
    slice.forEach((e, j) => (out[e.id] = vecs[j]));
    process.stdout.write('done\n');
  }
  fs.writeFileSync(outPath, JSON.stringify(out), 'utf8');
  console.log(`Wrote ${Object.keys(out).length} embeddings to ${outPath}`);
})().catch((e) => {
  console.error('Failed:', e.message);
  process.exit(1);
});
