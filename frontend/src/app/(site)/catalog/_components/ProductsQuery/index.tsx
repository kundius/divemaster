'use client'

import { useQuery } from '@/lib/useQuery'
import { ProductEntity } from '@/types'
import { parseAsInteger, useQueryStates } from 'nuqs'
import { createContext, MutableRefObject, PropsWithChildren, useContext, useRef } from 'react'

interface ProductsQueryContextValue {
  data: {
    rows: ProductEntity[]
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

export function ProductsQuery({ children }: PropsWithChildren) {
  const listRef = useRef<HTMLDivElement | null>(null)
  const [{ page, limit }] = useQueryStates({
    limit: parseAsInteger.withDefault(24),
    page: parseAsInteger.withDefault(1)
  })
  const { data, loading, refetch } = useQuery<ProductsQueryContextValue['data']>('products', {
    page,
    limit,
    withImages: true,
    withBrand: true,
    active: true,
    favorite: true
  })
  return (
    <ProductsQueryContext.Provider
      value={{
        data: {
          rows: data?.rows || [],
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
