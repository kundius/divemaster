'use client'

import { DetailedHTMLProps, HTMLAttributes } from 'react'

import { useCartStore } from '@/providers/cart-store-provider'

import css from './Products.module.scss'
import { Product } from './Product'

export function Products(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const items = useCartStore((state) => state.cartProducts)
  const count = useCartStore((state) => state.total.count)
  return (
    <div {...props}>
      <div className={css.title}>Товары, {count} шт.</div>
      <div className={css.list}>
        {items.map((item) => (
          <Product key={item.id} cartProduct={item} />
        ))}
      </div>
    </div>
  )
}
