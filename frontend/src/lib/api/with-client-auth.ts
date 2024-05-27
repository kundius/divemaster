import { TOKEN_NAME } from '@/lib/auth/constants'
import { getCookie } from 'cookies-next'

export function withClientAuth(init: RequestInit = {}) {
  const headers = new Headers(init.headers)

  const token = getCookie(TOKEN_NAME)
  if (!!token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return {
    ...init,
    headers
  }
}
