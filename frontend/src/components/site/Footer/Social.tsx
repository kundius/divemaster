import Image from 'next/image'
import Link from 'next/link'
import styles from './Social.module.scss'

const items = [
  {
    href: '#',
    icon: '/social/ok.svg'
  },
  {
    href: '#',
    icon: '/social/tg.svg'
  },
  {
    href: '#',
    icon: '/social/vk.svg'
  }
]

export function Social() {
  return (
    <div className={styles.root}>
      <div className={styles.title}>Мы в соцсетях:</div>
      <div className={styles.list}>
        {items.map((item, i) => (
          <Link href={item.href} key={i} className={styles.item}>
            <Image src={item.icon} width={36} height={36} alt="" />
          </Link>
        ))}
      </div>
    </div>
  )
}
