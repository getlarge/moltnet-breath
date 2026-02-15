# moltnet-breath

An environmental monitoring agent that observes the breath of cities — their air, weather, and rivers. Inspired by [The Ultimate Breath](https://www.weltmuseumwien.at/en/exhibitions/the-ultimate-breath/) at the Weltmuseum Wien.

```
╔══════════════════════════════════════╗
║   B R E A T H   ·   2026-02-15    ║
╚══════════════════════════════════════╝

┌─── VIENNA ──────────────────────┐
│ 🌤 -1.1°C    61% rh  989.8 hPa │
│   wind ↓ 8 km/h                 │
│                                  │
│ PM2.5 [▓▓▓▓▓···············] 12 │
│ temp  [────◆────────────────]    │
│ river [~~~~~~~~~~~~~~~~~~~~] 1402│
└──────────────────────────────────┘

┌─── PARIS ───────────────────────┐
│ ⛅ 9.5°C    88% rh  994.9 hPa  │
│   wind → 13 km/h                │
│                                  │
│ PM2.5 [▒▒▒▒················] 10 │
│ temp  [────────◆────────────]    │
│ river [~~~~~~~~~~~~~~~~~~~~]   2 │
└──────────────────────────────────┘
```

## What it does

Every 30 minutes, a GitHub Actions cron job collects public environmental data for each monitored city:

- **Air quality** — PM2.5, PM10, O3, NO2, SO2, CO (Open-Meteo Air Quality API)
- **Weather** — temperature, humidity, wind, pressure, cloud cover (Open-Meteo Weather API)
- **River discharge** — m³/s (Open-Meteo Flood API)
- **Local sources** — Vienna Luftgütebericht station data (HTML scraping)

Snapshots are committed to `data/<city>/latest.json` with a 48-entry rolling history (~24h).

Once a day at 18:00 UTC, a summary is generated and published as a private diary entry to [MoltNet](https://themolt.net).

## Cities

| City   | Air | Weather | River    | Local source               |
|--------|-----|---------|----------|-----------------------------|
| Vienna | ✓   | ✓       | Danube   | Luftgütebericht (wien.gv.at) |
| Paris  | ✓   | ✓       | Seine    | —                           |

## Visualization

A living data page shows breathing orbs for each city — color encodes air quality, pulse rate follows the wind, and a ring around each orb represents river discharge.

**Live:** [getlarge.github.io/moltnet-breath](https://getlarge.github.io/moltnet-breath/)

## Structure

```
moltnet-breath/
├── packages/
│   ├── core/          # Shared types, fetchers, formatters, auth, storage
│   ├── city-vienna/   # Vienna config + Luftgütebericht parser
│   ├── city-paris/    # Paris config
│   └── viz/           # React visualization (Vite, deployed to GH Pages)
├── data/              # Committed snapshots (auto-updated by CI)
├── prompts/           # Claude reflection prompt
└── .github/workflows/
    ├── collect.yml        # Every 30min: fetch data, commit snapshots
    ├── daily-summary.yml  # Daily: ASCII art summary → MoltNet diary
    ├── reflect.yml        # Daily: Claude CLI reflection → MoltNet diary (public)
    └── deploy-viz.yml     # On data/viz changes: build + deploy to GH Pages
```

## Adding a city

1. Create `packages/city-<id>/` with a `CityConfig` and `collect.ts`
2. Add the city to `packages/core/src/registry.ts`
3. Add a `collect:<id>` script to root `package.json`
4. Add the collect step to `.github/workflows/collect.yml`

## Development

```bash
pnpm install
pnpm test
pnpm collect:vienna    # run a local collection
pnpm daily-summary     # preview the ASCII art summary (dry run without secrets)
pnpm dev:viz           # start the viz dev server
```

## Data sources

All environmental data comes from free, public APIs — no API keys needed for collection:

- [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
- [Open-Meteo Weather API](https://open-meteo.com/en/docs)
- [Open-Meteo Flood API](https://open-meteo.com/en/docs/flood-api)
- [Vienna Luftgütebericht](https://www.wien.gv.at/ma22-lgb/luftguete.htm)

Diary publishing requires [MoltNet](https://themolt.net) OAuth2 credentials (`MOLTNET_CLIENT_ID`, `MOLTNET_CLIENT_SECRET`, `ORY_PROJECT_URL`, `MOLTNET_API_URL`).
