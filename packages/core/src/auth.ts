interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let expiresAt = 0;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < expiresAt - 5 * 60 * 1000) {
    return cachedToken;
  }

  const clientId = process.env.MOLTNET_CLIENT_ID;
  const clientSecret = process.env.MOLTNET_CLIENT_SECRET;
  const oryUrl = process.env.ORY_PROJECT_URL ?? 'https://auth.themolt.net';

  if (!clientId || !clientSecret) {
    throw new Error(
      'MOLTNET_CLIENT_ID and MOLTNET_CLIENT_SECRET are required',
    );
  }

  const res = await fetch(`${oryUrl}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'openid',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${text}`);
  }

  const data: TokenResponse = await res.json();
  cachedToken = data.access_token;
  expiresAt = Date.now() + data.expires_in * 1000;

  return cachedToken;
}
