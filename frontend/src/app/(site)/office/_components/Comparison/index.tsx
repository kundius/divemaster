'use client'

import { MaskIcon } from '@/components/MaskIcon'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ProductStoreProvider } from '@/providers/product-store-provider'
import { useWishlistStore } from '@/providers/whishlist-store-provider'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export function Comparison() {
  const products = useWishlistStore((state) => state.products.comparison)

  const [selectedCat, setSelectedCat] = useState<string | null>(null)

  const cats = useMemo(() => {
    const map = new Map<string, number>()
    for (const product of products) {
      if (!product.categories) continue
      const cat = product.categories[product.categories.length - 1]
      map.set(cat.title, (map.get(cat.title) || 0) + 1)
      // for (const cat of product.categories || []) {
      //   map.set(cat.title, (map.get(cat.title) || 0) + 1)
      // }
    }
    return map
  }, [products])

  const filteredByCat = useMemo(() => {
    if (selectedCat === null) return products
    return products.filter((p) => (p.categories || []).some((c) => c.title === selectedCat))
  }, [products, selectedCat])

  return (
    <div>
      {products.length > 0 ? (
        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              className={cn(
                'px-2 py-2 rounded bg-neutral-100 text-neutral-600 text-sm font-sans-narrow uppercase hover:bg-neutral-200',
                {
                  'text-white bg-primary-gradient': selectedCat === null
                }
              )}
              onClick={() => setSelectedCat(null)}
            >
              Все товары ({products.length})
            </button>
            {Array.from(cats.entries()).map(([title, count]) => (
              <button
                className={cn(
                  'px-2 py-2 rounded bg-neutral-100 text-neutral-600 text-sm font-sans-narrow hover:bg-neutral-200',
                  {
                    'text-white bg-primary-gradient': selectedCat === title
                  }
                )}
                key={title}
                onClick={() => setSelectedCat(title)}
              >
                {title} ({count})
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 max-2xl:grid-cols-3 max-sm:grid-cols-2 gap-5 max-lg:gap-3 max-sm:gap-2 scroll-mt-60 max-2xl:scroll-mt-40 relative">
            {filteredByCat.map((item) => {
              return (
                <ProductStoreProvider key={item.id} product={item}>
                  <ProductCard />
                </ProductStoreProvider>
              )
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center items-center h-48 w-48 mx-auto">
            <svg
              version="1.2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 119 79"
              width="119"
              height="79"
            >
              <path
                fillRule="evenodd"
                fill="#c9b1ff"
                d="m59.5 67c32.9 0 59.5 2.7 59.5 6 0 3.3-26.6 6-59.5 6-32.9 0-59.5-2.7-59.5-6 0-3.3 26.6-6 59.5-6z"
              />
              <path
                fillRule="evenodd"
                fill="#a90083"
                d="m30 0h10.7c1.1 0 2 0.9 2 2v10.8c0 1.1-0.9 2-2 2h-10.7c-1.1 0-2-0.9-2-2v-10.8c0-1.1 0.9-2 2-2zm2.2 5.7v3.4c0 0.8 0.7 1.5 1.5 1.5h3.3c0.8 0 1.5-0.7 1.5-1.5v-3.4c0-0.8-0.7-1.5-1.5-1.5h-3.3c-0.8 0-1.5 0.7-1.5 1.5zm19.7 4.9h30.6c0.6 0 1 0.4 1 1v2.2c0 0.6-0.4 1-1 1h-30.6c-0.5 0-1-0.4-1-1v-2.2c0-0.6 0.5-1 1-1zm0-8.5h41.1c0.6 0 1 0.5 1 1v2.2c0 0.6-0.4 1-1 1h-41.1c-0.5 0-1-0.4-1-1v-2.2c0-0.5 0.5-1 1-1zm-21.9 19.1h10.7c1.1 0 2 0.9 2 2v10.8c0 1.1-0.9 2-2 2h-10.7c-1.1 0-2-0.9-2-2v-10.8c0-1.1 0.9-2 2-2zm2.2 5.7v3.4c0 0.8 0.7 1.5 1.5 1.5h3.3c0.8 0 1.5-0.7 1.5-1.5v-3.4c0-0.8-0.7-1.5-1.5-1.5h-3.3c-0.8 0-1.5 0.7-1.5 1.5zm19.7 4.8h30.6c0.6 0 1 0.5 1 1v2.3c0 0.6-0.4 1-1 1h-30.6c-0.5 0-1-0.4-1-1v-2.3c0-0.5 0.5-1 1-1zm0-8.4h41.1c0.6 0 1 0.4 1 1v2.2c0 0.6-0.4 1-1 1h-41.1c-0.5 0-1-0.4-1-1v-2.2c0-0.6 0.5-1 1-1zm-21.9 18.9h10.7c1.1 0 2 0.9 2 2v10.8c0 1.1-0.9 2-2 2h-10.7c-1.1 0-2-0.9-2-2v-10.8c0-1.1 0.9-2 2-2zm2.2 5.7v3.4c0 0.8 0.7 1.5 1.5 1.5h3.3c0.8 0 1.5-0.7 1.5-1.5v-3.4c0-0.8-0.7-1.5-1.5-1.5h-3.3c-0.8 0-1.5 0.7-1.5 1.5zm19.7 4.8h30.6c0.6 0 1 0.5 1 1v2.3c0 0.6-0.4 1-1 1h-30.6c-0.5 0-1-0.4-1-1v-2.3c0-0.5 0.5-1 1-1zm0-8.4h41.1c0.6 0 1 0.4 1 1v2.2c0 0.6-0.4 1-1 1h-41.1c-0.5 0-1-0.4-1-1v-2.2c0-0.6 0.5-1 1-1z"
              />
              <path
                fill="#ff0000"
                d="m87.3 55.9l12.8 12.8-1.4 1.4-12.8-12.8zm11.3 0l-12.7 12.8 1.4 1.4 12.8-12.7z"
              />
            </svg>
          </div>
          <div className="text-base tracking-wide text-center uppercase font-sans-narrow font-bold">
            Нет товаров для сравнения
          </div>
          <div className="text-sm text-neutral-500 text-center mt-3">
            Здесь пока ничего нет, но вы можете добавить несколько товаров, нажав{' '}
            <MaskIcon name="compare" className="w-4 h-4" />, и сравнить их
          </div>
          <div className="flex justify-center mt-5">
            <Button
              asChild
              className="w-full max-w-72 uppercase font-sans-narrow"
              size="lg"
              type="button"
            >
              <Link href="/catalog">В каталог</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
