import { PropsWithChildren } from 'react'

import { Container } from '@/components/site/Container'
import { cn } from '@/lib/utils'

import css from './index.module.scss'

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
