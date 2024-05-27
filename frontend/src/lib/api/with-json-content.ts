export function withJsonContent(init: RequestInit = {}) {
  const headers = new Headers(init.headers)

  headers.set('Content-Type', 'application/json')

  return {
    ...init,
    headers
  }
}
