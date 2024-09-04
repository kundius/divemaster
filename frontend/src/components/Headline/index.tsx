import Link from 'next/link'
import { Breadcrumbs, BreadcrumbsProps } from '../site/Breadcrumbs'
import css from './index.module.scss'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface HeadlineProps {
  breadcrumbs?: BreadcrumbsProps['items']
  className?: string
  title: string
  description?: string
  separator?: boolean
  back?: {
    href: string
    title: string
  }
}

export function Headline({
  className,
  breadcrumbs,
  title,
  description,
  back,
  separator = false
}: HeadlineProps) {
  return (
    <div className={cn(css.wrapper, className)}>
      {breadcrumbs && (
        <div className={css.breadcrumbs}>
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      <div className={css.titleContainer}>
        <div className={css.title}>{title}</div>
        <div className={css.description}>{description}</div>
      </div>
      {back && (
        <div className={css.back}>
          <Link href={back.href} className={css.backLink}>
            <span>{back.title}</span>
          </Link>
        </div>
      )}
      {separator && <div className={css.separator} />}
    </div>
  )
}
