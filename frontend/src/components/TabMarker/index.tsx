import { cn } from '@/lib/utils'

import css from './index.module.scss'
import Link from 'next/link'

export interface TabMarkerProps {
  size?: 'lg' | 'default'
  selected?: string
  items?: {
    title: string
    name: string
    href?: string
  }[]
}

export function TabMarker({ selected, items = [], size = 'default' }: TabMarkerProps) {
  return (
    <div className={cn(css.wrapper, css[`wrapper_${size}`])}>
      {items.map((item) => item.href ? (
        <Link
          key={item.name}
          href={item.href}
          className={cn(css.item, {
            [css.item_active]: item.name === selected
          })}
        >
          {item.title}
        </Link>
      ) : (
        <div
          key={item.name}
          className={cn(css.item, {
            [css.item_active]: item.name === selected
          })}
        >
          {item.title}
        </div>
      ))}
    </div>
  )
}
