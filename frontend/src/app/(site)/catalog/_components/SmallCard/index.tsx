import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import css from './index.module.scss'

export interface SmallCardProps {
  title: string
  icon: JSX.Element
  background: StaticImageData
  uri: string
}

export function SmallCard({ title, background, icon, uri }: SmallCardProps) {
  return (
    <div className={css.card}>
      <div className={css.background}>
        <Image src={background} alt={title} fill />
      </div>
      <Link href={uri} className={css.headline}>
        <span className={css.icon}>{icon}</span>
        <span className={css.title}>{title}</span>
      </Link>
    </div>
  )
}
