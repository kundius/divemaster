'use client'

import { ProductCard, ProductCardProps } from '@/components/site/ProductCard'
import { getFileUrl, productPrice } from '@/lib/utils'
import { useProductsQuery } from '../ProductsQuery'

export function CategoryProducts() {
  const { data, listRef } = useProductsQuery()
  return (
    <div
      className="grid grid-cols-4 gap-5 scroll-mt-48 max-2xl:scroll-mt-40 max-2xl:grid-cols-3"
      ref={listRef}
    >
      {data.rows.map((item) => {
        const [priceLabel, price] = productPrice(item)
        let oldPrice: ProductCardProps['oldPrice'] = undefined
        if (item.priceDecrease && price) {
          oldPrice = price * (item.priceDecrease/100) + price
        }
        return (
          <ProductCard
            key={item.id}
            id={item.id}
            title={item.title}
            href={`/product/${item.alias}`}
            price={priceLabel}
            favorite={item.favorite}
            recent={item.recent}
            discount={item.priceDecrease || undefined}
            oldPrice={oldPrice}
            images={item.images ? item.images.map((item) => getFileUrl(item.file)) : []}
            brand={
              item.brand !== null && typeof item.brand === 'object' ? item.brand.title : undefined
            }
          />
        )
      })}
    </div>
  )
}
