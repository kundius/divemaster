import type { PageProps } from '@/types'
import type { ReadonlyURLSearchParams } from 'next/navigation'
import { TablePageParams } from './types'

export const defaultState: TablePageParams = {
  limit: 2,
  page: 1
}

export function paramsFromObject(object: PageProps['searchParams']): TablePageParams {
  const params: TablePageParams = { ...defaultState }

  if ('limit' in object) {
    params.limit = Number(object.limit)
  }

  if ('page' in object) {
    params.page = Number(object.page)
  }

  return params
}

export function patamsFromSearchParams(searchParams: ReadonlyURLSearchParams): TablePageParams {
  const params: TablePageParams = { ...defaultState }

  if (searchParams.has('page')) {
    params.page = Number(searchParams.get('page'))
  }

  if (searchParams.has('limit')) {
    params.limit = Number(searchParams.get('limit'))
  }

  return params
}

export function changeSearchParams(
  searchParams: ReadonlyURLSearchParams,
  values: Partial<TablePageParams>
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

export function formatTags(value: string[]) {
  return value.join(', ')
}
