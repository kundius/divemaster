'use client'

import { useResorces } from '@/components/lib/Resources'
import { getFileUrl } from '@/lib/utils'
import { ProductEntity } from '@/types'
import { ProductCard } from '../ProductCard'

export function Products() {
  const { total, rows } = useResorces<ProductEntity>()

  return (
    <div className="grid grid-cols-4 gap-4">
      {rows.map((item) => (
        <ProductCard
          key={item.id}
          id={item.id}
          title={item.title}
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
