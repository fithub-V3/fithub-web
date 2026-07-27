const API_BASE_URL = "http://localhost:5111";
// ^ needs to be moved to a .env file

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

type RegisterPayload = {
  email: string;
  password: string;
  displayName: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function authorizedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const rawBody = await res.text();
    let message = rawBody;

    try {
      const parsed = JSON.parse(rawBody);
      if (parsed?.message) {
        message = parsed.message;
      }
    } catch {
      // Body wasn't JSON (e.g. a plain-text error) — fall back to the raw text.
    }

    throw new Error(message || `Request failed with status ${res.status}`);
  }

  return res;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await authorizedFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await authorizedFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
}