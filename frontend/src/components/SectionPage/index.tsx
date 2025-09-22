import { PropsWithChildren } from 'react'

import { Container } from '@/components/Container'
import { cn } from '@/lib/utils'

import css from './index.module.css'

export function SectionPage({
  children,
  withBreadcrumbs = false
}: PropsWithChildren<{ withBreadcrumbs?: boolean }>) {
  return (
    <div
      className={cn(css.section, {
        [css.withBreadcrumbs]: withBreadcrumbs
      })}
    >
      <Container>{children}</Container>
    </div>
  )
}
