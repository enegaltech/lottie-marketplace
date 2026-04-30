#!/usr/bin/env node
// generate-preview.js — produce a standalone preview HTML for a Lottie URL.
// Usage: node generate-preview.js <jsonOrLottieUrl> [name]
// Output: writes preview-<name>.html to cwd, prints the absolute path.

const fs = require('fs');
const path = require('path');

const src = process.argv[2];
const name = (process.argv[3] || 'lottie').replace(/[^A-Za-z0-9_-]/g, '-');

if (!src) {
  console.error('Usage: node generate-preview.js <url> [name]');
  process.exit(2);
}

const templatePath = path.join(__dirname, '..', 'preview-template.html');
const template = fs.readFileSync(templatePath, 'utf8');
const html = template.replace(/\{\{src\}\}/g, src).replace(/\{\{name\}\}/g, name);

const outPath = path.resolve(process.cwd(), `preview-${name}.html`);
fs.writeFileSync(outPath, html, 'utf8');
console.log(outPath);
