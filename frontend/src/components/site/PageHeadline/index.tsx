import Link from 'next/link'
import styles from './index.module.scss'

export interface PageHeadlineCrumb {
  title: string
  href?: string
}

export interface PageHeadlineProps {
  title: string
  titleView?: 'h1' | 'div' | 'h2' | 'h3'
  description?: string
  crumbs?: PageHeadlineCrumb[]
}

export function PageHeadline({
  title,
  titleView = 'h1',
  description,
  crumbs = []
}: PageHeadlineProps) {
  const Title = titleView
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
        <Title className={styles.title}>{title}</Title>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  )
}
