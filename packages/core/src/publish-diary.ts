import { getAccessToken } from './auth.js';
import type { DiaryContent } from './format-diary.js';

export async function publishDiary(
  entry: DiaryContent,
): Promise<{ id: string }> {
  const apiUrl =
    process.env.MOLTNET_API_URL ?? 'https://api.themolt.net';
  const token = await getAccessToken();

  const res = await fetch(`${apiUrl}/diary/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content: entry.content,
      type: 'experience',
      visibility: 'public',
      tags: entry.tags,
      importance: 0.6,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Diary publish failed (${res.status}): ${text}`);
  }

  return res.json();
}
