import { PropsWithChildren, ReactNode } from 'react'

export interface PageLayoutProps {
  title: string
  actions?: ReactNode | ReactNode[]
  aside?: ReactNode
}

export function PageLayout({
  children,
  title,
  actions,
  aside
}: PropsWithChildren<PageLayoutProps>) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="scroll-m-20 text-3xl font-medium tracking-tight">{title}</h1>
        {actions && <div className="flex items-center flex-wrap gap-3">{actions}</div>}
      </div>
      {aside ? (
        <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
          <aside className="md:w-1/5">
            <div className="sticky top-4">{aside}</div>
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      ) : (
        <div className="flex-1">{children}</div>
      )}
    </div>
  )
}
