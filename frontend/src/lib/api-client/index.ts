import { notFound } from 'next/navigation'
import { getApiUrl } from '../utils'
import { TOKEN_NAME } from '@/constants'

export class ApiClient {
  private baseURL: string
  private headers: Record<string, string>

  constructor(baseURL: string = getApiUrl(), headers: Record<string, string> = {}) {
    this.baseURL = baseURL
    this.headers = { ...headers }
  }

  async withClientAuth() {
    const { getCookie } = await import('cookies-next')

    const token = getCookie(TOKEN_NAME)
    if (!!token) {
      this.headers['Authorization'] = `Bearer ${token}`
    }
  }

  async withServerAuth() {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()

    const token = cookieStore.get(TOKEN_NAME)?.value
    if (!!token) {
      this.headers['Authorization'] = `Bearer ${token}`
    }
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: Record<string, any> | FormData
  ): Promise<T> {
    let body: BodyInit | null | undefined = undefined

    if (data) {
      if (data instanceof FormData) {
        body = data
        this.headers['Content-Type'] = 'form/multipart'
      } else {
        body = JSON.stringify(data)
        this.headers['Content-Type'] = 'application/json'
      }
    }

    const options: RequestInit = {
      method,
      headers: { ...this.headers },
      body
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options)

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

      return response.json() as Promise<T>
    } catch (error) {
      console.error('Ошибка сети:', (error as Error).message)
      throw error
    }
  }

  public async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    if (params) {
      const searchParams = new URLSearchParams(params)
      endpoint = `${endpoint}?${searchParams.toString()}`
    }
    return this.request<T>('GET', endpoint)
  }

  public async post<T>(endpoint: string, data?: Record<string, any> | FormData): Promise<T> {
    return this.request<T>('POST', endpoint, data)
  }

  public async patch<T>(endpoint: string, data?: Record<string, any> | FormData): Promise<T> {
    return this.request<T>('PATCH', endpoint, data)
  }

  public async put<T>(endpoint: string, data?: Record<string, any> | FormData): Promise<T> {
    return this.request<T>('PUT', endpoint, data)
  }

  public async delete<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    if (params) {
      const searchParams = new URLSearchParams(params)
      endpoint = `${endpoint}?${searchParams.toString()}`
    }
    return this.request<T>('DELETE', endpoint)
  }
}

export class ValidationError extends Error {
  details: Record<string, string>

  constructor(errorBody: { details?: Record<string, string>; message?: string }) {
    super(errorBody.message || 'Validation failed')
    this.name = 'ValidationError'
    this.details = errorBody.details || {}
  }
}
