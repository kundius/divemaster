import Image from 'next/image'
import Link from 'next/link'
import styles from './Social.module.scss'
import { SpriteIcon } from '@/components/SpriteIcon'
import { cn } from '@/lib/utils'

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
          <Link href='https://ok.ru/group/49481371549835' className={cn(styles.item, styles.itemOk)} target="_blank">
            <SpriteIcon name='social-ok' />
          </Link>
          <Link href='https://vk.com/clubpodvoh' className={cn(styles.item, styles.itemVk)} target="_blank">
            <SpriteIcon name='social-vk' />
          </Link>
          <Link href='https://rutube.ru/channel/46176466/' className={cn(styles.item, styles.itemRutube)} target="_blank">
            <SpriteIcon name='social-rutube' />
          </Link>
      </div>
    </div>
  )
}
// SpriteIcon