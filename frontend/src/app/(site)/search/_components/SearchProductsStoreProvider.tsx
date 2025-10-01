'use client'

import { Headline } from '@/components/Headline'
import { ProductsStoreProvider } from '@/providers/products-store-provider'
import { useSearchParams } from 'next/navigation'
import { PropsWithChildren, useMemo } from 'react'

export function SearchProductsStoreProvider({ children }: PropsWithChildren) {
  const searchParams = useSearchParams()

  const query = useMemo(() => searchParams.get('query'), [searchParams])

  if (query) {
    return <ProductsStoreProvider params={{ query }}>{children}</ProductsStoreProvider>
  } else {
    return (
      <>
        <Headline className="mb-8" title="Поиск" />
        <div className="space-y-1">
          <p>По Вашему запросу ничего не найдено.</p>
        </div>
      </>
    )
  }
}
