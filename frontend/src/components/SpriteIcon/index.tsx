import { cn } from '@/lib/utils'

import css from './index.module.scss'

export interface SpriteIconProps {
  className?: string
  name: string
  size: number
}

export function SpriteIcon({ name, size, className }: SpriteIconProps) {
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={cn(css.svg, className)}
    >
      <use href={`/sprite.svg#${name}`}></use>
    </svg>
  )
}