import { PropsWithChildren } from 'react'

import { Container } from '@/components/site/Container'
import { cn } from '@/lib/utils'

import css from './Layout.module.scss'

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="overflow-hidden">
      <Container>
        <div className={cn('flex gap-16', css.layout)}>{children}</div>
      </Container>
    </div>
  )
}

export function LayoutContent({ children }: PropsWithChildren) {
  return <div className="w-1/3 py-12 flex flex-col">{children}</div>
}

export function LayoutMap({ children }: PropsWithChildren) {
  return (
    <div className="w-2/3 relative">
      <div className={css.map}>{children}</div>
    </div>
  )
}
