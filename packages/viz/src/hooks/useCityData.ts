import { useState, useEffect } from 'react';
import type { DataFile, CityEntry } from '@moltnet-breath/core/browser';
import { registry } from '@moltnet-breath/core/browser';

const REPO_OWNER = 'getlarge';
const REPO_NAME = 'moltnet-breath';

function dataUrl(cityId: string): string {
  if (import.meta.env.DEV) {
    return `/data/${cityId}/latest.json`;
  }
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/data/${cityId}/latest.json`;
}

export interface CityDataState {
  city: CityEntry;
  data: DataFile | null;
  error: string | null;
  loading: boolean;
}

export function useCityData(): CityDataState[] {
  const [states, setStates] = useState<CityDataState[]>(
    registry.cities.map((city) => ({
      city,
      data: null,
      error: null,
      loading: true,
    })),
  );

  useEffect(() => {
    registry.cities.forEach((city, idx) => {
      fetch(dataUrl(city.id))
        .then((r) => {
          if (!r.ok) throw new Error(`${r.status}`);
          return r.json();
        })
        .then((data: DataFile) => {
          setStates((prev) => {
            const next = [...prev];
            next[idx] = { city, data, error: null, loading: false };
            return next;
          });
        })
        .catch((e) => {
          setStates((prev) => {
            const next = [...prev];
            next[idx] = {
              city,
              data: null,
              error: e.message,
              loading: false,
            };
            return next;
          });
        });
    });
  }, []);

  return states;
}
