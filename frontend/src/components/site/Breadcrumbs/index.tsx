import Link from 'next/link'
import styles from './index.module.css'

export interface BreadcrumbsProps {
  items: {
    title: string
    href?: string
  }[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className={styles.crumbs}>
      {items.map((item) => {
        if (item.href) {
          return (
            <Link href={item.href} className={styles.crumb} key={item.href}>
              {item.title}
            </Link>
          )
        }
        return (
          <span className={styles.crumb} key={item.href}>
            {item.title}
          </span>
        )
      })}
    </div>
  )
}
