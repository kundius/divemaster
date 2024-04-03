import { cn } from '@/lib/utils'
import styles from './Toolbar.module.scss'
import Link from 'next/link'

export function Toolbar() {
  return (
    <div className={styles.wrapper}>
      <Link href="#" className={styles.button}>
        <span className={cn(styles.icon, styles['icon-cart'])}></span>
        <span className={styles.title}>Корзина</span>
        <span className={styles.badge}>0</span>
      </Link>
      <Link href="#" className={styles.button}>
        <span className={cn(styles.icon, styles['icon-favorites'])}></span>
        <span className={styles.title}>Избранное</span>
        <span className={styles.badge}>0</span>
      </Link>
      <Link href="#" className={styles.button}>
        <span className={cn(styles.icon, styles['icon-profile'])}></span>
        <span className={styles.title}>Профиль</span>
      </Link>
      <Link href="#" className={styles.button}>
        <span className={cn(styles.icon, styles['icon-compare'])}></span>
        <span className={styles.title}>Сравнить</span>
        <span className={styles.badge}>0</span>
      </Link>
    </div>
  )
}
