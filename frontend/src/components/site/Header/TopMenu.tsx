import Link from 'next/link'
import styles from './TopMenu.module.scss'
import { cn } from '@/lib/utils'

export interface TopMenuProps {
  className?: string
  primary: {
    title: string
    href: string
    icon?: string
    className?: string
  }[]
  secondary?: {
    title: string
    href: string
    className?: string
  }[]
}

export function TopMenu({ className, primary, secondary = [] }: TopMenuProps) {
  return (
    <ul className={cn(styles.menu, className)}>
      {primary.map((item, i) => (
        <li key={i} className={item.className}>
          <Link
            href={item.href}
            className={cn(styles.link, styles[`icon-${item.icon}`], {
              [styles['with-icon']]: `icon-${item.icon}` in styles
            })}
          >
            {item.title}
          </Link>
        </li>
      ))}
      {secondary.length > 0 && (
        <li className={styles.more}>
          <button className={styles['more-toggle']}></button>
          <ul className={styles['more-list']}>
            {secondary.map((item, i) => (
              <li key={i} className={item.className}>
                <Link href={item.href} className={styles['more-link']}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      )}
    </ul>
  )
}
