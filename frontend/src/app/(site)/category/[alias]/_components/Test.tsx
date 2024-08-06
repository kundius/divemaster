'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/providers/cart-store-provider'
import { useEffect } from 'react'

export function Test() {
  const { cartId, cartProducts, addToCart, removeFromCart, deleteCart, changeAmount } = useCartStore((state) => state)

  console.log('render test')
  return (
    <div>
      <Button onClick={() => deleteCart()}>Очистить</Button>
      <br />
      Cart ID: {cartId}
      <div className='flex gap-2 flex-col mt-4'>
        {cartProducts.map((item) => (
          <div key={item.uuid} className='flex justify-between items-center gap-2'>
            <div>{item.product.title}: {item.amount}</div>
            <Button
              onClick={() =>
                removeFromCart(item)
              }
            >
              remove
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        {[1,2,3,4,5].map((i) => (
        <Button
        key={i}
          onClick={() =>
            addToCart({
              id: i
            })
          }
        >
          addToCart {i}
        </Button>
        ))}
      </div>
    </div>
  )
}
