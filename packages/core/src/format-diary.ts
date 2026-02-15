import type { DataFile } from './types.js';

export interface DiaryContent {
  title: string;
  content: string;
  tags: string[];
}

const WEATHER_CODES: Record<number, string> = {
  0: '☀',
  1: '🌤',
  2: '⛅',
  3: '☁',
  45: '🌫',
  48: '🌫',
  51: '🌦',
  53: '🌧',
  55: '🌧',
  61: '🌧',
  63: '🌧',
  65: '⛈',
  71: '🌨',
  73: '🌨',
  75: '❄',
  80: '🌦',
  81: '🌧',
  85: '🌨',
  95: '⛈',
};

function aqiBar(pm25: number): string {
  // 0-50 scale mapped to 20-char bar
  const filled = Math.min(20, Math.round((pm25 / 50) * 20));
  const level =
    pm25 <= 5
      ? '░'
      : pm25 <= 10
        ? '▒'
        : pm25 <= 25
          ? '▓'
          : '█';
  return level.repeat(filled) + '·'.repeat(20 - filled);
}

function tempScale(c: number): string {
  // -10 to 40 range → 20-char spark
  const norm = Math.min(20, Math.max(0, Math.round(((c + 10) / 50) * 20)));
  return '─'.repeat(norm) + '◆' + '─'.repeat(20 - norm);
}

function windArrow(deg: number): string {
  const arrows = ['↓', '↙', '←', '↖', '↑', '↗', '→', '↘'];
  return arrows[Math.round(deg / 45) % 8];
}

function riverBar(m3s: number, max: number): string {
  const filled = Math.min(20, Math.round((m3s / max) * 20));
  return '~'.repeat(filled) + ' '.repeat(20 - filled);
}

function trendArrow(current: number, previous: number): string {
  const pct = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  if (Math.abs(pct) < 5) return '→';
  return pct > 0 ? '↑' : '↓';
}

function cityBlock(name: string, data: DataFile): string {
  const { latest, history } = data;
  const { air, weather, river } = latest;
  const wx = WEATHER_CODES[weather.weather_code] ?? '?';
  const prev = history.length > 0 ? history[0] : null;

  const pmTrend = prev ? ` ${trendArrow(air.pm2_5, prev.air.pm2_5)}` : '';
  const tempTrend = prev
    ? ` ${trendArrow(weather.temperature_c, prev.weather.temperature_c)}`
    : '';

  let block = '';
  block += `┌─── ${name.toUpperCase()} ${'─'.repeat(Math.max(0, 28 - name.length))}┐\n`;
  block += `│ ${wx} ${weather.temperature_c.toFixed(1)}°C${tempTrend}  ${weather.humidity_pct}% rh  ${weather.pressure_hpa} hPa │\n`;
  block += `│   wind ${windArrow(weather.wind_direction_deg)} ${weather.wind_speed_kmh.toFixed(0)} km/h                      │\n`;
  block += `│                                    │\n`;
  block += `│ PM2.5 [${aqiBar(air.pm2_5)}] ${air.pm2_5.toFixed(1).padStart(5)}${pmTrend} │\n`;
  block += `│ PM10  [${aqiBar(air.pm10)}] ${air.pm10.toFixed(1).padStart(5)}  │\n`;
  block += `│ temp  [${tempScale(weather.temperature_c)}]        │\n`;

  if (river) {
    const maxDischarge = Math.max(
      river.discharge_m3s,
      ...(history.filter((h) => h.river).map((h) => h.river!.discharge_m3s)),
      1,
    );
    block += `│ river [${riverBar(river.discharge_m3s, maxDischarge)}] ${river.discharge_m3s.toFixed(0).padStart(5)} │\n`;
  }

  block += `└────────────────────────────────────┘`;
  return block;
}

export function formatDailySummary(
  cities: { name: string; data: DataFile }[],
): DiaryContent {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);

  let content = '';
  content += '```\n';
  content += `╔══════════════════════════════════════╗\n`;
  content += `║   B R E A T H   ·   ${dateStr}    ║\n`;
  content += `╚══════════════════════════════════════╝\n`;
  content += '\n';

  for (const city of cities) {
    content += cityBlock(city.name, city.data);
    content += '\n\n';
  }

  // comparative line
  if (cities.length > 1) {
    const temps = cities.map((c) => c.data.latest.weather.temperature_c);
    const pms = cities.map((c) => c.data.latest.air.pm2_5);
    const spread = Math.max(...temps) - Math.min(...temps);
    const cleanest = cities[pms.indexOf(Math.min(...pms))].name;

    content += `── comparison ──────────────────────────\n`;
    content += `  temp spread: ${spread.toFixed(1)}°C\n`;
    content += `  cleanest air: ${cleanest}\n`;
  }

  content += '```';

  const title = `Breath · ${dateStr}`;
  const tags = [
    'daily-summary',
    'environment',
    'air-quality',
    ...cities.map((c) => c.data.latest.cityId),
  ];

  return { title, content, tags };
}

/** @deprecated Use formatDailySummary instead */
export function formatSnapshotAsDiary(
  data: DataFile,
  cityName: string,
): DiaryContent {
  return formatDailySummary([{ name: cityName, data }]);
}
