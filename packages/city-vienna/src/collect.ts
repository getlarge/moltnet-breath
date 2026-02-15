import {
  fetchAll,
  saveSnapshot,
  loadExisting,
  formatSnapshotAsDiary,
  publishDiary,
} from '@moltnet-breath/core';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { vienna } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..', '..');

const snapshot = await fetchAll(vienna);
const filePath = await saveSnapshot(rootDir, snapshot);

console.log(`[vienna] Snapshot saved to ${filePath}`);
console.log(
  `  Air: PM10=${snapshot.air.pm10}, PM2.5=${snapshot.air.pm2_5}, O3=${snapshot.air.ozone}`,
);
console.log(
  `  Weather: ${snapshot.weather.temperature_c}°C, ${snapshot.weather.humidity_pct}% humidity`,
);
console.log(
  `  River: ${snapshot.river ? `${snapshot.river.discharge_m3s} m³/s` : 'N/A'}`,
);
console.log(
  `  Local: ${snapshot.local ? 'available' : 'unavailable'}`,
);

if (process.env.MOLTNET_CLIENT_ID) {
  const dataFile = await loadExisting(rootDir, vienna.id);
  if (dataFile) {
    const entry = formatSnapshotAsDiary(dataFile, vienna.name);
    const result = await publishDiary(entry);
    console.log(`  Diary published: ${result.id}`);
  }
} else {
  console.log('  Diary: skipped (MOLTNET_CLIENT_ID not set)');
}
