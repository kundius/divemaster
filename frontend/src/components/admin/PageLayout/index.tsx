import { PropsWithChildren, ReactNode } from 'react'

export interface PageLayoutProps {
  title: string
  actions?: ReactNode | ReactNode[]
}

export function PageLayout({ children, title, actions }: PropsWithChildren<PageLayoutProps>) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="scroll-m-20 text-3xl font-medium tracking-tight">{title}</h1>
        {actions && <div className="flex items-center flex-wrap gap-3">{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}
