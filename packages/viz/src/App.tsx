import { useState } from 'react';
import { BreathingOrb } from './components/BreathingOrb.js';
import { DataPanel } from './components/DataPanel.js';
import { useCityData } from './hooks/useCityData.js';
import type { CityDataState } from './hooks/useCityData.js';

export function App() {
  const cities = useCityData();
  const [selected, setSelected] = useState<string | null>(null);

  const allLoading = cities.every((c) => c.loading);
  if (allLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#8888a0' }}>
        Loading city data...
      </div>
    );
  }

  const selectedCity = selected
    ? cities.find((c) => c.city.id === selected)
    : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 40,
        gap: 32,
      }}
    >
      <h1
        style={{
          fontSize: 14,
          textTransform: 'uppercase',
          letterSpacing: 4,
          color: '#8888a0',
          fontFamily: 'Inter, system-ui',
        }}
      >
        Breath
      </h1>

      {selected && (
        <button
          onClick={() => setSelected(null)}
          style={{
            background: 'none',
            border: '1px solid #333',
            color: '#8888a0',
            padding: '6px 16px',
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
          }}
        >
          ← All cities
        </button>
      )}

      {!selected && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 40,
          }}
        >
          {cities.map((c) => (
            <CityOrb
              key={c.city.id}
              state={c}
              onClick={() => setSelected(c.city.id)}
            />
          ))}
        </div>
      )}

      {selectedCity?.data && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <BreathingOrb
            pm25={selectedCity.data.latest.air.pm2_5}
            windSpeed={selectedCity.data.latest.weather.wind_speed_kmh}
            discharge={selectedCity.data.latest.river?.discharge_m3s ?? null}
            temperature={selectedCity.data.latest.weather.temperature_c}
            cityName={selectedCity.city.name}
            size={400}
          />
          <DataPanel
            snapshot={selectedCity.data.latest}
            cityName={selectedCity.city.name}
          />
        </div>
      )}
    </div>
  );
}

function CityOrb({
  state,
  onClick,
}: {
  state: CityDataState;
  onClick: () => void;
}) {
  if (state.loading) {
    return (
      <div style={{ width: 200, textAlign: 'center', color: '#555' }}>
        Loading {state.city.name}...
      </div>
    );
  }

  if (state.error || !state.data) {
    return (
      <div style={{ width: 200, textAlign: 'center', color: '#e83030' }}>
        {state.city.name}: {state.error ?? 'no data'}
      </div>
    );
  }

  const { air, weather, river } = state.data.latest;

  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <BreathingOrb
        pm25={air.pm2_5}
        windSpeed={weather.wind_speed_kmh}
        discharge={river?.discharge_m3s ?? null}
        temperature={weather.temperature_c}
        cityName={state.city.name}
        size={200}
      />
    </div>
  );
}
