export interface ApiResponse<T> {
  data?: T
  error?: string
}

async function post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { error: json.error || 'Request failed' }
    return { data: json as T }
  } catch (err: any) {
    return { error: err?.message || 'Network error' }
  }
}

export const api = {
  freeSignup: (body: {
    email: string
    password: string
    choirName: string
    adminName: string
    choirSize: string
    timezone: string
  }) => post<{ success: boolean; choirId: string }>('/api/free-signup', body),

  createCheckout: (body: {
    plan: string
    email: string
    choirName: string
    adminName: string
    choirSize: string
    timezone: string
  }) => post<{ url: string }>('/api/create-checkout', body),

  sendEmail: (body: { to: string; subject: string; html: string }) =>
    post<{ data: unknown }>('/api/send-email', body),
}
