import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAccessToken } from './auth.js';

describe('getAccessToken', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('throws when MOLTNET_CLIENT_ID is missing', async () => {
    vi.stubEnv('MOLTNET_CLIENT_ID', '');
    vi.stubEnv('MOLTNET_CLIENT_SECRET', 'secret');

    await expect(getAccessToken()).rejects.toThrow(
      'MOLTNET_CLIENT_ID and MOLTNET_CLIENT_SECRET are required',
    );
  });

  it('throws when MOLTNET_CLIENT_SECRET is missing', async () => {
    vi.stubEnv('MOLTNET_CLIENT_ID', 'id');
    vi.stubEnv('MOLTNET_CLIENT_SECRET', '');

    await expect(getAccessToken()).rejects.toThrow(
      'MOLTNET_CLIENT_ID and MOLTNET_CLIENT_SECRET are required',
    );
  });
});
