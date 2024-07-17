import { TOKEN_NAME } from '@/constants'
import { cookies } from 'next/headers'

export function withServerAuth(init: RequestInit = {}) {
  const headers = new Headers(init.headers)

  const token = cookies().get(TOKEN_NAME)?.value
  if (!!token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return {
    ...init,
    headers
  }
}
