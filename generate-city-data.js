#!/usr/bin/env node
/**
 * generate-city-data.js
 * ──────────────────────────────────────────────────────────────────────────
 * Generates "Top Things To Do" and "Top Restaurants" for every city in
 * The Time Sphere by calling the Anthropic Claude API. Saves results to
 * city-data.json in the project root.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node generate-city-data.js
 *   ANTHROPIC_API_KEY=sk-ant-... node generate-city-data.js --resume
 *
 * --resume  Skips cities already present in city-data.json so you can
 *           safely restart after an interruption without re-spending tokens.
 */

'use strict';

const fs   = require('fs');
const vm   = require('vm');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────
const API_KEY     = process.env.ANTHROPIC_API_KEY;
const MODEL       = 'claude-sonnet-4-6';
const MAX_TOKENS  = 600;
const DELAY_MS    = 500;          // ms between requests to avoid rate limits
const OUTPUT_FILE = path.join(__dirname, 'city-data.json');
const APP_JS      = path.join(__dirname, 'app.js');
const RESUME      = process.argv.includes('--resume');

if (!API_KEY) {
  console.error('\nError: ANTHROPIC_API_KEY is not set.');
  console.error('Usage: ANTHROPIC_API_KEY=sk-ant-... node generate-city-data.js\n');
  process.exit(1);
}

// ── Extract CITIES array from app.js ────────────────────────────────────────
function loadCities() {
  const src = fs.readFileSync(APP_JS, 'utf8');

  const marker = 'const CITIES = [';
  const startIdx = src.indexOf(marker);
  if (startIdx === -1) throw new Error('Could not find "const CITIES = [" in app.js');

  // Walk forward counting brackets to find the matching closing ]
  let depth = 0;
  let endIdx = startIdx + marker.length - 1; // position of opening [
  for (let i = endIdx; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') {
      depth--;
      if (depth === 0) { endIdx = i + 1; break; }
    }
  }

  const arraySrc = src.slice(startIdx + 'const CITIES = '.length, endIdx);

  // Evaluate the array literal in a sandboxed VM context
  const sandbox = Object.create(null);
  vm.createContext(sandbox);
  const cities = vm.runInContext(`(${arraySrc})`, sandbox);
  if (!Array.isArray(cities)) throw new Error('CITIES did not evaluate to an array');
  return cities;
}

// ── Build the prompt for one city ───────────────────────────────────────────
function buildPrompt(city) {
  const location = city.state
    ? `${city.name}, ${city.state}, ${city.country}`
    : `${city.name}, ${city.country}`;

  return `For the city of ${location}, give me exactly this JSON format and nothing else:
{
  "todo": [
    {"name": "attraction name", "desc": "one sentence description"},
    {"name": "attraction name", "desc": "one sentence description"},
    {"name": "attraction name", "desc": "one sentence description"}
  ],
  "restaurants": [
    {"name": "restaurant name", "desc": "cuisine type and one sentence why it's great"},
    {"name": "restaurant name", "desc": "cuisine type and one sentence why it's great"},
    {"name": "restaurant name", "desc": "cuisine type and one sentence why it's great"}
  ]
}`;
}

// ── Single API call (no retry logic here — handled by fetchWithRetry) ────────
async function callApi(city) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: MAX_TOKENS,
      messages:   [{ role: 'user', content: buildPrompt(city) }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '(no body)');
    throw new Error(`HTTP ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const raw  = data.content[0].text.trim();

  // Strip optional markdown code fences the model sometimes adds
  const clean = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  return JSON.parse(clean); // throws if malformed — caller will retry
}

// ── Fetch with one retry on JSON parse failure ───────────────────────────────
async function fetchWithRetry(city) {
  try {
    return await callApi(city);
  } catch (firstErr) {
    // Only retry on parse errors, not on HTTP errors (which are unlikely to fix themselves)
    const isParseError = firstErr instanceof SyntaxError
      || firstErr.message.startsWith('JSON');
    if (!isParseError) throw firstErr;

    const label = city.state
      ? `${city.name}, ${city.state}`
      : city.name;
    console.warn(`  ⚠  JSON parse failed for ${label} — retrying once…`);
    await sleep(DELAY_MS);
    return await callApi(city); // second attempt; throw on failure
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cityLabel(city) {
  return city.state
    ? `${city.name}, ${city.state}, ${city.country}`
    : `${city.name}, ${city.country}`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌍  The Time Sphere — City Data Generator');
  console.log('─'.repeat(52));

  let cities;
  try {
    cities = loadCities();
  } catch (err) {
    console.error(`Failed to load cities from app.js: ${err.message}`);
    process.exit(1);
  }
  console.log(`Loaded ${cities.length} cities from app.js`);

  // Load existing output when resuming
  let output = {};
  if (RESUME && fs.existsSync(OUTPUT_FILE)) {
    try {
      output = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      const n = Object.keys(output).length;
      console.log(`Resuming — ${n} cities already cached, skipping them.`);
    } catch {
      console.warn('Could not parse existing city-data.json — starting fresh.');
      output = {};
    }
  }

  console.log(`Model: ${MODEL}  |  Delay: ${DELAY_MS}ms  |  Resume: ${RESUME}\n`);

  const total     = cities.length;
  const startTime = Date.now();
  let   succeeded = 0;
  let   skipped   = 0;
  let   failed    = 0;
  const failures  = [];

  for (let i = 0; i < cities.length; i++) {
    const city  = cities[i];
    const num   = `[${String(i + 1).padStart(3)}/${total}]`;
    const label = cityLabel(city);

    // Skip if already done and --resume is set
    if (RESUME && output[city.id]) {
      console.log(`${num} ${label} — skipped (cached)`);
      skipped++;
      succeeded++;
      continue;
    }

    try {
      const result    = await fetchWithRetry(city);
      output[city.id] = result;
      succeeded++;
      console.log(`${num} ${label} ✓`);

      // Write after every successful city so progress survives interruption
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    } catch (err) {
      failed++;
      failures.push({ id: city.id, label, error: err.message });
      console.error(`${num} ${label} ✗  ${err.message}`);
    }

    // Delay before next request (skip after the last city)
    if (i < cities.length - 1) await sleep(DELAY_MS);
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n' + '─'.repeat(52));
  console.log(`Completed in ${elapsed}s`);
  console.log(`  Total cities:  ${total}`);
  console.log(`  Succeeded:     ${succeeded} (${skipped} from cache)`);
  console.log(`  Failed:        ${failed}`);

  if (failures.length) {
    console.log('\nFailed cities (re-run with --resume to retry):');
    failures.forEach((f) => console.log(`  ${f.id.padEnd(20)} ${f.error}`));
  }

  if (succeeded > 0) {
    console.log(`\nOutput saved → ${OUTPUT_FILE}`);
  }
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
