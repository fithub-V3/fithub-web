import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "http://192.168.1.9:5111"; // swap in your actual LAN IP + port

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

type RegisterPayload = { email: string; password: string; displayName: string };
type LoginPayload = { email: string; password: string };
type AuthResponse = { accessToken: string; refreshToken: string };

// Generic authenticated fetch wrapper. Attaches the access token (if present)
// and returns the raw Response — callers decide how to parse the body.
export async function authorizedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();

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
      // Body wasn't JSON — fall back to raw text.
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