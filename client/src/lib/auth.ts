export type Role = 'ADMIN' | 'LOGISTICS' | 'CUSTOMER_SERVICE'

export type AuthUser = {
  id: number
  email: string
  role: Role
}

const TOKEN_KEY = 'gm_token'
const USER_KEY = 'gm_user'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function isAuthed(): boolean {
  return Boolean(getToken())
}

export function setAuth(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
