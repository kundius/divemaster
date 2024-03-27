import type { FetchContext, FetchOptions } from 'ofetch'
import { ofetch } from 'ofetch'
import type { UseFetchOptions } from 'nuxt/app'
import type { Composer } from 'vue-i18n'
import { useFetch, useNuxtApp } from '#app'
import { getApiUrl } from '@/utils/vesp'
// import { useToastError } from './use-toast'
import useAuth from './use-auth'

function onRequest({ options }: FetchContext): void {
  const { token } = useAuth()
  if (token.value) {
    const headers = new Headers(options.headers || {})
    headers.set('Authorization', token.value)
    options.headers = headers
  }
}

function onResponseError({ response }: FetchContext): void {
  if (process.client && response?._data) {
    const i18n = useNuxtApp().$i18n as Composer
    // useToastError(i18n.t(response._data))
  }
}

export function useApi<TResult extends unknown = unknown>(endpoint: string, options: FetchOptions<any> = {}) {
  return ofetch<TResult>(endpoint, {
    baseURL: getApiUrl(),
    onRequest,
    onResponseError,
    ...options
  })
}

export function useCustomFetch(endpoint: string, options: UseFetchOptions<any> = {}) {
  return useFetch(endpoint, {
    baseURL: getApiUrl(),
    key: options.key || endpoint.split('/').join('-'),
    onRequest,
    onResponseError,
    ...options
  })
}

export function useGet<TResult extends unknown = unknown>(
  endpoint: string,
  params = {},
  options: FetchOptions<any> = {}
) {
  return useApi<TResult>(endpoint, { ...options, query: params, method: 'GET' })
}

export function usePost<TResult extends unknown = unknown>(
  endpoint: string,
  params = {},
  options: FetchOptions<any> = {}
) {
  return useApi<TResult>(endpoint, { ...options, body: params, method: 'POST' })
}

export function usePut<TResult extends unknown = unknown>(
  endpoint: string,
  params = {},
  options: FetchOptions<any> = {}
) {
  return useApi<TResult>(endpoint, { ...options, body: params, method: 'PUT' })
}

export function usePatch<TResult extends unknown = unknown>(
  endpoint: string,
  params = {},
  options: FetchOptions<any> = {}
) {
  return useApi<TResult>(endpoint, { ...options, body: params, method: 'PATCH' })
}

export function useDelete<TResult extends unknown = unknown>(
  endpoint: string,
  params = {},
  options: FetchOptions<any> = {}
) {
  return useApi<TResult>(endpoint, { ...options, query: params, method: 'DELETE' })
}
