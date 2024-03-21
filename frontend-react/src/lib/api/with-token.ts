export function withToken(token?: string) {
  return (init: RequestInit = {}) => {
    const headers = new Headers(init.headers)

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return {
      ...init,
      headers
    }
  }
}
