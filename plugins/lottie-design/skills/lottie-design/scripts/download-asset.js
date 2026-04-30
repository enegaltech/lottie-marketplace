#!/usr/bin/env node
// download-asset.js — download a Lottie JSON/.lottie to a project's assets dir.
//
// Usage:
//   node download-asset.js <url> <projectRoot> [framework] [name]
//
// framework: react | next | rn | flutter | vanilla   (auto-detected if omitted)
// name:      file basename (default = derived from URL)
//
// Output:
//   - React (Vite/CRA):     <projectRoot>/src/assets/animations/<name>.json
//   - Next.js:              <projectRoot>/public/animations/<name>.json
//   - React Native:         <projectRoot>/src/assets/animations/<name>.json
//   - Flutter:              <projectRoot>/assets/animations/<name>.json (also patches pubspec.yaml)
//   - Vanilla:              <projectRoot>/animations/<name>.json
//
// Prints the relative path (from projectRoot) to use in the component.

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const [, , url, projectRoot, frameworkArg, nameArg] = process.argv;

if (!url || !projectRoot) {
  console.error(
    'Usage: node download-asset.js <url> <projectRoot> [framework] [name]',
  );
  process.exit(2);
}

if (!fs.existsSync(projectRoot)) {
  console.error(`projectRoot does not exist: ${projectRoot}`);
  process.exit(3);
}

function detectFramework(root) {
  const has = (rel) => fs.existsSync(path.join(root, rel));
  if (has('pubspec.yaml')) return 'flutter';
  if (has('package.json')) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      if (deps['next']) return 'next';
      if (deps['react-native']) return 'rn';
      if (deps['react']) return 'react';
    } catch (e) {}
  }
  if (has('index.html')) return 'vanilla';
  return 'react';
}

const framework = (frameworkArg || detectFramework(projectRoot)).toLowerCase();

const TARGETS = {
  react: 'src/assets/animations',
  next: 'public/animations',
  rn: 'src/assets/animations',
  flutter: 'assets/animations',
  vanilla: 'animations',
};

const targetDir = TARGETS[framework];
if (!targetDir) {
  console.error(`Unknown framework: ${framework}`);
  process.exit(4);
}

const ext = url.endsWith('.lottie') ? '.lottie' : '.json';
const inferredName =
  nameArg ||
  decodeURIComponent(url.split('/').pop() || 'animation')
    .replace(/\.(json|lottie)$/i, '')
    .replace(/[^A-Za-z0-9_-]+/g, '-')
    .toLowerCase() ||
  'animation';

const absDir = path.join(projectRoot, targetDir);
fs.mkdirSync(absDir, { recursive: true });
const absFile = path.join(absDir, `${inferredName}${ext}`);

const r = spawnSync(
  'curl',
  ['-sL', '--fail', '--max-time', '30', '-o', absFile, url],
  { encoding: 'utf8' },
);
if (r.status !== 0) {
  console.error(`Download failed: curl exit ${r.status}`);
  process.exit(5);
}

const sizeKb = Math.round(fs.statSync(absFile).size / 1024);
const relPath = `${targetDir}/${inferredName}${ext}`.replace(/\\/g, '/');

// Flutter: patch pubspec.yaml asset registration
if (framework === 'flutter') {
  const pubspecPath = path.join(projectRoot, 'pubspec.yaml');
  if (fs.existsSync(pubspecPath)) {
    let yaml = fs.readFileSync(pubspecPath, 'utf8');
    const assetLine = `    - ${targetDir}/${inferredName}${ext}`;
    if (!yaml.includes(assetLine)) {
      if (yaml.match(/^\s+assets:\s*$/m)) {
        yaml = yaml.replace(/(^\s+assets:\s*\n)/m, `$1${assetLine}\n`);
      } else if (yaml.match(/^\s*flutter:\s*$/m)) {
        yaml = yaml.replace(
          /(^\s*flutter:\s*\n)/m,
          `$1  assets:\n${assetLine}\n`,
        );
      } else {
        yaml += `\nflutter:\n  assets:\n${assetLine}\n`;
      }
      fs.writeFileSync(pubspecPath, yaml, 'utf8');
    }
  }
}

console.log(JSON.stringify({
  framework,
  path: relPath,
  abs: absFile,
  sizeKb,
  importHint: importHintFor(framework, relPath),
}, null, 2));

function importHintFor(fw, rel) {
  switch (fw) {
    case 'react':
      return `import animationData from '@/${rel}';   // or relative path; for Vite: import url from '@/${rel}?url'`;
    case 'next':
      return `// Place under /public/animations; reference as '/${rel.replace(/^public\//, '')}'`;
    case 'rn':
      return `import animationData from './${rel}';`;
    case 'flutter':
      return `Lottie.asset('${rel}')`;
    case 'vanilla':
      return `<dotlottie-wc src="${rel}"></dotlottie-wc>`;
    default:
      return rel;
  }
}
