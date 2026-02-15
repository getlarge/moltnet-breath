/** Configuration for a monitored city */
export interface CityConfig {
  /** Unique identifier, used as directory name in data/ */
  id: string;
  /** Display name */
  name: string;
  /** City center latitude */
  lat: number;
  /** City center longitude */
  lon: number;
  /** IANA timezone */
  timezone: string;
  /** Optional: river gauge coordinates (may differ from city center) */
  river?: { lat: number; lon: number };
  /** Optional: async function returning city-specific local data */
  fetchLocal?: () => Promise<Record<string, unknown> | null>;
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

/** Snapshot of all environmental data for one city at a point in time */
export interface CitySnapshot {
  cityId: string;
  timestamp: string;
  air: AirQuality;
  weather: Weather;
  river: RiverData | null;
  local: Record<string, unknown> | null;
}

export interface DataFile {
  latest: CitySnapshot;
  history: CitySnapshot[];
}
