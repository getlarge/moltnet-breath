import type { RiverData } from './types.js';

const FLOOD_URL = 'https://flood-api.open-meteo.com/v1/flood';

const PARAMS = new URLSearchParams({
  latitude: '48.2',
  longitude: '16.37',
  daily: 'river_discharge',
  past_days: '1',
  forecast_days: '1',
  timezone: 'Europe/Vienna',
});

export async function fetchRiverDischarge(): Promise<RiverData> {
  const res = await fetch(`${FLOOD_URL}?${PARAMS}`);
  if (!res.ok) {
    throw new Error(`Flood API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  const today = new Date().toISOString().slice(0, 10);
  const dates: string[] = data.daily.time;
  const discharges: number[] = data.daily.river_discharge;

  let idx = dates.indexOf(today);
  if (idx === -1) {
    // Fall back to the last available entry
    idx = dates.length - 1;
  }

  return {
    source: 'open-meteo-flood',
    discharge_m3s: discharges[idx],
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const river = await fetchRiverDischarge();
  console.log(JSON.stringify(river, null, 2));
}
