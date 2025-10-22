import { Skeleton } from '@/components/ui/skeleton'
import styles from './Reply.module.css'
import { cn, declOfNum } from '@/lib/utils'
import { StarIcon } from '@heroicons/react/24/solid'
import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'

export interface ReplyProps {
  author: {
    name: string
    avatar?: string
  }
  comment: string
  date?: string
}

export function Reply({ author, comment, date }: ReplyProps) {
  return (
    <div className={styles.root}>
      <div className={styles.headline}>
        <div className={styles.author}>
          {author.avatar && (
            <Avatar className="size-6">
              <AvatarImage src={author.avatar} alt={author.name} />
            </Avatar>
          )}
          <div className={styles.userName}>{author.name}</div>
        </div>
        {date && <div className={styles.date}>{format(date, 'dd MMMM yyyy')}</div>}
      </div>
      <div className={styles.content}>{comment}</div>
    </div>
  )
}
