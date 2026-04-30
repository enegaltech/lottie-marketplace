#!/usr/bin/env node
// generate-preview.js — produce a standalone preview HTML for one or more Lottie URLs.
//
// Single mode (default):
//   node generate-preview.js <url> [name] [--no-open]
//
// Gallery mode (compare 2-N animations side by side):
//   node generate-preview.js --gallery <out-name> '<json>' '<json>' ...
//   where each <json> is a JSON object string like:
//   '{"id":"loader-dots","title":"Loading Dots","src":"https://...","color":"#3B82F6","sizeKb":4,"duration":1.2,"frames":48}'
//
// Auto-opens the resulting HTML in the default browser unless --no-open is passed.

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const noOpen = args.includes('--no-open');
const positional = args.filter((a) => !a.startsWith('--'));

function openInBrowser(file) {
  const platform = process.platform;
  let cmd, cmdArgs;
  if (platform === 'win32') {
    cmd = 'cmd';
    cmdArgs = ['/c', 'start', '""', file];
  } else if (platform === 'darwin') {
    cmd = 'open';
    cmdArgs = [file];
  } else {
    cmd = 'xdg-open';
    cmdArgs = [file];
  }
  try {
    const child = spawn(cmd, cmdArgs, { detached: true, stdio: 'ignore' });
    child.unref();
  } catch (e) {
    // best effort
  }
}

if (args.includes('--gallery')) {
  // Gallery mode
  const galleryIdx = args.indexOf('--gallery');
  const outName = (args[galleryIdx + 1] || 'gallery').replace(
    /[^A-Za-z0-9_-]/g,
    '-',
  );
  const items = positional.slice(positional.indexOf(args[galleryIdx + 1]) + 1);

  if (!items.length) {
    console.error(
      "Gallery mode needs at least one item JSON. Example: --gallery loaders '{\"id\":\"x\",\"title\":\"T\",\"src\":\"https://...\"}'",
    );
    process.exit(2);
  }

  const parsed = items.map((s) => {
    try {
      return JSON.parse(s);
    } catch (e) {
      console.error(`Bad item JSON: ${s.slice(0, 80)}…`);
      process.exit(3);
    }
  });

  const cards = parsed
    .map((item) => {
      const meta = [];
      if (item.color)
        meta.push(`<span><span class="swatch" style="background:${item.color}"></span>${item.color}</span>`);
      if (item.duration != null) meta.push(`${item.duration}s`);
      if (item.frames != null) meta.push(`${item.frames}f`);
      if (item.sizeKb != null) meta.push(`${item.sizeKb}KB`);
      if (item.license) meta.push(item.license);
      return `
      <div class="card">
        <div class="card-title">${escapeHtml(item.title || item.id)}</div>
        <dotlottie-wc src="${escapeAttr(item.src)}" autoplay loop></dotlottie-wc>
        <div class="card-meta">${meta.join(' • ')}</div>
        <div class="id">${escapeHtml(item.id || '')}</div>
      </div>`;
    })
    .join('\n');

  const templatePath = path.join(__dirname, '..', 'preview-gallery-template.html');
  const template = fs.readFileSync(templatePath, 'utf8');
  const html = template
    .replace(/\{\{title\}\}/g, `Compare ${parsed.length} animations`)
    .replace('{{cards}}', cards);

  const outPath = path.resolve(process.cwd(), `preview-${outName}.html`);
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(outPath);
  if (!noOpen) openInBrowser(outPath);
  process.exit(0);
}

// Single mode
const src = positional[0];
const name = (positional[1] || 'lottie').replace(/[^A-Za-z0-9_-]/g, '-');

if (!src) {
  console.error(
    'Usage:\n  node generate-preview.js <url> [name] [--no-open]\n  node generate-preview.js --gallery <out-name> \'<item-json>\' \'<item-json>\' ...',
  );
  process.exit(2);
}

const templatePath = path.join(__dirname, '..', 'preview-template.html');
const template = fs.readFileSync(templatePath, 'utf8');
const html = template.replace(/\{\{src\}\}/g, src).replace(/\{\{name\}\}/g, name);

const outPath = path.resolve(process.cwd(), `preview-${name}.html`);
fs.writeFileSync(outPath, html, 'utf8');
console.log(outPath);
if (!noOpen) openInBrowser(outPath);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;');
}
