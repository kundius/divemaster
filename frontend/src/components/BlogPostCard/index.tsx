import { BlogPostEntity } from '@/types'

import css from './index.module.css'
import { getFileUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { ClockIcon, CloudIcon } from '@heroicons/react/24/outline'
import { format, formatDistanceToNow } from 'date-fns'
import { es, ru } from 'date-fns/locale'

export interface BlogPostCardProps {
  record: BlogPostEntity
}

export function BlogPostCard({ record }: BlogPostCardProps) {
  return (
    <div className={css.card}>
      {record.image && (
        <div className={css.figure}>
          <Image
            src={getFileUrl(record.image)}
            width={600}
            height={360}
            alt={record.title}
            className={css.image}
          />
          {record.readTime && (
            <div className={css.readTime}>
              <ClockIcon className="w-6 h-6 max-sm:w-4 max-sm:h-4" /> {record.readTime} мин.
            </div>
          )}
        </div>
      )}
      <div className={css.info}>
        <div className={css.date}>{format(record.createdAt, 'dd.MM.yyyy', { locale: ru })}</div>
        <Link href={`/blog/post/${record.alias}`} className={css.title}>
          {record.title}
        </Link>
        <div className={css.tags}>
          {record.tags.map((blogTag) => (
            <Link href={`/blog/tag/${blogTag.alias}`} key={blogTag.id} className={css.tag}>
              {blogTag.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
