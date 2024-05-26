import { notFound } from 'next/navigation'
import { useAuth } from '../auth/use-auth'
import { getApiUrl } from '../utils'

export interface UseApiParams {
  auth?: boolean
  json?: boolean
}

export function useApi(params?: UseApiParams) {
  const { auth = true, json = true } = params || {}

  const { token } = useAuth()

  async function api<TResult = unknown>(route: string, init?: RequestInit): Promise<TResult> {
    const headers = new Headers(init?.headers)

    if (auth && token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    if (json) {
      headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(`${getApiUrl()}${route}`, { ...init, headers })

    if (!response.ok) {
      if (response.status === 404) {
        notFound()
      }
      throw new Error(`${response.status} ${response.statusText}`)
    } else {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.startsWith('application/json')) {
        return (await response.json()) as TResult
      } else {
        return (await response.text()) as TResult
      }
    }
  }

  const get = <TResult = unknown, TParams extends Record<string, any> = Record<string, any>>(
    route: string,
    params?: TParams
  ) =>
    api<TResult>(`${route}?${new URLSearchParams(params)}`, {
      method: 'GET'
    })

  const _delete = <TResult = unknown, TParams extends Record<string, any> = Record<string, any>>(
    route: string,
    params?: TParams
  ) =>
    api<TResult>(`${route}?${new URLSearchParams(params)}`, {
      method: 'DELETE'
    })

  const post = <TResult = unknown, TParams extends Record<string, any> = Record<string, any>>(
    route: string,
    params?: TParams
  ) =>
    api<TResult>(route, {
      method: 'POST',
      body: JSON.stringify(params)
    })

  const put = <TResult = unknown, TParams extends Record<string, any> = Record<string, any>>(
    route: string,
    params?: TParams
  ) =>
    api<TResult>(route, {
      method: 'PUT',
      body: JSON.stringify(params)
    })

  const patch = <TResult = unknown, TParams extends Record<string, any> = Record<string, any>>(
    route: string,
    params?: TParams
  ) =>
    api<TResult>(route, {
      method: 'PATCH',
      body: JSON.stringify(params)
    })

  return { get, patch, post, put, delete: _delete }
}
