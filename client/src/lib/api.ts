import { getToken, clearAuth } from './auth'

export type ApiError = {
  status: number
  message: string
}

const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api/v1'

async function request<T>(
  path: string,
  opts: RequestInit & { auth?: boolean } = { auth: true }
): Promise<T> {
  const { auth = true, headers, ...rest } = opts

  const h = new Headers(headers)
  h.set('Accept', 'application/json')

  if (!(rest.body instanceof FormData)) {
    if (!h.has('Content-Type')) h.set('Content-Type', 'application/json')
  }

  if (auth) {
    const token = getToken()
    if (token) h.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: h,
  })

  if (res.status === 204) return undefined as T

  const text = await res.text()
  const data = text ? safeJson(text) : null

  if (!res.ok) {
    if (res.status === 401) clearAuth()
    const message = (data && (data.message || data.error)) || res.statusText || 'Erreur'
    throw { status: res.status, message } satisfies ApiError
  }

  return data as T
}

function safeJson(text: string): any {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export type LoginResponse = {
  message: string
  user: { id: number; email: string; role: 'ADMIN' | 'LOGISTICS' | 'CUSTOMER_SERVICE' }
  token: string
}

export type Order = {
  id: number
  external_reference: string
  customer_name: string | null
  status: string
  tracking_number: string | null
  created_at: string
}

export type OrderLine = {
  id: number
  quantity: number
  product_id: number
  sku: string
  name: string
  price: number
}

export type OrderDetail = Order & {
  lines: OrderLine[]
}

export type Product = {
  id: number
  sku: string
  name: string
  stock_quantity: number
  price: number | null
  created_at: string
}

export type CreateProductPayload = {
  sku: string
  name: string
  stock_quantity?: number
  price?: number | null
}

export type CreateProductResponse = {
  message: string
  product: Product
}

export const api = {
  login: (email: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, password }),
    }),

  orders: () => request<Order[]>('/orders', { method: 'GET' }),
  orderById: (id: number) => request<OrderDetail>(`/orders/${id}`, { method: 'GET' }),
  updateOrder: (id: number, payload: { status?: string; tracking_number?: string; notify_email?: string }) =>
    request<{ message: string; order: Order }>(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  products: () => request<Product[]>('/products', { method: 'GET' }),

  updateProductStock: (id: number, stock_quantity: number) =>
    request<{ message: string; product: Product }>(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock_quantity }),
    }),

  // ✅ AJOUTÉ : créer un produit
  createProduct: (payload: CreateProductPayload) =>
    request<CreateProductResponse>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
