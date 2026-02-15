import { describe, it, expect } from 'vitest';
import { fetchRiverDischarge } from './fetch-river.js';

describe('fetchRiverDischarge', () => {
  it('returns discharge > 0 for Danube (Vienna)', async () => {
    const river = await fetchRiverDischarge(48.2, 16.37);

    expect(river.source).toBe('open-meteo-flood');
    expect(typeof river.discharge_m3s).toBe('number');
    expect(river.discharge_m3s).toBeGreaterThan(0);
  });

  it('returns discharge for Seine (Paris)', async () => {
    const river = await fetchRiverDischarge(48.86, 2.35);

    expect(river.source).toBe('open-meteo-flood');
    expect(typeof river.discharge_m3s).toBe('number');
  });
});
