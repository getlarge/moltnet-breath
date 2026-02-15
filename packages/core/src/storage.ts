import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { DataFile, CitySnapshot } from './types.js';

const MAX_HISTORY = 48;

function dataDir(rootDir: string, cityId: string): string {
  return join(rootDir, 'data', cityId);
}

function latestPath(rootDir: string, cityId: string): string {
  return join(dataDir(rootDir, cityId), 'latest.json');
}

export async function loadExisting(
  rootDir: string,
  cityId: string,
): Promise<DataFile | null> {
  try {
    const raw = await readFile(latestPath(rootDir, cityId), 'utf-8');
    return JSON.parse(raw) as DataFile;
  } catch {
    return null;
  }
}

export async function saveSnapshot(
  rootDir: string,
  snapshot: CitySnapshot,
): Promise<string> {
  const existing = await loadExisting(rootDir, snapshot.cityId);
  const history = existing
    ? [existing.latest, ...existing.history].slice(0, MAX_HISTORY)
    : [];

  const dataFile: DataFile = { latest: snapshot, history };

  const dir = dataDir(rootDir, snapshot.cityId);
  await mkdir(dir, { recursive: true });
  const filePath = latestPath(rootDir, snapshot.cityId);
  await writeFile(filePath, JSON.stringify(dataFile, null, 2));

  return filePath;
}
