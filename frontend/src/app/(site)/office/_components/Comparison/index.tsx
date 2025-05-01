'use client'

import { ProductCard } from '@/components/ProductCard'
import { ProductStoreProvider } from '@/providers/product-store-provider'
import { useWishlistStore } from '@/providers/whishlist-store-provider'

export function Comparison() {
  const products = useWishlistStore((state) => state.products.comparison)
  return (
    <div>
      <div className="grid grid-cols-4 max-2xl:grid-cols-3 max-sm:grid-cols-2 gap-5 max-lg:gap-3 max-sm:gap-2 scroll-mt-60 max-2xl:scroll-mt-40 relative">
        {products.map((item) => {
          return (
            <ProductStoreProvider key={item.id} product={item}>
              <ProductCard />
            </ProductStoreProvider>
          )
        })}
      </div>
    </div>
  )
}
