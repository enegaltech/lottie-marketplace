#!/usr/bin/env node
// generate-preview.js — produce a standalone preview HTML for a Lottie URL and auto-open it.
// Usage: node generate-preview.js <jsonOrLottieUrl> [name] [--no-open]
// Output: writes preview-<name>.html to cwd, prints the absolute path, opens in default browser.

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const noOpen = args.includes('--no-open');
const positional = args.filter((a) => !a.startsWith('--'));
const src = positional[0];
const name = (positional[1] || 'lottie').replace(/[^A-Za-z0-9_-]/g, '-');

if (!src) {
  console.error('Usage: node generate-preview.js <url> [name] [--no-open]');
  process.exit(2);
}

const templatePath = path.join(__dirname, '..', 'preview-template.html');
const template = fs.readFileSync(templatePath, 'utf8');
const html = template.replace(/\{\{src\}\}/g, src).replace(/\{\{name\}\}/g, name);

const outPath = path.resolve(process.cwd(), `preview-${name}.html`);
fs.writeFileSync(outPath, html, 'utf8');
console.log(outPath);

if (!noOpen) {
  const platform = process.platform;
  let cmd, cmdArgs;
  if (platform === 'win32') {
    cmd = 'cmd';
    cmdArgs = ['/c', 'start', '""', outPath];
  } else if (platform === 'darwin') {
    cmd = 'open';
    cmdArgs = [outPath];
  } else {
    cmd = 'xdg-open';
    cmdArgs = [outPath];
  }
  try {
    const child = spawn(cmd, cmdArgs, { detached: true, stdio: 'ignore' });
    child.unref();
  } catch (e) {
    // best effort — silent if browser open fails
  }
}
