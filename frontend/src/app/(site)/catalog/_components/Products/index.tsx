'use client'

import { ProductCard } from '@/components/site/ProductCard'
import { getFileUrl } from '@/lib/utils'
import { useProductsQuery } from '../ProductsQuery'

export function Products() {
  const { data, listRef } = useProductsQuery()

  return (
    <div
      className="grid grid-cols-4 gap-5 scroll-mt-48 max-2xl:scroll-mt-40 max-2xl:grid-cols-3"
      ref={listRef}
    >
      {data.rows.map((item) => (
        <ProductCard
          key={item.id}
          id={item.id}
          title={item.title}
          href={`/product/${item.alias}`}
          price={item.price}
          favorite={item.favorite}
          recent={item.recent}
          oldPrice={item.oldPrice || undefined}
          images={item.images ? item.images.map((item) => getFileUrl(item.file)) : []}
          brand={
            item.brand !== null && typeof item.brand === 'object' ? item.brand.title : undefined
          }
        />
      ))}
    </div>
  )
}
