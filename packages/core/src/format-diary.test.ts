import { describe, it, expect } from 'vitest';
import { formatSnapshotAsDiary } from './format-diary.js';
import type { CitySnapshot, DataFile } from './types.js';

const mockSnapshot: CitySnapshot = {
  cityId: 'vienna',
  timestamp: '2026-02-15T15:00:00.000Z',
  air: {
    source: 'open-meteo',
    pm10: 6.0,
    pm2_5: 4.5,
    ozone: 80.0,
    no2: 3.3,
    so2: 1.2,
    co: 179.0,
  },
  weather: {
    source: 'open-meteo',
    temperature_c: 0.6,
    humidity_pct: 58,
    wind_speed_kmh: 17.1,
    wind_direction_deg: 330,
    pressure_hpa: 992.2,
    cloud_cover_pct: 52,
    weather_code: 2,
  },
  river: { source: 'open-meteo-flood', discharge_m3s: 1206.81 },
  local: null,
};

const mockData: DataFile = {
  latest: mockSnapshot,
  history: [],
};

describe('formatSnapshotAsDiary', () => {
  it('generates a diary entry with city name in title', () => {
    const result = formatSnapshotAsDiary(mockData, 'Vienna');

    expect(result.title).toContain('Vienna');
    expect(result.content).toContain('PM2.5');
    expect(result.tags).toContain('vienna');
    expect(result.tags).toContain('air-quality');
    expect(result.tags).toContain('environment');
  });

  it('includes trend info when history is available', () => {
    const withHistory: DataFile = {
      ...mockData,
      history: [
        {
          ...mockSnapshot,
          timestamp: '2026-02-15T14:30:00.000Z',
          air: { ...mockSnapshot.air, pm2_5: 8.0 },
        },
      ],
    };
    const result = formatSnapshotAsDiary(withHistory, 'Vienna');
    expect(result.content).toMatch(/improv|decreas|better|lower|stabl/i);
  });

  it('works for Paris', () => {
    const parisSnap: DataFile = {
      latest: { ...mockSnapshot, cityId: 'paris' },
      history: [],
    };
    const result = formatSnapshotAsDiary(parisSnap, 'Paris');
    expect(result.title).toContain('Paris');
    expect(result.tags).toContain('paris');
  });

  it('handles null river gracefully', () => {
    const noRiver: DataFile = {
      latest: { ...mockSnapshot, river: null },
      history: [],
    };
    const result = formatSnapshotAsDiary(noRiver, 'Vienna');
    expect(result.content).not.toContain('undefined');
  });
});
