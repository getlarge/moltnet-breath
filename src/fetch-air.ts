import type { AirQuality } from './types.js';

const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const PARAMS = new URLSearchParams({
  latitude: '48.2',
  longitude: '16.37',
  current:
    'pm10,pm2_5,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide',
  timezone: 'Europe/Vienna',
});

export async function fetchAirQuality(): Promise<AirQuality> {
  const res = await fetch(`${AIR_QUALITY_URL}?${PARAMS}`);
  if (!res.ok) {
    throw new Error(`Air quality API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const c = data.current;

  return {
    source: 'open-meteo',
    pm10: c.pm10,
    pm2_5: c.pm2_5,
    ozone: c.ozone,
    no2: c.nitrogen_dioxide,
    so2: c.sulphur_dioxide,
    co: c.carbon_monoxide,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const air = await fetchAirQuality();
  console.log(JSON.stringify(air, null, 2));
}
