import { describe, it, expect } from 'vitest';
import { fetchWeather } from './fetch-weather.js';

describe('fetchWeather', () => {
  it('returns all fields as numbers with temperature in valid range', async () => {
    const w = await fetchWeather();

    expect(w.source).toBe('open-meteo');
    expect(typeof w.temperature_c).toBe('number');
    expect(typeof w.humidity_pct).toBe('number');
    expect(typeof w.wind_speed_kmh).toBe('number');
    expect(typeof w.wind_direction_deg).toBe('number');
    expect(typeof w.pressure_hpa).toBe('number');
    expect(typeof w.cloud_cover_pct).toBe('number');
    expect(typeof w.weather_code).toBe('number');

    expect(w.temperature_c).toBeGreaterThanOrEqual(-50);
    expect(w.temperature_c).toBeLessThanOrEqual(60);
  });
});
