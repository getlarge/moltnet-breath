import { describe, it, expect } from 'vitest';
import { fetchAll } from '@moltnet-breath/core';
import { paris } from './config.js';

describe('Paris city config', () => {
  it('produces a valid snapshot with all core data', async () => {
    const snap = await fetchAll(paris);

    expect(snap.cityId).toBe('paris');
    expect(snap.air.source).toBe('open-meteo');
    expect(snap.weather.source).toBe('open-meteo');
    expect(snap.river).not.toBeNull();
    expect(snap.local).toBeNull();
  });
});
