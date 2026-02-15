import { describe, it, expect } from 'vitest';
import { fetchAirQuality } from './fetch-air.js';

describe('fetchAirQuality', () => {
  it('returns all fields as numbers >= 0', async () => {
    const air = await fetchAirQuality();

    expect(air.source).toBe('open-meteo');
    expect(air.pm10).toBeGreaterThanOrEqual(0);
    expect(air.pm2_5).toBeGreaterThanOrEqual(0);
    expect(air.ozone).toBeGreaterThanOrEqual(0);
    expect(air.no2).toBeGreaterThanOrEqual(0);
    expect(air.so2).toBeGreaterThanOrEqual(0);
    expect(air.co).toBeGreaterThanOrEqual(0);

    expect(typeof air.pm10).toBe('number');
    expect(typeof air.pm2_5).toBe('number');
    expect(typeof air.ozone).toBe('number');
    expect(typeof air.no2).toBe('number');
    expect(typeof air.so2).toBe('number');
    expect(typeof air.co).toBe('number');
  });
});
