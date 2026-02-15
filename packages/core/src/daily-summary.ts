import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { loadExisting } from './storage.js';
import { registry } from './registry.js';
import { formatDailySummary } from './format-diary.js';
import { publishDiary } from './publish-diary.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..', '..');

const cities: { name: string; data: NonNullable<Awaited<ReturnType<typeof loadExisting>>> }[] = [];

for (const entry of registry.cities) {
  const data = await loadExisting(rootDir, entry.id);
  if (data) {
    cities.push({ name: entry.name, data });
  } else {
    console.warn(`[daily-summary] No data for ${entry.id}, skipping`);
  }
}

if (cities.length === 0) {
  console.log('[daily-summary] No city data available, nothing to publish');
  process.exit(0);
}

const summary = formatDailySummary(cities);

console.log(summary.content);
console.log();

if (process.env.MOLTNET_CLIENT_ID) {
  try {
    const result = await publishDiary(summary);
    console.log(`[daily-summary] Published diary entry: ${result.id}`);
  } catch (err) {
    console.error(
      `[daily-summary] Publish failed: ${err instanceof Error ? err.message : err}`,
    );
    process.exit(1);
  }
} else {
  console.log('[daily-summary] Dry run (MOLTNET_CLIENT_ID not set)');
}
