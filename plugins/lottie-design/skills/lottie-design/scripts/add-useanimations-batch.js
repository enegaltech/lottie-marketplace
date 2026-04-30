#!/usr/bin/env node
// add-useanimations-batch.js — add the remaining useAnimations entries to catalog.json.
// Idempotent: skips entries already in catalog (matched by jsonUrl).
// Usage: node scripts/add-useanimations-batch.js

const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Definitions for entries to add: [camelCaseName, category, tags[], title]
const ENTRIES = [
  ['activity',         'onboarding',   ['activity','pulse','heartbeat','vitals'],     'Activity Pulse'],
  ['airplay',          'onboarding',   ['airplay','cast','stream','tv'],              'AirPlay Cast'],
  ['alertOctagon',     'error',        ['alert','warning','octagon','stop'],          'Alert Octagon'],
  ['arrowDown',        'onboarding',   ['arrow','down','direction'],                  'Arrow Down'],
  ['arrowDownCircle',  'onboarding',   ['arrow','down','circle'],                     'Arrow Down Circle'],
  ['arrowLeftCircle',  'onboarding',   ['arrow','left','back','circle'],              'Arrow Left Circle'],
  ['arrowRightCircle', 'onboarding',   ['arrow','right','next','circle'],             'Arrow Right Circle'],
  ['arrowUp',          'onboarding',   ['arrow','up','direction'],                    'Arrow Up'],
  ['arrowUpCircle',    'onboarding',   ['arrow','up','circle','top'],                 'Arrow Up Circle'],
  ['behance',          'social-share', ['behance','social','logo','design'],          'Behance Logo'],
  ['calendar',         'onboarding',   ['calendar','date','schedule','time'],         'Calendar'],
  ['codepen',          'social-share', ['codepen','social','logo','developer'],       'CodePen Logo'],
  ['dribbble',         'social-share', ['dribbble','social','logo','design'],         'Dribbble Logo'],
  ['explore',          'onboarding',   ['explore','compass','navigate','discover'],   'Explore Compass'],
  ['home',             'onboarding',   ['home','house','main'],                       'Home Icon'],
  ['infinity',         'onboarding',   ['infinity','loop','endless','forever'],       'Infinity Loop'],
  ['maximizeMinimize', 'onboarding',   ['maximize','minimize','fullscreen','window'], 'Maximize / Minimize'],
  ['maximizeMinimize2','onboarding',   ['maximize','minimize','window','toggle'],     'Maximize / Minimize 2'],
  ['menu2',            'onboarding',   ['menu','hamburger','close','x'],              'Menu Variant 2'],
  ['menu3',            'onboarding',   ['menu','hamburger','close','x'],              'Menu Variant 3'],
  ['menu4',            'onboarding',   ['menu','hamburger','close','x'],              'Menu Variant 4'],
  ['microphone2',      'onboarding',   ['mic','microphone','voice','record'],         'Microphone Variant 2'],
  ['notification2',    'onboarding',   ['notification','bell','alert','ring'],        'Notification Variant 2'],
  ['playPauseCircle',  'onboarding',   ['play','pause','circle','media'],             'Play Pause Circle'],
  ['plusToX',          'onboarding',   ['plus','x','add','close','toggle'],           'Plus to X Toggle'],
  ['pocket',           'social-share', ['pocket','save','social','logo'],             'Pocket Logo'],
  ['radioButton',      'success',      ['radio','button','input','select'],           'Radio Button'],
  ['scrollDown',       'onboarding',   ['scroll','down','indicator','gesture'],       'Scroll Down Indicator'],
  ['settings2',        'onboarding',   ['settings','gear','config','options'],        'Settings Variant 2'],
  ['skipBack',         'onboarding',   ['skip','back','previous','media'],            'Skip Back'],
  ['skipForward',      'onboarding',   ['skip','forward','next','media'],             'Skip Forward'],
  ['toggle',           'success',      ['toggle','switch','on','off'],                'Toggle Switch'],
  ['trash2',           'ecommerce',    ['trash','delete','remove','bin'],             'Trash Variant 2'],
  ['userX',            'onboarding',   ['user','x','remove','block'],                 'Remove User X'],
  ['video2',           'onboarding',   ['video','camera','record'],                   'Video Variant 2'],
  ['visibility2',      'onboarding',   ['eye','visibility','show','hide'],            'Visibility Variant 2'],
  ['youtube2',         'social-share', ['youtube','video','social','logo'],           'YouTube Variant 2'],
  ['zoomIn',           'onboarding',   ['zoom','in','magnify'],                       'Zoom In'],
  ['zoomOut',          'onboarding',   ['zoom','out','shrink'],                       'Zoom Out'],
];

function camelToKebab(s) {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[^A-Za-z0-9]+/g, '-').toLowerCase();
}

let added = 0;
let skipped = 0;

for (const [name, category, tags, title] of ENTRIES) {
  const jsonUrl = `https://raw.githubusercontent.com/useAnimations/react-useanimations/master/src/lib/${name}/${name}.json`;
  if (catalog.find((e) => e.jsonUrl === jsonUrl)) {
    skipped++;
    continue;
  }
  const id = `ua-${camelToKebab(name)}`;
  catalog.push({
    id,
    title,
    category,
    tags,
    jsonUrl,
    lottieUrl: null,
    preview: `https://github.com/useAnimations/react-useanimations/blob/master/src/lib/${name}/${name}.json`,
    author: 'useAnimations',
    source: 'github',
    license: 'CC-BY-4.0',
    attributionRequired: true,
  });
  added++;
  process.stdout.write(`  + ${id} (${category})\n`);
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
console.log(`\nAdded ${added}, skipped ${skipped}. Total entries now: ${catalog.length}`);
console.log('Run scripts/enrich-catalog.js next to backfill metadata.');
