import Link from 'next/link'
import styles from './Menu.module.scss'

export interface MenuProps {
  title: string
  items: {
    href: string
    title: string
  }[]
}

export function Menu({ title, items }: MenuProps) {
  return (
    <div className={styles.root}>
      <div className={styles.title}>{title}</div>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i} className={styles.item}>
            <Link href={item.href} className={styles.link}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
