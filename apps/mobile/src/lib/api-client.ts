// src/lib/api-client.ts

const API_BASE_URL = "http://192.168.1.9:5111"; // swap in your actual LAN IP + port

type RegisterPayload = { email: string; password: string; displayName: string };
type LoginPayload = { email: string; password: string };
type AuthResponse = { accessToken: string; refreshToken: string };

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return postJson<AuthResponse>("/auth/register", payload);
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return postJson<AuthResponse>("/auth/login", payload);
}