#!/usr/bin/env node
// add-lottiefiles-batch.js — add curated entries from xvrh/lottie-flutter sample repo.
// xvrh repo is MIT licensed; embedded animations inherit Lottie Simple License from original
// creators on lottiefiles.com. We label catalog entries with `Lottie Simple License`.

const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const BASE = 'https://raw.githubusercontent.com/xvrh/lottie-flutter/master/example/assets';

// [path, idSlug, category, tags[], title]
const ENTRIES = [
  // loaders
  ['lottiefiles/bounching_ball.json', 'lf-loader-bounching-ball-xvrh', 'loader', ['loading','ball','bounce'], 'Bouncing Ball'],
  ['lottiefiles/cube_loader.json', 'lf-loader-cube', 'loader', ['loading','cube','3d'], 'Cube Loader'],
  ['lottiefiles/dna_loader.json', 'lf-loader-dna', 'loader', ['loading','dna','helix'], 'DNA Loader'],
  ['lottiefiles/glow_loading.json', 'lf-loader-glow', 'loader', ['loading','glow','pulse'], 'Glow Loading'],
  ['lottiefiles/iphone_x_loading.json', 'lf-loader-iphone', 'loader', ['loading','iphone','minimal'], 'iPhone X Loading'],
  ['lottiefiles/lego_loader.json', 'lf-loader-lego', 'loader', ['loading','lego','blocks'], 'Lego Loader'],
  ['lottiefiles/loading_disc.json', 'lf-loader-disc', 'loader', ['loading','disc','spinner'], 'Disc Loader'],
  ['lottiefiles/loading_semicircle.json', 'lf-loader-semicircle', 'loader', ['loading','semicircle','arc'], 'Semicircle Loader'],
  ['lottiefiles/material_loader.json', 'lf-loader-material', 'loader', ['loading','material','google'], 'Material Loader'],
  ['lottiefiles/material_loading_2.json', 'lf-loader-material-2', 'loader', ['loading','material','google'], 'Material Loader 2'],
  ['lottiefiles/material_wave_loading.json', 'lf-loader-material-wave', 'loader', ['loading','wave','material'], 'Material Wave Loading'],
  ['lottiefiles/preloader.json', 'lf-loader-preloader', 'loader', ['loading','preloader','startup'], 'Preloader'],
  ['lottiefiles/simple_loader.json', 'lf-loader-simple', 'loader', ['loading','simple','minimal'], 'Simple Loader'],
  ['lottiefiles/slack_app_loader.json', 'lf-loader-slack', 'loader', ['loading','slack','app'], 'Slack App Loader'],
  ['lottiefiles/soda_loader.json', 'lf-loader-soda', 'loader', ['loading','soda','bubbles'], 'Soda Loader'],
  ['lottiefiles/spinner loading.json', 'lf-loader-spinner', 'loader', ['loading','spinner','wait'], 'Spinner Loading'],
  ['lottiefiles/splashy_loader.json', 'lf-loader-splashy', 'loader', ['loading','splash','colorful'], 'Splashy Loader'],
  ['lottiefiles/trail_loading.json', 'lf-loader-trail', 'loader', ['loading','trail','dots'], 'Trail Loading'],
  ['lottiefiles/typing dot.json', 'lf-loader-typing', 'loader', ['typing','dots','chat','indicator'], 'Typing Dots'],

  // success
  ['lottiefiles/check_pop.json', 'lf-success-check-pop', 'success', ['check','success','pop','done'], 'Check Pop'],
  ['lottiefiles/code_invite_success.json', 'lf-success-invite', 'success', ['success','invite','check'], 'Invite Success'],
  ['lottiefiles/done.json', 'lf-success-done', 'success', ['done','complete','success','check'], 'Done Check'],
  ['lottiefiles/scan_qr_code_success.json', 'lf-success-qr-scan', 'success', ['scan','qr','success','done'], 'QR Scan Success'],

  // error
  ['lottiefiles/file_error.json', 'lf-error-file', 'error', ['error','file','fail'], 'File Error'],
  ['lottiefiles/no_internet_connection.json', 'lf-error-no-internet', 'error', ['error','offline','no-internet','connection'], 'No Internet'],
  ['lottiefiles/x_pop.json', 'lf-error-x-pop', 'error', ['error','x','close','pop'], 'X Pop'],

  // empty-state
  ['lottiefiles/empty_status.json', 'lf-empty-status', 'empty-state', ['empty','no-data','status'], 'Empty Status'],

  // onboarding
  ['lottiefiles/swipe_right_indicator.json', 'lf-onboarding-swipe', 'onboarding', ['swipe','indicator','onboarding','gesture'], 'Swipe Right Indicator'],
  ['lottiefiles/drop_to_refresh.json', 'lf-onboarding-pull-refresh', 'onboarding', ['pull','refresh','gesture'], 'Pull to Refresh'],
  ['lottiefiles/walking_arrow.json', 'lf-onboarding-walking-arrow', 'onboarding', ['arrow','walking','direction'], 'Walking Arrow'],
  ['lottiefiles/touch_id.json', 'lf-onboarding-touch-id', 'onboarding', ['fingerprint','touch','auth'], 'Touch ID'],
  ['lottiefiles/fingerprint_scanner.json', 'lf-onboarding-fingerprint', 'onboarding', ['fingerprint','scan','auth'], 'Fingerprint Scanner'],
  ['lottiefiles/permission.json', 'lf-onboarding-permission', 'onboarding', ['permission','allow','prompt'], 'Permission Prompt'],
  ['lottiefiles/notification_request.json', 'lf-onboarding-notification', 'onboarding', ['notification','request','bell'], 'Notification Request'],
  ['lottiefiles/location.json', 'lf-onboarding-location', 'onboarding', ['location','pin','map'], 'Location Pin'],
  ['lottiefiles/location_marker.json', 'lf-onboarding-location-marker', 'onboarding', ['location','marker','map','pin'], 'Location Marker'],
  ['lottiefiles/play,_pause.json', 'lf-onboarding-play-pause', 'onboarding', ['play','pause','toggle','media'], 'Play Pause Toggle'],

  // payment
  ['lottiefiles/credit_card.json', 'lf-payment-credit-card', 'payment', ['payment','credit','card'], 'Credit Card'],
  ['lottiefiles/cash.json', 'lf-payment-cash', 'payment', ['cash','money','payment'], 'Cash'],
  ['lottiefiles/money.json', 'lf-payment-money', 'payment', ['money','cash','dollar'], 'Money'],
  ['lottiefiles/wallet recharge.json', 'lf-payment-wallet', 'payment', ['wallet','recharge','payment'], 'Wallet Recharge'],
  ['lottiefiles/in-app_purchasing.json', 'lf-payment-iap', 'payment', ['in-app','purchase','iap','payment'], 'In-App Purchase'],

  // ecommerce
  ['lottiefiles/rating.json', 'lf-ecom-rating', 'ecommerce', ['rating','stars','review'], 'Rating Stars'],
  ['lottiefiles/trophy.json', 'lf-ecom-trophy', 'ecommerce', ['trophy','win','reward'], 'Trophy'],
  ['lottiefiles/medal.json', 'lf-ecom-medal', 'ecommerce', ['medal','award','reward'], 'Medal'],
  ['lottiefiles/print.json', 'lf-ecom-print', 'ecommerce', ['print','printer','document'], 'Print'],

  // character
  ['lottiefiles/jolly_walker.json', 'lf-character-walker', 'character', ['character','walking','person'], 'Jolly Walker'],
  ['lottiefiles/penguin.json', 'lf-character-penguin', 'character', ['penguin','animal','character'], 'Penguin'],

  // weather (new category)
  ['weather/fog.json', 'lf-weather-fog', 'weather', ['weather','fog','mist'], 'Fog'],
  ['weather/hurricane.json', 'lf-weather-hurricane', 'weather', ['weather','hurricane','wind'], 'Hurricane'],
  ['weather/thunder-storm.json', 'lf-weather-thunder', 'weather', ['weather','thunder','storm','lightning'], 'Thunder Storm'],
  ['weather/tornado.json', 'lf-weather-tornado', 'weather', ['weather','tornado','wind'], 'Tornado'],
  ['weather/windy.json', 'lf-weather-windy', 'weather', ['weather','wind','breeze'], 'Windy'],
];

let added = 0;
let skipped = 0;

for (const [relPath, id, category, tags, title] of ENTRIES) {
  const jsonUrl = `${BASE}/${encodeURI(relPath)}`;
  if (catalog.find((e) => e.id === id || e.jsonUrl === jsonUrl)) {
    skipped++;
    continue;
  }
  catalog.push({
    id,
    title,
    category,
    tags,
    jsonUrl,
    lottieUrl: null,
    preview: `https://github.com/xvrh/lottie-flutter/blob/master/example/assets/${encodeURI(relPath)}`,
    author: 'lottiefiles community (mirrored via xvrh/lottie-flutter)',
    source: 'github-mirror',
    license: 'Lottie Simple License',
    attributionRequired: false,
  });
  added++;
  process.stdout.write(`  + ${id} (${category})\n`);
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
console.log(`\nAdded ${added}, skipped ${skipped}. Total: ${catalog.length}`);
console.log('Run scripts/enrich-catalog.js next.');
