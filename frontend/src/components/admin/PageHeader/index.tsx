import { ReactNode } from 'react'

export interface PageHeaderProps {
  title: string
  actions?: ReactNode
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">{actions}</div>
    </div>
  )
}
