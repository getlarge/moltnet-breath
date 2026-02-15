import { describe, it, expect } from 'vitest';
import { fetchViennaReport } from './fetch-report.js';

describe('fetchViennaReport', () => {
  it('returns index 1-6, non-empty stations, Stephansplatz present', async () => {
    const report = await fetchViennaReport();

    expect(report).not.toBeNull();
    if (!report) return;

    expect(report.source).toBe('wien.gv.at');
    expect(report.luftguete_index).toBeGreaterThanOrEqual(1);
    expect(report.luftguete_index).toBeLessThanOrEqual(6);
    expect(report.index_label.length).toBeGreaterThan(0);
    expect(report.stations.length).toBeGreaterThan(0);

    const stephansplatz = report.stations.find(
      (s) => s.name === 'Stephansplatz',
    );
    expect(stephansplatz).toBeDefined();
  });
});
