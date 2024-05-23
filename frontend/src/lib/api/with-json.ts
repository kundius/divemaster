export function withJson(init: RequestInit = {}) {
  const headers = new Headers(init.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return {
    ...init,
    headers
  }
}
