import { getCookie } from 'cookies-next'

import { TOKEN_NAME } from '@/constants'

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
