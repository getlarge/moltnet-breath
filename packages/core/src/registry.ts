export interface CityEntry {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface Registry {
  cities: CityEntry[];
}

/** Static registry — updated when adding a new city */
export const registry: Registry = {
  cities: [
    { id: 'vienna', name: 'Vienna', lat: 48.2, lon: 16.37 },
    { id: 'paris', name: 'Paris', lat: 48.86, lon: 2.35 },
  ],
};

/** Build a data URL for a city's latest.json (relative to repo root on GH Pages) */
export function cityDataUrl(cityId: string, base = ''): string {
  return `${base}/data/${cityId}/latest.json`;
}
