#!/usr/bin/env node
// to-dotlottie.js — wrap a Lottie JSON into a `.lottie` archive (ZIP with manifest).
// Pure Node, no dependencies. Useful for local-mode bundling — typical 50-90% size cut after gzip.
//
// Usage:
//   node to-dotlottie.js <input.json> [output.lottie] [--id animationId]
//
// dotLottie spec: https://dotlottie.io/spec/2.0/

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const args = process.argv.slice(2);
const idIdx = args.indexOf('--id');
const id = idIdx >= 0 ? args[idIdx + 1] : null;
const positional = args.filter((a, i) => !a.startsWith('--') && (i === 0 || !args[i - 1].startsWith('--')));

const input = positional[0];
const output = positional[1] || (input ? input.replace(/\.json$/i, '.lottie') : null);

if (!input || !output) {
  console.error('Usage: node to-dotlottie.js <input.json> [output.lottie] [--id <id>]');
  process.exit(2);
}

const animationId = id || path.basename(input, '.json').replace(/[^A-Za-z0-9_-]/g, '_');
const animationJson = fs.readFileSync(input);
const manifest = Buffer.from(
  JSON.stringify(
    {
      version: '1',
      revision: 1,
      author: 'lottie-design-skill',
      generator: 'lottie-design-skill/to-dotlottie',
      animations: [
        {
          id: animationId,
          speed: 1,
          loop: true,
          autoplay: true,
          themeColor: '#000000',
        },
      ],
    },
    null,
    2,
  ),
  'utf8',
);

writeZip(output, [
  { name: 'manifest.json', data: manifest },
  { name: `animations/${animationId}.json`, data: animationJson },
]);

const before = animationJson.byteLength;
const after = fs.statSync(output).size;
console.log(
  `Wrote ${output} — ${(after / 1024).toFixed(1)} KB (was ${(before / 1024).toFixed(1)} KB JSON, ${Math.round(
    100 - (after / before) * 100,
  )}% smaller)`,
);

// ── Minimal ZIP writer (deflate, no encryption, no zip64) ──────────────────────
function writeZip(outPath, entries) {
  const fileBufs = [];
  const central = [];
  let offset = 0;

  for (const e of entries) {
    const nameBuf = Buffer.from(e.name, 'utf8');
    const compressed = zlib.deflateRawSync(e.data, { level: 9 });
    const crc = crc32(e.data);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);                // version needed
    localHeader.writeUInt16LE(0, 6);                 // flags
    localHeader.writeUInt16LE(8, 8);                 // method = deflate
    localHeader.writeUInt16LE(0, 10);                // mtime
    localHeader.writeUInt16LE(0, 12);                // mdate
    localHeader.writeUInt32LE(crc, 14);              // CRC-32
    localHeader.writeUInt32LE(compressed.length, 18); // compressed size
    localHeader.writeUInt32LE(e.data.length, 22);    // uncompressed size
    localHeader.writeUInt16LE(nameBuf.length, 26);   // file name length
    localHeader.writeUInt16LE(0, 28);                // extra length
    fileBufs.push(localHeader, nameBuf, compressed);

    const centralRec = Buffer.alloc(46);
    centralRec.writeUInt32LE(0x02014b50, 0);
    centralRec.writeUInt16LE(20, 4);
    centralRec.writeUInt16LE(20, 6);
    centralRec.writeUInt16LE(0, 8);
    centralRec.writeUInt16LE(8, 10);
    centralRec.writeUInt16LE(0, 12);
    centralRec.writeUInt16LE(0, 14);
    centralRec.writeUInt32LE(crc, 16);
    centralRec.writeUInt32LE(compressed.length, 20);
    centralRec.writeUInt32LE(e.data.length, 24);
    centralRec.writeUInt16LE(nameBuf.length, 28);
    centralRec.writeUInt16LE(0, 30);                 // extra
    centralRec.writeUInt16LE(0, 32);                 // comment
    centralRec.writeUInt16LE(0, 34);                 // disk
    centralRec.writeUInt16LE(0, 36);                 // internal attrs
    centralRec.writeUInt32LE(0, 38);                 // external attrs
    centralRec.writeUInt32LE(offset, 42);            // local header offset
    central.push(Buffer.concat([centralRec, nameBuf]));

    offset += localHeader.length + nameBuf.length + compressed.length;
  }

  const centralBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  fs.writeFileSync(outPath, Buffer.concat([...fileBufs, centralBuf, eocd]));
}

function crc32(buf) {
  if (!crc32.table) {
    crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crc32.table[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = (crc32.table[(c ^ buf[i]) & 0xff] ^ (c >>> 8)) >>> 0;
  }
  return (c ^ 0xffffffff) >>> 0;
}
