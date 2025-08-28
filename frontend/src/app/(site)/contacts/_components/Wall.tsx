import { PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

import css from './Wall.module.css'

export function Wall(props: PropsWithChildren<{ className?: string }>) {
  return <div className={cn(css.wall, props.className)}>{props.children}</div>
}
