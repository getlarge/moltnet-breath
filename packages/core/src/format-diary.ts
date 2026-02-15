import type { DataFile } from './types.js';

export interface DiaryContent {
  title: string;
  content: string;
  tags: string[];
}

const WEATHER_CODES: Record<number, string> = {
  0: 'clear sky',
  1: 'mainly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'depositing rime fog',
  51: 'light drizzle',
  53: 'moderate drizzle',
  55: 'dense drizzle',
  61: 'slight rain',
  63: 'moderate rain',
  65: 'heavy rain',
  71: 'slight snow',
  73: 'moderate snow',
  75: 'heavy snow',
  80: 'slight rain showers',
  81: 'moderate rain showers',
  85: 'slight snow showers',
  95: 'thunderstorm',
};

function describePM25(val: number): string {
  if (val <= 5) return 'excellent';
  if (val <= 10) return 'good';
  if (val <= 25) return 'moderate';
  if (val <= 50) return 'poor';
  return 'hazardous';
}

function windDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function trendDescription(current: number, previous: number): string {
  const diff = current - previous;
  const pct =
    previous > 0 ? Math.abs(diff / previous) * 100 : 0;
  if (pct < 5) return 'stable';
  return diff > 0
    ? `increasing (+${pct.toFixed(0)}%)`
    : `decreasing (-${pct.toFixed(0)}%)`;
}

export function formatSnapshotAsDiary(
  data: DataFile,
  cityName: string,
): DiaryContent {
  const { latest, history } = data;
  const { air, weather, river } = latest;
  const cityId = latest.cityId;
  const ts = new Date(latest.timestamp);
  const timeStr = ts.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';

  const weatherDesc =
    WEATHER_CODES[weather.weather_code] ?? 'unknown conditions';
  const pm25Quality = describePM25(air.pm2_5);

  let content = `## ${cityName} Environmental Report — ${timeStr}\n\n`;

  content += `### Air\n`;
  content += `PM2.5: ${air.pm2_5} ug/m3 (${pm25Quality}) | PM10: ${air.pm10} ug/m3\n`;
  content += `O3: ${air.ozone} ug/m3 | NO2: ${air.no2} ug/m3 | SO2: ${air.so2} ug/m3 | CO: ${air.co} ug/m3\n\n`;

  content += `### Weather\n`;
  content += `${weather.temperature_c}C, ${weatherDesc}, ${weather.cloud_cover_pct}% clouds\n`;
  content += `Wind: ${weather.wind_speed_kmh} km/h from ${windDirection(weather.wind_direction_deg)} | `;
  content += `Humidity: ${weather.humidity_pct}% | Pressure: ${weather.pressure_hpa} hPa\n\n`;

  if (river) {
    content += `### River\n`;
    content += `Discharge: ${river.discharge_m3s.toFixed(0)} m3/s\n\n`;
  }

  if (history.length > 0) {
    const prev = history[0];
    content += `### Trends\n`;
    content += `PM2.5: ${trendDescription(air.pm2_5, prev.air.pm2_5)} | `;
    content += `Temperature: ${trendDescription(weather.temperature_c, prev.weather.temperature_c)}`;
    if (river && prev.river) {
      content += ` | River: ${trendDescription(river.discharge_m3s, prev.river.discharge_m3s)}`;
    }
    content += `\n`;
  }

  const title = `${cityName} Breath — ${ts.toISOString().slice(0, 10)}`;

  const tags = [
    cityId,
    'air-quality',
    'environment',
    `aqi-${pm25Quality}`,
  ];

  return { title, content, tags };
}
