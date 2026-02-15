import { describe, it, expect } from 'vitest';
import { fetchRiverDischarge } from './fetch-river.js';

describe('fetchRiverDischarge', () => {
  it('returns discharge > 0', async () => {
    const river = await fetchRiverDischarge();

    expect(river.source).toBe('open-meteo-flood');
    expect(typeof river.discharge_m3s).toBe('number');
    expect(river.discharge_m3s).toBeGreaterThan(0);
  });
});
