import { VespFile, VespFileOptions } from '@/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import slugifyFn from 'slugify'

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

export function disableScroll() {
  if (document.getElementById('removed-body-scroll-bar-style')) return

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  const styles = `
  body {
    --removed-body-scroll-bar-size: ${scrollbarWidth}px;
    overflow: hidden !important;
    overscroll-behavior: contain;
    position: relative !important;
    padding-left: 0px;
    padding-top: 0px;
    padding-right: 0px;
    margin-left: 0;
    margin-top: 0;
    margin-right: ${scrollbarWidth}px !important;
  }
  `
  const styleSheet = document.createElement('style')
  styleSheet.innerHTML = styles
  styleSheet.id = 'removed-body-scroll-bar-style'
  document.head.appendChild(styleSheet)
}

export function enableScroll() {
  const styleSheet = document.getElementById('removed-body-scroll-bar-style')
  styleSheet?.parentNode?.removeChild(styleSheet)
}

export function displayPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(value)
}

export function slugify(value: string) {
  return slugifyFn(value.toLocaleLowerCase(), { remove: /[*+~.()'"!:@]/g })
}
