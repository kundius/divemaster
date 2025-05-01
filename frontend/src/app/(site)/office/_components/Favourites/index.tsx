'use client'

import { MaskIcon } from '@/components/MaskIcon'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { ProductStoreProvider } from '@/providers/product-store-provider'
import { useWishlistStore } from '@/providers/whishlist-store-provider'
import { HeartIcon } from 'lucide-react'
import Link from 'next/link'

export function Favourites() {
  const products = useWishlistStore((state) => state.products.favourites)
  return (
    <div>
      {products.length > 0 ? (
        <div className="grid grid-cols-4 max-2xl:grid-cols-3 max-sm:grid-cols-2 gap-5 max-lg:gap-3 max-sm:gap-2 scroll-mt-60 max-2xl:scroll-mt-40 relative">
          {products.map((item) => {
            return (
              <ProductStoreProvider key={item.id} product={item}>
                <ProductCard />
              </ProductStoreProvider>
            )
          })}
        </div>
      ) : (
        <div>
          <div className="flex justify-center items-center h-48 w-48 mx-auto">
            <svg
              version="1.2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 119 75"
              width="119"
              height="75"
            >
              <path
                fillRule="evenodd"
                fill="#c9b1ff"
                d="m59.5 63c32.9 0 59.5 2.7 59.5 6 0 3.3-26.6 6-59.5 6-32.9 0-59.5-2.7-59.5-6 0-3.3 26.6-6 59.5-6z"
              />
              <path
                fillRule="evenodd"
                fill="#ffffff"
                stroke="#a90083"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m80 1c-10.2 0-18.6 2.8-19.9 12.8h-0.2c-1.3-10-9.7-12.8-19.9-12.8-11.1 0-20.1 9.1-20.1 20.4q0.1 3 0.9 5.7c4.4 19.7 39.2 38.8 39.3 38.9 0.1 0 40.4-23 39.9-43.2q0-0.7 0-1.4c0-11.3-8.9-20.4-20-20.4z"
              />
              <path
                fill="#753cd6"
                d="m50 30c1.1 0 2 0.9 2 2 0 1.1-0.9 2-2 2-1.1 0-2-0.9-2-2 0-1.1 0.9-2 2-2zm20 0c1.1 0 2 0.9 2 2 0 1.1-0.9 2-2 2-1.1 0-2-0.9-2-2 0-1.1 0.9-2 2-2zm-2.8 12.5c-3.7-3.8-9.8-3.8-13.6 0-0.3 0.3-0.3 0.9 0 1.2 0.4 0.4 0.9 0.4 1.3 0 3-3.1 8-3.1 11.1 0q0.2 0.3 0.6 0.3 0.3 0 0.6-0.3c0.4-0.3 0.4-0.9 0-1.2z"
              />
              <path
                fillRule="evenodd"
                fill="#c9b1ff"
                d="m45 37c-0.6 0.5-1.2 1-1.8 1.5-0.7 0.6-1.2 1.5-1.2 2.4 0 1.7 1.3 3.1 3 3.1 1.7 0 3-1.4 3-3.1 0-0.9-0.5-1.8-1.2-2.4-0.6-0.5-1.2-0.9-1.8-1.5z"
              />
              <path
                fill="#ff0000"
                d="m87.3 51.9l12.8 12.8-1.4 1.4-12.8-12.8zm11.3 0l-12.7 12.8 1.4 1.4 12.8-12.7z"
              />
            </svg>
          </div>
          <div className="text-base tracking-wide text-center uppercase font-sans-narrow font-bold">
            В избранном ничего нет
          </div>
          <div className="text-sm text-neutral-500 text-center mt-3">
            Здесь пока ничего нет, но вы можете добавить товар, кликнув на{' '}
            <MaskIcon name="favorite" className='w-4 h-4' />
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
