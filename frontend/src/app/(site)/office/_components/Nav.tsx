'use client'

import Link from 'next/link'
import styles from './Nav.module.scss'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/providers/auth-store-provider'

export function Nav() {
  const { logout, user } = useAuthStore((state) => state)
  return (
    <ul className={styles.items}>
      <li>
        <Link href="/office" className={styles.item}>
          <span className={styles.icon}>
            <svg viewBox="0 0 19 17" width="19" height="17">
              <use href="/sprite.svg#office-profile"></use>
            </svg>
          </span>
          <span className={styles.text}>Мои даные</span>
        </Link>
      </li>
      <li>
        <Link href="/office/orders" className={styles.item}>
          <span className={styles.icon}>
            <svg viewBox="0 0 19 17" width="19" height="17">
              <use href="/sprite.svg#office-orders"></use>
            </svg>
          </span>
          <span className={styles.text}>Мои заказы</span>
        </Link>
      </li>
      <li>
        <Link href="/office/comparison" className={styles.item}>
          <span className={styles.icon}>
            <svg viewBox="0 0 19 17" width="19" height="17">
              <use href="/sprite.svg#office-comparison"></use>
            </svg>
          </span>
          <span className={styles.text}>Сравнение товаров</span>
        </Link>
      </li>
      <li>
        <Link href="/office/favourites" className={styles.item}>
          <span className={styles.icon}>
            <svg viewBox="0 0 19 17" width="19" height="17">
              <use href="/sprite.svg#office-favourites"></use>
            </svg>
          </span>
          <span className={styles.text}>Избранное</span>
        </Link>
      </li>
      {user && false && (
        <li>
          <Link href="/dashboard" className={styles.item}>
            <span className={styles.icon}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <use href="/sprite.svg#office-admin"></use>
              </svg>
            </span>
            <span className={styles.text}>Панель управления</span>
          </Link>
        </li>
      )}
      <li>
        <button className={cn(styles.item, styles.gray)} onClick={logout}>
          <span className={styles.icon}>
            <svg viewBox="0 0 19 17" width="19" height="17">
              <use href="/sprite.svg#office-logout"></use>
            </svg>
          </span>
          <span className={styles.text}>Выйти</span>
        </button>
      </li>
    </ul>
  )
}
