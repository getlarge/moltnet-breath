import { fetchAll, saveSnapshot } from '@moltnet-breath/core';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { paris } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..', '..');

const snapshot = await fetchAll(paris);
const filePath = await saveSnapshot(rootDir, snapshot);

console.log(`[paris] Snapshot saved to ${filePath}`);
console.log(
  `  Air: PM10=${snapshot.air.pm10}, PM2.5=${snapshot.air.pm2_5}, O3=${snapshot.air.ozone}`,
);
console.log(
  `  Weather: ${snapshot.weather.temperature_c}°C, ${snapshot.weather.humidity_pct}% humidity`,
);
console.log(
  `  River: ${snapshot.river ? `${snapshot.river.discharge_m3s} m³/s` : 'N/A'}`,
);
