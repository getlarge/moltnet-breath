import type { Weather } from './types.js';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(
  lat: number,
  lon: number,
  timezone: string,
): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover,weather_code',
    timezone,
  });

  const res = await fetch(`${WEATHER_URL}?${params}`);
  if (!res.ok) {
    throw new Error(
      `Weather API error: ${res.status} ${res.statusText}`,
    );
  }
  const data = await res.json();
  const c = data.current;

  return {
    source: 'open-meteo',
    temperature_c: c.temperature_2m,
    humidity_pct: c.relative_humidity_2m,
    wind_speed_kmh: c.wind_speed_10m,
    wind_direction_deg: c.wind_direction_10m,
    pressure_hpa: c.surface_pressure,
    cloud_cover_pct: c.cloud_cover,
    weather_code: c.weather_code,
  };
}
