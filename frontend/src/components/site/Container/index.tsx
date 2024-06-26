import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'
import styles from './styles.module.scss'

export function Container({
  children,
  className
}: PropsWithChildren<{
  className?: string
}>) {
  return <div className={cn(styles.container, className)}>{children}</div>
}
