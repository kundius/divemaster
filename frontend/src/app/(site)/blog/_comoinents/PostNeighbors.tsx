import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import { BlogPostEntity } from '@/types'

import css from './PostNeighbors.module.scss'

export interface PostNeighborsProps {
  previous?: BlogPostEntity
  next?: BlogPostEntity
}

export function PostNeighbors({ previous, next }: PostNeighborsProps) {
  if (!previous && !next) {
    return null
  }
  return (
    <div className={css.neighbors}>
      {previous && (
        <Link href={`/blog/post/${previous.alias}`} className={css.previous}>
          <ChevronLeftIcon className="w-4 h-4" />
          {previous.title}
        </Link>
      )}
      <div className={css.space} />
      {next && (
        <Link href={`/blog/post/${next.alias}`} className={css.next}>
          {next.title}
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}
