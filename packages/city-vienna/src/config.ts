import type { CityConfig } from '@moltnet-breath/core';
import { fetchViennaReport } from './fetch-report.js';

export const vienna: CityConfig = {
  id: 'vienna',
  name: 'Vienna',
  lat: 48.2,
  lon: 16.37,
  timezone: 'Europe/Vienna',
  river: { lat: 48.2, lon: 16.37 },
  fetchLocal: async () => {
    const report = await fetchViennaReport();
    return report ? (report as unknown as Record<string, unknown>) : null;
  },
};
