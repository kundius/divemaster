import Image from 'next/image'
import Link from 'next/link'
import styles from './Social.module.scss'

const items = [
  {
    href: 'https://ok.ru/group/49481371549835',
    icon: '/social/ok.svg'
  },
  {
    href: 'https://vk.com/clubpodvoh',
    icon: '/social/vk.svg'
  }
]

export function Social() {
  return (
    <div className={styles.root}>
      <div className={styles.title}>Мы в соцсетях:</div>
      <div className={styles.list}>
        {items.map((item, i) => (
          <Link href={item.href} key={i} className={styles.item} target="_blank">
            <Image src={item.icon} width={36} height={36} alt="" />
          </Link>
        ))}
      </div>
    </div>
  )
}
