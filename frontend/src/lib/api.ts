import { TOKEN_NAME } from '@/constants'
import type { CookieValueTypes, OptionsType } from 'cookies-next'
// import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { notFound } from 'next/navigation'
import { getApiUrl } from './utils'

export class ValidationError extends Error {
  details: Record<string, string>

  constructor(errorBody: { details?: Record<string, string>; message?: string }) {
    super(errorBody.message || 'Validation failed')
    this.name = 'ValidationError'
    this.details = errorBody.details || {}
  }
}

interface ApiConfig {
  headers?: Record<string, string>
  next?: NextFetchRequestConfig | undefined
}

// let _serverCookies: (() => Promise<ReadonlyRequestCookies>) | undefined = undefined
let _clientCookies:
  | ((key: string, options?: OptionsType) => CookieValueTypes | Promise<CookieValueTypes>)
  | undefined = undefined

// TODO сейчас серверная авторизация отключенна изза невозможности идентифицировать процесс сборки/пересборки
// но, сборка всегда(?) выполняет гет запросы, а пользователь либо гет из клиента либо мутации из клиента
// это можно как-то использовать, например для гет запросов оставить аутентификацию только на клиенте, а для мутаций и на сервере
// или добавить флаги, и не включать их для запросов которые может выполнять сборщик
const applyAuthorization = async (headers: Headers) => {
  if (typeof window === 'undefined') {
    // if (!_serverCookies) {
    //   const { cookies } = await import('next/headers')
    //   _serverCookies = cookies
    // }
    // const cookieStore = await _serverCookies()
    // const token = cookieStore.get(TOKEN_NAME)
    // if (!!token) {
    //   headers.set('Authorization', `Bearer ${token.value}`)
    // }
  } else {
    if (!_clientCookies) {
      const { getCookie } = await import('cookies-next')
      _clientCookies = getCookie
    }
    const token = _clientCookies(TOKEN_NAME)
    if (!!token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }
  return headers
}

export async function api<TResult = unknown>(
  method: string,
  endpoint: string,
  data?: Record<string, any> | FormData,
  config?: ApiConfig
): Promise<TResult> {
  const { headers = {}, next } = config || {}

  const headersObj = new Headers(headers)

  await applyAuthorization(headersObj)

  let body: BodyInit | undefined = undefined
  if (data) {
    if (data instanceof FormData) {
      console.log('data instanceof FormData')
      body = data
    } else {
      body = JSON.stringify(data)
      headersObj.set('Content-Type', 'application/json')
    }
  }

  try {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method,
      headers: headersObj,
      body,
      next
    })

    if (!response.ok) {
      // Если статус 400, парсим тело ошибки
      if (response.status === 400) {
        const errorBody = await response.json()
        throw new ValidationError(errorBody)
      }

      // Если статус 404, вызывает метот от nextjs
      if (response.status === 404) {
        notFound()
      }

      // Для других ошибок выбрасываем стандартное исключение
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.startsWith('application/json')) {
      return response.json() as Promise<TResult>
    } else {
      return response.text() as Promise<TResult>
    }
  } catch (error) {
    console.error('Ошибка сети:', (error as Error).message)
    throw error
  }
}

export async function apiPost<TResult = unknown>(
  endpoint: string,
  data?: Record<string, any> | FormData,
  config?: ApiConfig
) {
  return api<TResult>('POST', endpoint, data, config)
}

export async function apiPut<TResult = unknown>(
  endpoint: string,
  data?: Record<string, any> | FormData,
  config?: ApiConfig
) {
  return api<TResult>('PUT', endpoint, data, config)
}

export async function apiPatch<TResult = unknown>(
  endpoint: string,
  data?: Record<string, any> | FormData,
  config?: ApiConfig
) {
  return api<TResult>('PATCH', endpoint, data, config)
}

export async function apiGet<TResult = unknown>(
  endpoint: string,
  params?: Record<string, any>,
  config?: ApiConfig
) {
  if (params) {
    const searchParams = new URLSearchParams(params)
    endpoint = `${endpoint}?${searchParams.toString()}`
  }
  return api<TResult>('GET', endpoint, undefined, config)
}

export async function apiDelete<TResult = unknown>(
  endpoint: string,
  params?: Record<string, any>,
  config?: ApiConfig
) {
  if (params) {
    const searchParams = new URLSearchParams(params)
    endpoint = `${endpoint}?${searchParams.toString()}`
  }
  return api<TResult>('DELETE', endpoint, undefined, config)
}
