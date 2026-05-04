const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export interface FetchOptions extends RequestInit {
  token?: string
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...rest } = options

  const headers = new Headers({
    'Content-Type': 'application/json',
  })

  if (rest.headers) {
    const provided = new Headers(rest.headers)
    provided.forEach((value, key) => {
      headers.set(key, value)
    })
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const message =
      errorData?.message || errorData?.error || `HTTP ${response.status}`
    throw new Error(message)
  }

  return response.json() as Promise<T>
}
