import { authStorage } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function buildHeaders(extra?: HeadersInit): HeadersInit {
  const token = authStorage.getToken();

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra || {}),
  };
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: buildHeaders(options?.headers),
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const error = await response.json();
      message = error.message || message;
    } catch {}

    throw new Error(message);
  }

  return response.json();
}