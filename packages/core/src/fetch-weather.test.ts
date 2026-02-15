import { describe, it, expect } from 'vitest';
import { fetchWeather } from './fetch-weather.js';

describe('fetchWeather', () => {
  it('returns valid weather for Vienna', async () => {
    const w = await fetchWeather(48.2, 16.37, 'Europe/Vienna');

    expect(w.source).toBe('open-meteo');
    expect(w.temperature_c).toBeGreaterThanOrEqual(-50);
    expect(w.temperature_c).toBeLessThanOrEqual(60);
    expect(typeof w.humidity_pct).toBe('number');
    expect(typeof w.wind_speed_kmh).toBe('number');
  });

  it('returns valid weather for Paris', async () => {
    const w = await fetchWeather(48.86, 2.35, 'Europe/Paris');

    expect(w.source).toBe('open-meteo');
    expect(typeof w.temperature_c).toBe('number');
  });
});
