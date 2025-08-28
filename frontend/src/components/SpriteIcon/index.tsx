import { cn } from '@/lib/utils'

import css from './index.module.css'

export interface SpriteIconProps {
  className?: string
  name: string
  size?: number
}

export function SpriteIcon({ name, size = 24, className }: SpriteIconProps) {
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={cn(css.svg, className)}
    >
      <use href={`/sprite.svg?2#${name}`}></use>
    </svg>
  )
}
