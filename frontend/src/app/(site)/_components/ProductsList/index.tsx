'use client'

import { ProductCard } from '@/components/ProductCard'
import { ProductStoreProvider } from '@/providers/product-store-provider'
import { useProductsStore } from '@/providers/products-store-provider'

export function ProductsList() {
  const rows = useProductsStore((state) => state.data.rows)
  const loading = useProductsStore((state) => state.loading)
  const setListElement = useProductsStore((state) => state.setListElement)

  return (
    <div
      className="grid grid-cols-4 max-2xl:grid-cols-3 max-sm:grid-cols-2 gap-5 max-lg:gap-3 max-sm:gap-2 scroll-mt-60 max-2xl:scroll-mt-40 relative"
      ref={setListElement}
    >
      {rows.map((item) => {
        return (
          <ProductStoreProvider key={item.id} product={item}>
            <ProductCard />
          </ProductStoreProvider>
        )
      })}
      {loading && <div className="absolute inset-0 bg-white/80 z-10" />}
    </div>
  )
}
