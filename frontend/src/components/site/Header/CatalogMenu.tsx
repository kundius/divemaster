import Link from 'next/link'
import styles from './CatalogMenu.module.scss'
import { cn } from '@/lib/utils'

export function CatalogMenu() {
  return (
    <ul className={styles.list}>
      <li className={cn(styles.item, styles.parent)}>
        <Link href="#" className={styles.link}>
          Всё для подводной охоты
        </Link>
      </li>
      <li className={cn(styles.item, styles.parent)}>
        <Link href="#" className={styles.link}>
          Всё для дайвинга
        </Link>
      </li>
      <li className={cn(styles.item, styles.parent)}>
        <Link href="#" className={styles.link}>
          Всё для плавания
        </Link>
      </li>
      <li className={cn(styles.item, styles.parent, 'max-lg:hidden')}>
        <Link href="#" className={styles.link}>
          Бренды
        </Link>
      </li>
      <li className={cn(styles.item, 'max-lg:hidden')}>
        <Link href="#" className={styles.sale}></Link>
      </li>
    </ul>
  )
}
