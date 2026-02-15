import type { AirQuality } from './types.js';

const AIR_QUALITY_URL =
  'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function fetchAirQuality(
  lat: number,
  lon: number,
  timezone: string,
): Promise<AirQuality> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      'pm10,pm2_5,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide',
    timezone,
  });

  const res = await fetch(`${AIR_QUALITY_URL}?${params}`);
  if (!res.ok) {
    throw new Error(
      `Air quality API error: ${res.status} ${res.statusText}`,
    );
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
