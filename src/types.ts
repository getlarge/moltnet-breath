/** Snapshot of all Vienna environmental data at a point in time */
export interface ViennaSnapshot {
  timestamp: string; // ISO 8601
  air: AirQuality;
  weather: Weather;
  river: RiverData;
  report: ViennaReport | null;
}

export interface AirQuality {
  source: 'open-meteo';
  pm10: number;
  pm2_5: number;
  ozone: number;
  no2: number;
  so2: number;
  co: number;
}

export interface Weather {
  source: 'open-meteo';
  temperature_c: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  pressure_hpa: number;
  cloud_cover_pct: number;
  weather_code: number;
}

export interface RiverData {
  source: 'open-meteo-flood';
  discharge_m3s: number;
}

export interface ViennaReport {
  source: 'wien.gv.at';
  luftguete_index: number;
  index_label: string;
  stations: StationReading[];
}

export interface StationReading {
  name: string;
  no2_hmw?: number;
  o3_1mw?: number;
  pm10_mw24?: number;
  pm2_5_mw24?: number;
  so2_hmw?: number;
  co_mw8?: number;
}

export interface DataFile {
  latest: ViennaSnapshot;
  history: ViennaSnapshot[];
}
