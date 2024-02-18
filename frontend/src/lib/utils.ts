import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiUrl(): string {
  const SITE_URL = String(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost')
  const API_URL = String(process.env.NEXT_PUBLIC_API_URL || 'api')

  const url = /:\/\//.test(API_URL)
    ? API_URL
    : [
        SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL,
        API_URL.startsWith('/') ? API_URL.substring(1) : API_URL
      ].join('/')
  return url.endsWith('/') ? url : url + '/'
}
