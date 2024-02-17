// import { TOKEN_NAME } from '@/lib/auth/constants'
// import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { getApiUrl } from '.'

// export function withAuth(init: RequestInit = {}) {
//   const headers = new Headers(init.headers)

//   let token = cookies().get(TOKEN_NAME)?.value
//   if (token) {
//     headers.set('Authorization', `Bearer ${token}`)
//   }

//   return {
//     ...init,
//     headers
//   }
// }

async function api<ResultType extends unknown>(
  route: string,
  init?: RequestInit
): Promise<ResultType> {
  const headers = new Headers(init?.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${getApiUrl()}${route}`, {
    ...init,
    headers
  })
  const result = await response.json()

  if (!response.ok) {
    if (response.status === 404) {
      notFound()
    }

    let errorMessage = `${response.status} ${response.statusText}`
    if (typeof result === 'string' && !!result) {
      errorMessage = result
    }
    throw new Error(errorMessage)
  }

  return result as ResultType
}

export const apiGet: typeof api = (route, init) =>
  api(route, {
    ...init,
    method: 'GET'
  })

export const apiPost: typeof api = (route, init) =>
  api(route, {
    ...init,
    method: 'POST'
  })

export const apiPut: typeof api = (route, init) =>
  api(route, {
    ...init,
    method: 'PUT'
  })

export const apiPatch: typeof api = (route, init) =>
  api(route, {
    ...init,
    method: 'PATCH'
  })
