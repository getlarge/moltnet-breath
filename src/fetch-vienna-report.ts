import type { ViennaReport, StationReading } from './types.js';

const REPORT_URL = 'https://www.wien.gv.at/ma22-lgb/tb/tb-aktuell.htm';

const KNOWN_STATIONS = [
  'Stephansplatz',
  'Taborstraße',
  'AKH',
  'Belgradplatz',
  'Kaiser-Ebersdorf',
  'A23-Wehlistraße',
  'Gaudenzdorf',
  'Hietzinger Kai',
  'Kendlerstraße',
  'Schafberg',
  'Hohe Warte',
  'Gerichtsgasse',
  'Lobau',
  'Stadlau',
  'Liesing',
];

function parseNum(s: string): number | undefined {
  const trimmed = s.trim();
  if (!trimmed) return undefined;
  const n = parseFloat(trimmed);
  return isNaN(n) ? undefined : n;
}

function parseStationLine(line: string): StationReading | null {
  const name = KNOWN_STATIONS.find((s) => line.startsWith(s));
  if (!name) return null;

  // Split by pipe to get column groups
  const parts = line.split('|');
  if (parts.length < 9) return null;

  // parts[0] = station name
  // parts[1] = NO2 block: "  akt max  time  mw24 "
  // parts[2] = Ozone block: "  akt max  time  akt max "
  // parts[3] = B (Belastung index for ozone)
  // parts[4] = PM10 MW24
  // parts[5] = PM2.5 MW24
  // parts[6] = SO2 block: " akt max  mw24 "
  // parts[7] = CO block: " akt  max "

  const no2Block = parts[1].trim();
  const no2Tokens = no2Block.split(/\s+/);
  // First token is current HMW
  const no2_hmw = no2Tokens.length > 0 ? parseNum(no2Tokens[0]) : undefined;

  const o3Block = parts[2].trim();
  const o3Tokens = o3Block.split(/\s+/);
  // First token is current 1MW
  const o3_1mw = o3Tokens.length > 0 ? parseNum(o3Tokens[0]) : undefined;

  const pm10_mw24 = parseNum(parts[4]);
  const pm2_5_mw24 = parseNum(parts[5]);

  const so2Block = parts[6].trim();
  const so2Tokens = so2Block.split(/\s+/);
  const so2_hmw = so2Tokens.length > 0 ? parseNum(so2Tokens[0]) : undefined;

  const coBlock = parts[7].trim();
  const coTokens = coBlock.split(/\s+/);
  const co_mw8 = coTokens.length > 0 ? parseNum(coTokens[0]) : undefined;

  return {
    name,
    ...(no2_hmw !== undefined && { no2_hmw }),
    ...(o3_1mw !== undefined && { o3_1mw }),
    ...(pm10_mw24 !== undefined && { pm10_mw24 }),
    ...(pm2_5_mw24 !== undefined && { pm2_5_mw24 }),
    ...(so2_hmw !== undefined && { so2_hmw }),
    ...(co_mw8 !== undefined && { co_mw8 }),
  };
}

export async function fetchViennaReport(): Promise<ViennaReport | null> {
  const res = await fetch(REPORT_URL);
  if (!res.ok) {
    console.error(`Vienna report fetch failed: ${res.status}`);
    return null;
  }

  const html = await res.text();
  const preMatch = html.match(/<pre>([\s\S]*?)<\/pre>/i);
  if (!preMatch) {
    console.error('No <pre> block found in Vienna report');
    return null;
  }

  const preText = preMatch[1];

  // Parse index from line like "Die aktuelle Belastung heute um 16 Uhr:  Index 2 ... gut"
  const indexMatch = preText.match(
    /aktuelle Belastung.*Index\s+(\d)\s+\.\.\.\s+(.+)/
  );
  if (!indexMatch) {
    console.error('Could not parse Luftguete index');
    return null;
  }

  const luftguete_index = parseInt(indexMatch[1], 10);
  const index_label = indexMatch[2].trim();

  // Parse station lines
  const lines = preText.split('\n');
  const stations: StationReading[] = [];

  for (const line of lines) {
    const station = parseStationLine(line);
    if (station) {
      stations.push(station);
    }
  }

  return {
    source: 'wien.gv.at',
    luftguete_index,
    index_label,
    stations,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = await fetchViennaReport();
  console.log(JSON.stringify(report, null, 2));
}
