'use client'

import { ProductCard } from '@/components/ProductCard'
import { ProductStoreProvider } from '@/providers/product-store-provider'
import { ProductsStoreProvider } from '@/providers/products-store-provider'
import { useWishlistStore } from '@/providers/whishlist-store-provider'
import { Suspense } from 'react'
import { Products } from './Products'
import { Pagination } from './Pagination'

export function Favourites() {
  const products = useWishlistStore((state) => state.products.favourites)
  return (
    <ProductsStoreProvider params={{ ids: products.map((p) => p.id).join(',') }}>
      <Products />
      <Pagination />
    </ProductsStoreProvider>
  )
}
