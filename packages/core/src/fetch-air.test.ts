import { describe, it, expect } from 'vitest';
import { fetchAirQuality } from './fetch-air.js';

describe('fetchAirQuality', () => {
  it('returns numeric fields >= 0 for Vienna coordinates', async () => {
    const air = await fetchAirQuality(48.2, 16.37, 'Europe/Vienna');

    expect(air.source).toBe('open-meteo');
    expect(air.pm10).toBeGreaterThanOrEqual(0);
    expect(air.pm2_5).toBeGreaterThanOrEqual(0);
    expect(air.ozone).toBeGreaterThanOrEqual(0);
    expect(air.no2).toBeGreaterThanOrEqual(0);
    expect(air.so2).toBeGreaterThanOrEqual(0);
    expect(air.co).toBeGreaterThanOrEqual(0);
  });

  it('returns numeric fields >= 0 for Paris coordinates', async () => {
    const air = await fetchAirQuality(48.86, 2.35, 'Europe/Paris');

    expect(air.source).toBe('open-meteo');
    expect(typeof air.pm10).toBe('number');
    expect(typeof air.no2).toBe('number');
  });
});
