import { describe, it, expect } from 'vitest';
import { formatDailySummary } from './format-diary.js';
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

describe('formatDailySummary', () => {
  it('generates an ASCII art summary with city name', () => {
    const result = formatDailySummary([{ name: 'Vienna', data: mockData }]);

    expect(result.title).toContain('Breath');
    expect(result.content).toContain('VIENNA');
    expect(result.content).toContain('PM2.5');
    expect(result.tags).toContain('vienna');
    expect(result.tags).toContain('daily-summary');
  });

  it('includes trend arrows when history is available', () => {
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
    const result = formatDailySummary([
      { name: 'Vienna', data: withHistory },
    ]);
    expect(result.content).toMatch(/[↑↓→]/);
  });

  it('includes comparison block for multiple cities', () => {
    const parisData: DataFile = {
      latest: { ...mockSnapshot, cityId: 'paris' },
      history: [],
    };
    const result = formatDailySummary([
      { name: 'Vienna', data: mockData },
      { name: 'Paris', data: parisData },
    ]);
    expect(result.content).toContain('VIENNA');
    expect(result.content).toContain('PARIS');
    expect(result.content).toContain('comparison');
    expect(result.content).toContain('temp spread');
    expect(result.tags).toContain('vienna');
    expect(result.tags).toContain('paris');
  });

  it('handles null river gracefully', () => {
    const noRiver: DataFile = {
      latest: { ...mockSnapshot, river: null },
      history: [],
    };
    const result = formatDailySummary([{ name: 'Vienna', data: noRiver }]);
    expect(result.content).not.toContain('undefined');
    expect(result.content).not.toContain('river');
  });
});
