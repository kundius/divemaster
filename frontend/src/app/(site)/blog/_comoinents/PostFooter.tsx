import Link from 'next/link'

import { Share } from '@/components/Share'
import { Badge } from '@/components/ui/badge'
import { BlogPostEntity } from '@/types'

import css from './PostFooter.module.scss'

export interface PostFooterProps {
  record: BlogPostEntity
}

export function PostFooter({ record }: PostFooterProps) {
  return (
    <div className={css.footer}>
      {record.tags.length > 0 && (
        <div className={css.tags}>
          {record.tags.map((tag) => (
            <Link href={`/blog/tag/${tag.alias}`} key={tag.id}>
              <Badge variant="outline">{tag.name}</Badge>
            </Link>
          ))}
        </div>
      )}
      <div className={css.share}>
        <div className={css.shareTitle}>Поделиться:</div>
        <div className={css.shareBody}>
          <Share url={`/blog/post/${record.alias}`} />
        </div>
      </div>
    </div>
  )
}
