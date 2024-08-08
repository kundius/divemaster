'use client'

import { cn } from '@/lib/utils'
import styles from './Toolbar.module.scss'
import Link from 'next/link'
import { useMobileNavigation } from './MobileNavigation'
import { useAuthStore } from '@/providers/auth-store-provider'
import { useCartStore } from '@/providers/cart-store-provider'

export function Toolbar() {
  const cartTotal = useCartStore((state) => state.total)
  const authUser = useAuthStore((state) => state.user)
  const mobileNavigation = useMobileNavigation()

  const handleClick = () => {
    if (mobileNavigation.opened.includes('catalog')) {
      mobileNavigation.close()
    } else {
      mobileNavigation.open('catalog')
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={cn(
          styles.button,
          {
            [styles.active]: mobileNavigation.opened.includes('catalog')
          },
          'block',
          'md:hidden'
        )}
        onClick={handleClick}
      >
        <span className={cn(styles.icon, styles['icon-catalog'])}></span>
        <span className={styles.title}>Каталог</span>
      </button>
      <Link href="/cart" className={cn(styles.button, 'block')}>
        <span className={cn(styles.icon, styles['icon-cart'])}></span>
        <span className={styles.title}>Корзина</span>
        {cartTotal.count > 0 && <span className={styles.badge}>{cartTotal.count}</span>}
      </Link>
      <Link href="#" className={cn(styles.button, 'block')}>
        <span className={cn(styles.icon, styles['icon-favorites'])}></span>
        <span className={styles.title}>Избранное</span>
        <span className={styles.badge}>0</span>
      </Link>
      <Link href={authUser ? '/office' : '/auth/signin'} className={cn(styles.button, 'block')}>
        <span className={cn(styles.icon, styles['icon-profile'])}></span>
        <span className={styles.title}>Профиль</span>
      </Link>
      <Link href="#" className={cn(styles.button, 'block')}>
        <span className={cn(styles.icon, styles['icon-compare'])}></span>
        <span className={styles.title}>Сравнить</span>
        <span className={styles.badge}>0</span>
      </Link>
    </div>
  )
}
