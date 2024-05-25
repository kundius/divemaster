import { notFound } from 'next/navigation'
import { getApiUrl } from '../utils'
import { withJson } from './with-json'

export async function api<TResult = unknown>(route: string, init?: RequestInit): Promise<TResult> {
  const response = await fetch(`${getApiUrl()}${route}`, init)

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

export const apiGet = <
  TResult = unknown,
  TParams extends Record<string, any> = Record<string, any>
>(
  route: string,
  params?: TParams,
  init?: RequestInit
) =>
  api<TResult>(`${route}?${new URLSearchParams(params)}`, {
    ...withJson(init),
    method: 'GET'
  })

export const apiDelete = <
  TResult = unknown,
  TParams extends Record<string, any> = Record<string, any>
>(
  route: string,
  params?: TParams,
  init?: RequestInit
) =>
  api<TResult>(`${route}?${new URLSearchParams(params)}`, {
    ...withJson(init),
    method: 'DELETE'
  })

export const apiPost = <
  TResult = unknown,
  TParams extends Record<string, any> = Record<string, any>
>(
  route: string,
  params?: TParams,
  init?: RequestInit
) =>
  api<TResult>(route, {
    ...withJson(init),
    method: 'POST',
    body: JSON.stringify(params)
  })

export const apiPut = <
  TResult = unknown,
  TParams extends Record<string, any> = Record<string, any>
>(
  route: string,
  params?: TParams,
  init?: RequestInit
) =>
  api<TResult>(route, {
    ...withJson(init),
    method: 'PUT',
    body: JSON.stringify(params)
  })

export const apiPatch = <
  TResult = unknown,
  TParams extends Record<string, any> = Record<string, any>
>(
  route: string,
  params?: TParams,
  init?: RequestInit
) =>
  api<TResult>(route, {
    ...withJson(init),
    method: 'PATCH',
    body: JSON.stringify(params)
  })
