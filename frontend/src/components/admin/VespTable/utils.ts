import type { PageProps } from '@/types'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { VespTableParams } from '.'

export const defaultState: VespTableParams = {
  limit: 2,
  page: 1
}

export function parseParams(
  from: PageProps['searchParams'] | ReadonlyURLSearchParams
): VespTableParams {
  const params: VespTableParams = { ...defaultState }

  if (from instanceof ReadonlyURLSearchParams) {
    console.log(from.getAll('sort'))
    if (from.has('page')) {
      params.page = Number(from.get('page'))
    }

    if (from.has('limit')) {
      params.limit = Number(from.get('limit'))
    }

    if (from.has('sort')) {
      params.sort = String(from.get('sort'))
    }

    if (from.has('dir')) {
      params.dir = String(from.get('dir'))
    }
  } else {
    if ('limit' in from) {
      params.limit = Number(from.limit)
    }

    if ('page' in from) {
      params.page = Number(from.page)
    }

    if ('sort' in from) {
      params.sort = String(from.sort)
    }

    if ('dir' in from) {
      params.dir = String(from.dir)
    }
  }

  return params
}

export function pushParams(
  searchParams: ReadonlyURLSearchParams,
  values: Partial<VespTableParams>
) {
  const params = new URLSearchParams(searchParams.toString())

  for (const fieldName of Object.keys(values)) {
    let value = values[fieldName as keyof typeof values]
    let defaultValue = defaultState[fieldName as keyof typeof defaultState]
    if (value === defaultValue) {
      params.delete(fieldName)
    } else {
      params.set(fieldName, String(value))
    }
  }

  window.history.pushState(null, '', `?${params.toString()}`)
}
