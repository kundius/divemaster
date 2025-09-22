import { PropsWithChildren } from 'react'

import { Container } from '@/components/Container'
import { cn } from '@/lib/utils'

import css from './Layout.module.css'

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="overflow-hidden">
      <Container>
        <div className={cn('flex gap-16 max-xl:gap-10 max-lg:gap-8', css.layout)}>{children}</div>
      </Container>
    </div>
  )
}

export function LayoutContent({ children }: PropsWithChildren) {
  return (
    <div className="w-1/3 py-12 max-lg:py-8 max-md:py-6 flex flex-col max-lg:w-2/5 max-md:w-full">
      {children}
    </div>
  )
}

export function LayoutMap({ children }: PropsWithChildren) {
  return (
    <div className="w-2/3 relative max-lg:w-3/5 max-md:hidden">
      <div className={css.map}>{children}</div>
    </div>
  )
}
