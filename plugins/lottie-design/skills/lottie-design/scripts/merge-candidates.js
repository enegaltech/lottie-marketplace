#!/usr/bin/env node
// merge-candidates.js — merge candidates.json into catalog.json (idempotent).
// Usage: node scripts/merge-candidates.js [--dry]

const fs = require('fs');
const path = require('path');

const dry = process.argv.includes('--dry');
const catalogPath = path.join(__dirname, '..', 'catalog.json');
const candidatesPath = path.join(__dirname, '..', 'candidates.json');

if (!fs.existsSync(candidatesPath)) {
  console.error('candidates.json not found. Run scripts/scrape-candidates.js first.');
  process.exit(2);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));

const existingUrls = new Set(catalog.map((e) => e.jsonUrl));
const existingIds = new Set(catalog.map((e) => e.id));

let added = 0;
let skipped = 0;
for (const c of candidates) {
  if (existingUrls.has(c.jsonUrl) || existingIds.has(c.id)) {
    skipped++;
    continue;
  }
  catalog.push(c);
  added++;
}

console.log(`Added ${added}, skipped ${skipped}. Total: ${catalog.length}`);
if (!dry) {
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${catalogPath}`);
} else {
  console.log('Dry run — no file written.');
}
