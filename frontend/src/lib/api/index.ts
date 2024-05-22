import { notFound } from 'next/navigation'
import { getApiUrl } from '../utils'

export async function api<TResult = unknown>(route: string, init?: RequestInit): Promise<TResult> {
  const headers = new Headers(init?.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${getApiUrl()}${route}`, {
    ...init,
    headers
  })
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    if (response.status === 404) {
      notFound()
    }
    throw new Error(`${response.status} ${response.statusText}`)
  } else {
    if (contentType && contentType.startsWith('application/json')) {
      return (await response.json()) as TResult
    } else {
      return undefined as TResult
    }
  }
}

export const apiGet = <TResult = unknown>(route: string, params = {}, init?: RequestInit) =>
  api<TResult>(`${route}?${new URLSearchParams(params)}`, {
    ...init,
    method: 'GET'
  })

export const apiDelete = <TResult = unknown>(route: string, params = {}, init?: RequestInit) =>
  api<TResult>(`${route}?${new URLSearchParams(params)}`, {
    ...init,
    method: 'DELETE'
  })

export const apiPost = <TResult = unknown>(route: string, params = {}, init?: RequestInit) =>
  api<TResult>(route, {
    ...init,
    method: 'POST',
    body: JSON.stringify(params)
  })

export const apiPut = <TResult = unknown>(route: string, params = {}, init?: RequestInit) =>
  api<TResult>(route, {
    ...init,
    method: 'PUT',
    body: JSON.stringify(params)
  })

export const apiPatch = <TResult = unknown>(route: string, params = {}, init?: RequestInit) =>
  api<TResult>(route, {
    ...init,
    method: 'PATCH',
    body: JSON.stringify(params)
  })
