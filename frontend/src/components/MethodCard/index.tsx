import Link from 'next/link'
import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import css from './index.module.css'

export interface MethodCardProps {
  title: string
  description?: string
  action?: string | (() => void)
  icon?: ReactNode
  active?: boolean
}

export function MethodCard({ title, active, description, action, icon }: MethodCardProps) {
  const renderContent = () => {
    return (
      <>
        {icon && <span className={css.icon}>{icon}</span>}
        <span className={css.body}>
          <span className={css.title}>{title}</span>
          {description && <span className={css.description}>{description}</span>}
        </span>
      </>
    )
  }
  const className = cn(css.item, {
    [css.active]: active
  })
  if (typeof action === 'string') {
    return (
      <Link href={action} className={className}>
        {renderContent()}
      </Link>
    )
  }
  return (
    <button className={className} onClick={action}>
      {renderContent()}
    </button>
  )
}
