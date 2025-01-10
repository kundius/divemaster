import { format } from 'date-fns'
import Link from 'next/link'

import { Share } from '@/components/Share'
import { Badge } from '@/components/ui/badge'
import { BlogPostEntity } from '@/types'

import css from './PostMeta.module.scss'
import { ClockIcon } from '@heroicons/react/24/outline'

export interface PostMetaProps {
  record: BlogPostEntity
}

export function PostMeta({ record }: PostMetaProps) {
  return (
    <div className={css.meta}>
      <div className={css.date}>{format(record.createdAt, 'dd.MM.yyyy')}</div>
      {record.readTime && (
        <div className={css.time}>
          <ClockIcon />
          {record.readTime} мин.
        </div>
      )}
      {record.tags.length > 0 && (
        <div className={css.tags}>
          {record.tags.map((blogTag) => (
            <Link href={`/blog/tag/${blogTag.alias}`} key={blogTag.id}>
              <Badge variant="outline">{blogTag.name}</Badge>
            </Link>
          ))}
        </div>
      )}
      <div className={css.share}>
        <Share url={`/blog/post/${record.alias}`} />
      </div>
    </div>
  )
}
