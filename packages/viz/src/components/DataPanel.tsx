import type { CitySnapshot } from '@moltnet-breath/core';

interface Props {
  snapshot: CitySnapshot;
  cityName: string;
}

export function DataPanel({ snapshot }: Props) {
  const { air, weather, river } = snapshot;
  const ts = new Date(snapshot.timestamp);

  return (
    <div
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 13,
        color: '#8888a0',
        padding: 24,
        maxWidth: 400,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: '#e8e8f0', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 }}>
          Air
        </div>
        <div>PM2.5 {air.pm2_5} | PM10 {air.pm10} | O3 {air.ozone}</div>
        <div>NO2 {air.no2} | SO2 {air.so2} | CO {air.co}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: '#e8e8f0', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 }}>
          Weather
        </div>
        <div>{weather.temperature_c}°C | {weather.humidity_pct}% humidity</div>
        <div>Wind {weather.wind_speed_kmh} km/h | {weather.pressure_hpa} hPa</div>
      </div>
      {river && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#e8e8f0', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 }}>
            River
          </div>
          <div>{river.discharge_m3s.toFixed(0)} m³/s</div>
        </div>
      )}
      <div style={{ marginTop: 24, fontSize: 11, opacity: 0.5 }}>
        {ts.toISOString().slice(0, 16).replace('T', ' ')} UTC
      </div>
    </div>
  );
}
