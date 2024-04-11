import Link from 'next/link'
import styles from './CatalogMenu.module.scss'
import { cn } from '@/lib/utils'
import { spearfishing, diving, brands } from './menu'

export function CatalogMenu() {
  return (
    <ul className={styles.first}>
      <li className={styles['first-item']}>
        <Link href="#" className={styles['first-link']}>
          Всё для подводной охоты
        </Link>
        <ul className={cn(styles.second, 'gap-8 columns-3')}>
          {spearfishing.map((item, i) => (
            <li key={i} className={styles['second-item']}>
              <Link href={item.href} className={styles['second-link']}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      <li className={styles['first-item']}>
        <Link href="#" className={styles['first-link']}>
          Всё для дайвинга
        </Link>
        <ul className={cn(styles.second, styles['second-diving'], 'gap-8 columns-3')}>
          {diving.map((item, i) => (
            <li key={i} className={styles['second-item']}>
              <Link href={item.href} className={styles['second-link']}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      <li className={styles['first-item']}>
        <Link href="#Всё для плавания" className={styles['first-link']}>
          Всё для плавания
        </Link>
      </li>
      <li className={cn(styles['first-item'], 'max-lg:hidden')}>
        <Link href="#Бренды" className={styles['first-link']}>
          Бренды
        </Link>
        <ul className={cn(styles.second, styles['second-brands'], 'gap-8 columns-4')}>
          {brands.map((item, i) => (
            <li key={i} className={styles['second-item']}>
              <Link href={item.href} className={styles['second-link']}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      <li className={cn(styles['first-item'], 'max-lg:hidden')}>
        <Link href="#" className={styles.sale}>
          <span className="sale" />
        </Link>
      </li>
    </ul>
  )
}
