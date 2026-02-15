import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ViennaSnapshot, DataFile } from './types.js';
import { fetchAirQuality } from './fetch-air.js';
import { fetchWeather } from './fetch-weather.js';
import { fetchRiverDischarge } from './fetch-river.js';
import { fetchViennaReport } from './fetch-vienna-report.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const LATEST_PATH = join(DATA_DIR, 'latest.json');
const MAX_HISTORY = 48;

async function loadExisting(): Promise<DataFile | null> {
  try {
    const raw = await readFile(LATEST_PATH, 'utf-8');
    return JSON.parse(raw) as DataFile;
  } catch {
    return null;
  }
}

export async function fetchAll(): Promise<ViennaSnapshot> {
  const [air, weather, river, report] = await Promise.all([
    fetchAirQuality(),
    fetchWeather(),
    fetchRiverDischarge(),
    fetchViennaReport().catch((err) => {
      console.error('Vienna report fetch failed:', err);
      return null;
    }),
  ]);

  const snapshot: ViennaSnapshot = {
    timestamp: new Date().toISOString(),
    air,
    weather,
    river,
    report,
  };

  // Load existing data and roll history
  const existing = await loadExisting();
  const history = existing
    ? [existing.latest, ...existing.history].slice(0, MAX_HISTORY)
    : [];

  const dataFile: DataFile = { latest: snapshot, history };

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(LATEST_PATH, JSON.stringify(dataFile, null, 2));

  console.log(`Snapshot saved to ${LATEST_PATH}`);
  console.log(
    `Air: PM10=${air.pm10}, PM2.5=${air.pm2_5}, O3=${air.ozone}`
  );
  console.log(
    `Weather: ${weather.temperature_c}°C, ${weather.humidity_pct}% humidity`
  );
  console.log(`River: ${river.discharge_m3s} m³/s`);
  console.log(
    `Report: ${report ? `Index ${report.luftguete_index} (${report.index_label})` : 'unavailable'}`
  );

  return snapshot;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await fetchAll();
}
