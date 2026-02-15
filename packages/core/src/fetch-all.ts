import type { CityConfig, CitySnapshot } from './types.js';
import { fetchAirQuality } from './fetch-air.js';
import { fetchWeather } from './fetch-weather.js';
import { fetchRiverDischarge } from './fetch-river.js';

export async function fetchAll(config: CityConfig): Promise<CitySnapshot> {
  const [air, weather, river, local] = await Promise.all([
    fetchAirQuality(config.lat, config.lon, config.timezone),
    fetchWeather(config.lat, config.lon, config.timezone),
    config.river
      ? fetchRiverDischarge(config.river.lat, config.river.lon).catch(
          () => null,
        )
      : Promise.resolve(null),
    config.fetchLocal
      ? config.fetchLocal().catch(() => null)
      : Promise.resolve(null),
  ]);

  return {
    cityId: config.id,
    timestamp: new Date().toISOString(),
    air,
    weather,
    river,
    local,
  };
}
