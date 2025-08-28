'use client'

import Link from 'next/link'
import styles from './index.module.css'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/providers/auth-store-provider'
import { usePathname } from 'next/navigation'
import { HasScope } from '@/lib/HasScope'

export function Nav() {
  const logout = useAuthStore((state) => state.logout)
  const pathname = usePathname()
  return (
    <ul className={styles.items}>
      <li>
        <Link
          href="/office"
          className={cn(styles.item, { [styles.itemActive]: pathname == '/office' })}
        >
          <span className={styles.icon}>
            <svg viewBox="0 0 19 17" width="1em" height="1em">
              <use href="/sprite.svg#office-profile"></use>
            </svg>
          </span>
          <span className={styles.text}>Мои даные</span>
        </Link>
      </li>
      <li>
        <Link
          href="/office/orders"
          className={cn(styles.item, { [styles.itemActive]: pathname == '/office/orders' })}
        >
          <span className={styles.icon}>
            <svg viewBox="0 0 19 17" width="1em" height="1em">
              <use href="/sprite.svg#office-orders"></use>
            </svg>
          </span>
          <span className={styles.text}>Мои заказы</span>
        </Link>
      </li>
      <li>
        <Link
          href="/office/comparison"
          className={cn(styles.item, { [styles.itemActive]: pathname == '/office/comparison' })}
        >
          <span className={styles.icon}>
            <svg viewBox="0 0 19 17" width="0.8em" height="0.8em">
              <use href="/sprite.svg#office-comparison"></use>
            </svg>
          </span>
          <span className={styles.text}>Сравнение товаров</span>
        </Link>
      </li>
      <li>
        <Link
          href="/office/favourites"
          className={cn(styles.item, { [styles.itemActive]: pathname == '/office/favourites' })}
        >
          <span className={styles.icon}>
            <svg viewBox="0 0 19 17" width="1em" height="1em">
              <use href="/sprite.svg#office-favourites"></use>
            </svg>
          </span>
          <span className={styles.text}>Избранное</span>
        </Link>
      </li>
      <HasScope scopes="admin">
        <li>
          <Link href="/dashboard" className={styles.item} target="_blank">
            <span className={styles.icon}>
              <svg viewBox="0 0 24 24" width="0.8em" height="0.8em">
                <use href="/sprite.svg#office-admin"></use>
              </svg>
            </span>
            <span className={styles.text}>Панель управления</span>
          </Link>
        </li>
      </HasScope>
      <li>
        <button className={cn(styles.item, styles.gray)} onClick={logout}>
          <span className={styles.icon}>
            <svg viewBox="0 0 19 17" width="0.8em" height="0.8em">
              <use href="/sprite.svg#office-logout"></use>
            </svg>
          </span>
          <span className={styles.text}>Выйти</span>
        </button>
      </li>
    </ul>
  )
}
