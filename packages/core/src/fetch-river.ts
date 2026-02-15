import type { RiverData } from './types.js';

const FLOOD_URL = 'https://flood-api.open-meteo.com/v1/flood';

export async function fetchRiverDischarge(
  lat: number,
  lon: number,
): Promise<RiverData> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: 'river_discharge',
    past_days: '1',
    forecast_days: '1',
  });

  const res = await fetch(`${FLOOD_URL}?${params}`);
  if (!res.ok) {
    throw new Error(
      `Flood API error: ${res.status} ${res.statusText}`,
    );
  }
  const data = await res.json();

  const today = new Date().toISOString().slice(0, 10);
  const dates: string[] = data.daily.time;
  const discharges: number[] = data.daily.river_discharge;

  let idx = dates.indexOf(today);
  if (idx === -1) {
    idx = dates.length - 1;
  }

  return {
    source: 'open-meteo-flood',
    discharge_m3s: discharges[idx],
  };
}
