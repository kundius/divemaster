import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import css from './index.module.scss'

export interface BigCardProps {
  title: string
  icon: JSX.Element
  items: {
    title: string
    uri: string
  }[]
  background: StaticImageData
  uri: string
}

export function BigCard({ title, items, background, icon, uri }: BigCardProps) {
  return (
    <div className={css.card}>
      <div className={css.background}>
        <Image src={background} alt={title} fill />
      </div>
      <Link href={uri} className={css.headline}>
        <span className={css.icon}>{icon}</span>
        <span
          className={cn(css.title, {
            [css.titleWithArrow]: items.length > 0
          })}
        >
          {title}
        </span>
      </Link>
      <div className={css.items}>
        {items.map((item) => (
          <div key={item.uri} className={css.item}>
            <a className={css.itemLink} href={item.uri}>
              {item.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
