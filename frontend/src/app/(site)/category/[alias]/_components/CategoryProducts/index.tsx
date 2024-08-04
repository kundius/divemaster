'use client'

import { ProductCard } from '@/components/site/ProductCard'
import { ProductStoreProvider } from '@/providers/product-store-provider'

import { useProductsQuery } from '../ProductsQuery'

export function CategoryProducts() {
  const { data, listRef } = useProductsQuery()
  return (
    <div
      className="grid grid-cols-4 gap-5 scroll-mt-48 max-2xl:scroll-mt-40 max-2xl:grid-cols-3"
      ref={listRef}
    >
      {data.rows.map((item) => {
        return (
          <ProductStoreProvider key={item.id} product={item}>
            <ProductCard />
          </ProductStoreProvider>
        )
      })}
    </div>
  )
}
