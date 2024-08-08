import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'
import styles from './styles.module.scss'

export function Container({
  children,
  className,
  small = false
}: PropsWithChildren<{
  className?: string
  small?: boolean
}>) {
  return (
    <div
      className={cn(
        styles.container,
        {
          [styles.small]: small
        },
        className
      )}
    >
      {children}
    </div>
  )
}
