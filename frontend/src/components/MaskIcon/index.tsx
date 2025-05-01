import { cn } from '@/lib/utils'

import css from './index.module.scss'

export interface MaskIconProps {
  className?: string
  name: string
}

export function MaskIcon({ name, className }: MaskIconProps) {
  return (
    <span
      className={cn(css.icon, 'w-6 h-6', className)}
      style={{
        maskImage: `var(--icon-${name})`
      }}
    />
  )
}
