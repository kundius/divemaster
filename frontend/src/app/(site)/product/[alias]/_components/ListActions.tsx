'use client'

import { cn } from '@/lib/utils'
import styles from './ListActions.module.css'
import { useWishlistStore } from '@/providers/whishlist-store-provider'
import { WishlistType } from '@/types'
import { useProductStore } from '@/providers/product-store-provider'

export function ListActions() {
  const toggleInWishlist = useWishlistStore((state) => state.toggleInWishlist)
  const wishlistProducts = useWishlistStore((state) => state.products)
  const product = useProductStore((state) => state.product)
  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={cn(styles.action, styles['action-compare'], {
          [styles['action-active']]: wishlistProducts[WishlistType.COMPARISON].some(
            (p) => p.id === product.id
          )
        })}
        onClick={() => toggleInWishlist(product.id, WishlistType.COMPARISON)}
      ></button>
      <button
        type="button"
        className={cn(styles.action, styles['action-favorite'], {
          [styles['action-active']]: wishlistProducts[WishlistType.FAVOURITES].some(
            (p) => p.id === product.id
          )
        })}
        onClick={() => toggleInWishlist(product.id, WishlistType.FAVOURITES)}
      ></button>
    </div>
  )
}
