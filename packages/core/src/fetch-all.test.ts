import { describe, it, expect } from 'vitest';
import type { CityConfig } from './types.js';
import { fetchAll } from './fetch-all.js';

const testConfig: CityConfig = {
  id: 'test-city',
  name: 'Test City',
  lat: 48.2,
  lon: 16.37,
  timezone: 'Europe/Vienna',
  river: { lat: 48.2, lon: 16.37 },
};

describe('fetchAll', () => {
  it('returns a complete snapshot for a city with river', async () => {
    const snap = await fetchAll(testConfig);

    expect(snap.cityId).toBe('test-city');
    expect(snap.timestamp).toBeTruthy();
    expect(snap.air.source).toBe('open-meteo');
    expect(snap.weather.source).toBe('open-meteo');
    expect(snap.river).not.toBeNull();
    expect(snap.local).toBeNull();
  });

  it('returns null river when no river config', async () => {
    const noRiver: CityConfig = { ...testConfig, river: undefined };
    const snap = await fetchAll(noRiver);

    expect(snap.river).toBeNull();
  });
});
