import { VespFile, VespFileOptions } from '@/types'
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

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function getImageLink(
  file: VespFile | Record<string, any>,
  options?: VespFileOptions,
  prefix?: string
): string {
  const params = [getApiUrl().slice(0, -1), prefix || 'image', file.uuid || file.id]
  if (file.updated_at) {
    if (!options) {
      options = {}
    }
    if (!options.fm) {
      options.fm = 'webp'
    }
    options.t = file.updated_at.split('.').shift()?.replaceAll(/\D/g, '')
  }
  return params.join('/') + '?' + new URLSearchParams(options as Record<string, string>).toString()
}
