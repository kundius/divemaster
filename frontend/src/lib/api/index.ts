import { notFound } from 'next/navigation'
import { getApiUrl } from '../utils'

async function api<TResult = unknown>(route: string, init?: RequestInit): Promise<TResult> {
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

  return result as TResult
}

export const apiGet = <TResult = unknown>(route: string, params = {}, init?: RequestInit) =>
  api<TResult>(`${route}?${new URLSearchParams(params)}`, {
    ...init,
    method: 'GET'
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
