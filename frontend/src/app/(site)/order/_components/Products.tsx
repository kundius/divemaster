'use client'

import { useCartStore } from '@/providers/cart-store-provider'

import css from './Products.module.css'
import { Product } from './Product'

export function Products() {
  const items = useCartStore((state) => state.cartProducts)
  const count = useCartStore((state) => state.total.count)
  return (
    <div>
      <div className={css.title}>Товары, {count} шт.</div>
      <div className={css.list}>
        {items.map((item) => (
          <Product key={item.id} cartProduct={item} />
        ))}
      </div>
    </div>
  )
}
