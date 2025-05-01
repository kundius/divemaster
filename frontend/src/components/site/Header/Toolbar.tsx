'use client'

import { cn } from '@/lib/utils'
import styles from './Toolbar.module.scss'
import Link from 'next/link'
import { useMobileNavigation } from '../../MobileNavigation'
import { useAuthStore } from '@/providers/auth-store-provider'
import { useCartStore } from '@/providers/cart-store-provider'
import { SpriteIcon } from '@/components/SpriteIcon'
import { Skeleton } from '@/components/ui/skeleton'
import { MouseEvent } from 'react'
import { useWishlistStore } from '@/providers/whishlist-store-provider'

export function Toolbar() {
  const wishlistProducts = useWishlistStore((state) => state.products)
  const cartTotal = useCartStore((state) => state.total)
  const authUser = useAuthStore((state) => state.user)
  const authLoading = useAuthStore((state) => state.loading)
  const loginDialogToggle = useAuthStore((state) => state.loginDialogToggle)
  const mobileNavigation = useMobileNavigation()

  const catalogClickHandler = () => {
    if (mobileNavigation.opened == 'catalog') {
      mobileNavigation.close()
    } else {
      mobileNavigation.open('catalog')
    }
  }

  const officeClickHandler = (e: { preventDefault: () => void }) => {
    if (window.matchMedia('not all and (min-width: 768px)').matches) {
      e.preventDefault()
      if (mobileNavigation.opened == 'office') {
        mobileNavigation.close()
      } else {
        mobileNavigation.open('office')
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={cn(
          styles.button,
          {
            [styles.active]: mobileNavigation.opened == 'catalog'
          },
          'block',
          'md:hidden'
        )}
        onClick={catalogClickHandler}
      >
        <span className={styles.icon}>
          <SpriteIcon name="catalog" size={20} />
        </span>
        <span className={styles.title}>Каталог</span>
      </button>
      <Link href="/cart" className={cn(styles.button, 'block')}>
        <span className={styles.icon}>
          <SpriteIcon name="toolbar-cart" size={24} />
        </span>
        <span className={styles.title}>Корзина</span>
        {cartTotal.count > 0 && <span className={styles.badge}>{cartTotal.count}</span>}
      </Link>
      <Link href="/office/favourites" className={cn(styles.button, 'block')}>
        <span className={styles.icon}>
          <SpriteIcon name="favorites" size={24} />
        </span>
        <span className={styles.title}>Избранное</span>
        {wishlistProducts.favourites.length > 0 && (
          <span className={styles.badge}>{wishlistProducts.favourites.length}</span>
        )}
      </Link>
      {!authLoading ? (
        !authUser ? (
          <button onClick={() => loginDialogToggle(true)} className={cn(styles.button, 'block')}>
            <span className={styles.icon}>
              <SpriteIcon name="login" size={24} />
            </span>
            <span className={styles.title}>Войти</span>
          </button>
        ) : (
          <Link
            href="/office"
            className={cn(styles.button, 'block')}
            onNavigate={officeClickHandler}
          >
            <span className={styles.icon}>
              <SpriteIcon name="toolbar-profile" size={24} />
            </span>
            <span className={styles.title}>Профиль</span>
          </Link>
        )
      ) : (
        <div className={cn(styles.button, 'block')}>
          <span className={styles.icon}>
            <Skeleton className="w-[24px] h-[24px] rounded bg-neutral-50/50" />
          </span>
          <span className={styles.title}>
            <Skeleton className="w-[47px] h-[12px] rounded bg-neutral-50/50" />
          </span>
        </div>
      )}
      <Link href="/office/comparison#" className={cn(styles.button, 'block')}>
        <span className={styles.icon}>
          <SpriteIcon name="comparison" size={24} />
        </span>
        <span className={styles.title}>Сравнить</span>
        {wishlistProducts.comparison.length > 0 && (
          <span className={styles.badge}>{wishlistProducts.comparison.length}</span>
        )}
      </Link>
    </div>
  )
}
