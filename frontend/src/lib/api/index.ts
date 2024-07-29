import { notFound } from 'next/navigation'
import { getApiUrl } from '../utils'
import { withJsonContent } from './with-json-content'

const parseBody = async <TResult = unknown>(response: Response) => {
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.startsWith('application/json')) {
    return (await response.json()) as TResult
  } else {
    return (await response.text()) as TResult
  }
}

export async function api<TResult = unknown>(route: string, init?: RequestInit): Promise<TResult> {
  const response = await fetch(`${getApiUrl()}${route}`, init)

  if (response.ok) {
    return await parseBody<TResult>(response)
  } else {
    const error = await parseBody<any>(response)
    if (response.status === 404) {
      notFound()
    }
    if ('statusCode' in error && 'message' in error) {
      throw new Error(error.message)
    }
    throw new Error(`${response.status} ${response.statusText}`)
  }
}

export const apiGet = <
  TResult = unknown,
  TParams extends Record<string, any> = Record<string, any>
>(
  route: string,
  params?: TParams,
  init?: Omit<RequestInit, 'method'>
) =>
  api<TResult>(`${route}?${new URLSearchParams(params)}`, {
    ...withJsonContent(init),
    method: 'GET'
  })

export const apiDelete = <
  TResult = unknown,
  TParams extends Record<string, any> = Record<string, any>
>(
  route: string,
  params?: TParams,
  init?: Omit<RequestInit, 'method'>
) =>
  api<TResult>(`${route}?${new URLSearchParams(params)}`, {
    ...withJsonContent(init),
    method: 'DELETE'
  })

export const apiPost = <
  TResult = unknown,
  TParams extends Record<string, any> = Record<string, any>
>(
  route: string,
  params?: TParams,
  init?: Omit<RequestInit, 'method' | 'body'>
) =>
  api<TResult>(route, {
    ...withJsonContent(init),
    method: 'POST',
    body: JSON.stringify(params)
  })

export const apiPut = <
  TResult = unknown,
  TParams extends Record<string, any> = Record<string, any>
>(
  route: string,
  params?: TParams,
  init?: Omit<RequestInit, 'method' | 'body'>
) =>
  api<TResult>(route, {
    ...withJsonContent(init),
    method: 'PUT',
    body: JSON.stringify(params)
  })

export const apiPatch = <
  TResult = unknown,
  TParams extends Record<string, any> = Record<string, any>
>(
  route: string,
  params?: TParams,
  init?: Omit<RequestInit, 'method' | 'body'>
) =>
  api<TResult>(route, {
    ...withJsonContent(init),
    method: 'PATCH',
    body: JSON.stringify(params)
  })
