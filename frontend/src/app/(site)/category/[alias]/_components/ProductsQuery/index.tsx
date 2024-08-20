'use client'

import { useQuery } from '@/lib/useQuery'
import { ProductEntity } from '@/types'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { createContext, MutableRefObject, PropsWithChildren, useContext, useRef } from 'react'

export interface ProductsBaseFilter {
  name: string
  title: string
}

export interface ProductsOptionsFilter extends ProductsBaseFilter {
  type: 'options'
  variant: 'default' | 'colors'
  conjunction: boolean
  options: {
    value: string
    amount: number
  }[]
}

export interface ProductsRangeFilter extends ProductsBaseFilter {
  type: 'range'
  range: [number, number]
}

export interface ProductsToggleFilter extends ProductsBaseFilter {
  type: 'toggle'
}

export type ProductsFilter = ProductsOptionsFilter | ProductsRangeFilter | ProductsToggleFilter

interface ProductsQueryContextValue {
  data: {
    rows: ProductEntity[]
    filters: ProductsFilter[]
    total: number
  }
  refetch: () => void
  loading: boolean
  listRef: MutableRefObject<HTMLDivElement | null>
}

const ProductsQueryContext = createContext<ProductsQueryContextValue>(null!)

export function useProductsQuery() {
  return useContext(ProductsQueryContext) as unknown as ProductsQueryContextValue
}

export function ProductsQuery({
  children,
  categoryId,
  isParent
}: PropsWithChildren<{
  categoryId: number
  isParent: boolean
}>) {
  const listRef = useRef<HTMLDivElement | null>(null)
  const [{ page, limit, filter, sort, dir }] = useQueryStates({
    limit: parseAsInteger.withDefault(24),
    page: parseAsInteger.withDefault(1),
    filter: parseAsString.withDefault('{}'),
    sort: parseAsString.withDefault('id'),
    dir: parseAsString.withDefault('ASC')
  })
  const { data, loading, refetch } = useQuery<ProductsQueryContextValue['data']>('products', {
    page,
    limit,
    filter,
    category: categoryId,
    withImages: true,
    withBrand: true,
    withOptions: true,
    withOffers: true,
    active: true,
    favorite: isParent,
    sort,
    dir
  })
  return (
    <ProductsQueryContext.Provider
      value={{
        data: {
          rows: data?.rows || [],
          filters: data?.filters || [],
          total: data?.total || 0
        },
        listRef,
        loading,
        refetch
      }}
    >
      {children}
    </ProductsQueryContext.Provider>
  )
}
