import Link from 'next/link'
import styles from './index.module.scss'

export interface PageHeadlineCrumb {
  title: string
  href?: string
}

export interface PageHeadlineProps {
  title: string
  description?: string
  crumbs?: PageHeadlineCrumb[]
}

export function PageHeadline({ title, description, crumbs = [] }: PageHeadlineProps) {
  return (
    <div className={styles.wrap}>
      {crumbs.length > 0 && (
        <div className={styles.crumbs}>
          {crumbs.map((item) => {
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
      )}
      <div className={styles.titleBox}>
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  )
}
