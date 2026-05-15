const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  token?: string
  body?: unknown
}

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  return response.json() as Promise<T>
}

export type AuthResponse = {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: 'user' | 'admin'
  }
}

export type EventItem = {
  _id: string
  name: string
  description: string
  thumbnail: string
  start_date: string
  end_date: string
  stream_url_primary: string
  stream_url_backup: string
  pass_name: string
  pass_price: number
  status: 'Draft' | 'Live' | 'Ended'
}

export type AffiliateItem = {
  _id: string
  name: string
  code: string
  commission_percent: number
  balance: number
}

export type CheckoutSessionResponse = {
  id: string
  url: string
}

export type PaymentGateway = {
  id: 'card' | 'paypal'
  label: string
  enabled: boolean
}

export const api = {
  register: (payload: { name: string; email: string; password: string }) =>
    apiRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: payload,
    }),
  login: (payload: { email: string; password: string }) =>
    apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: payload,
    }),
  listEvents: () => apiRequest<EventItem[]>('/api/events'),
  getEvent: (id: string) => apiRequest<EventItem>(`/api/events/${id}`),
  createEvent: (payload: Partial<EventItem>, token: string) =>
    apiRequest<{ _id: string; name: string }>('/api/events', {
      method: 'POST',
      token,
      body: payload,
    }),
  updateEvent: (id: string, payload: Partial<EventItem>, token: string) =>
    apiRequest<EventItem>(`/api/events/${id}`, {
      method: 'PATCH',
      token,
      body: payload,
    }),
  deleteEvent: (id: string, token: string) =>
    apiRequest<{ success: boolean }>(`/api/events/${id}`, {
      method: 'DELETE',
      token,
    }),
  listAffiliates: (token: string) =>
    apiRequest<AffiliateItem[]>('/api/affiliates', { token }),
  createAffiliate: (
    payload: { name: string; commission_percent: number; notes?: string },
    token: string,
  ) =>
    apiRequest<{
      target_link: string
      affiliate: AffiliateItem
    }>('/api/affiliates', {
      method: 'POST',
      token,
      body: payload,
    }),
  createCheckoutSession: (payload: {
    event_id: string
    user_id: string
    affiliate_code?: string
  }) =>
    apiRequest<CheckoutSessionResponse>(
      '/api/payments/create-checkout-session',
      {
        method: 'POST',
        body: payload,
      },
    ),
  listPaymentGateways: () =>
    apiRequest<PaymentGateway[]>('/api/payments/gateways'),
  createPayment: (provider: 'card' | 'paypal', payload: {
    event_id: string
    user_id: string
    affiliate_code?: string
    currency?: string
  }) =>
    apiRequest<{ url: string; session_id?: string; order_id?: string }>(
      `/api/payments/${provider}`,
      {
        method: 'POST',
        body: payload,
      },
    ),
  verifyPayment: (payload: {
    provider: 'card' | 'paypal'
    session_id?: string
    order_id?: string
  }) =>
    apiRequest<{ success: boolean }>('/api/payments/verify', {
      method: 'POST',
      body: payload,
    }),
}
