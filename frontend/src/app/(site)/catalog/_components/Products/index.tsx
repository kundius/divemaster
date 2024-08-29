'use client'

import { ProductCard } from '@/components/site/ProductCard'
import { ProductStoreProvider } from '@/providers/product-store-provider'
import { useProductsStore } from '@/providers/products-store-provider'

export function Products() {
  const rows = useProductsStore((state) => state.data.rows)
  const loading = useProductsStore((state) => state.loading)
  const setListElement = useProductsStore((state) => state.setListElement)

  return (
    <div
      className="grid grid-cols-4 gap-5 scroll-mt-48 max-2xl:scroll-mt-40 max-2xl:grid-cols-3 relative"
      ref={setListElement}
    >
      {rows.map((item) => (
        <ProductStoreProvider key={item.id} product={item}>
          <ProductCard />
        </ProductStoreProvider>
      ))}
      {loading && <div className="absolute inset-0 bg-white/80 z-10" />}
    </div>
  )
}
