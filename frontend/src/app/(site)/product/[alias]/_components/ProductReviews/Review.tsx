import { cn } from '@/lib/utils'
import { StarIcon } from '@heroicons/react/24/solid'
import { format } from 'date-fns'
import Image from 'next/image'
import { ReactNode, useMemo, useState } from 'react'
import { Reply, ReplyProps } from './Reply'
import styles from './Review.module.css'
import dynamic from 'next/dynamic'
import { FileIcon, VideoIcon } from 'lucide-react'
import { SlideImage, SlideVideo } from 'yet-another-react-lightbox'

const Lightbox = dynamic(() => import('@/components/ui/lightbox'))

interface MediaType {
  fileId: number
  url: string
  type?: string
}

export interface ReviewProps {
  rating: number
  author: {
    name: string
    avatar?: string
  }
  media?: MediaType[]
  date?: string
  advantages?: string
  flaws?: string
  comment?: string
  reply?: ReplyProps
}

export function Review({
  rating,
  author,
  date,
  advantages,
  flaws,
  comment,
  reply,
  media
}: ReviewProps) {
  const [indexLightbox, setIndexLightbox] = useState<number>(-1)

  const [slides, fileIdToIndex] = useMemo<
    [(SlideImage | SlideVideo)[], Map<number, number>]
  >(() => {
    const slides: (SlideImage | SlideVideo)[] = []
    const fileIdToIndex = new Map<number, number>()

    if (!media) return [slides, fileIdToIndex]

    for (const item of media) {
      if (!item.type) continue

      if (item.type.startsWith('image')) {
        fileIdToIndex.set(item.fileId, slides.length)
        slides.push({ src: item.url })
      }

      if (item.type.startsWith('video')) {
        fileIdToIndex.set(item.fileId, slides.length)
        slides.push({
          type: 'video',
          sources: [
            {
              src: item.url,
              type: item.type
            }
          ]
        })
      }
    }

    return [slides, fileIdToIndex]
  }, [media])

  const thumbs = useMemo(() => {
    const thumbs: ReactNode[] = []

    if (!media) return thumbs

    for (const item of media) {
      const index = fileIdToIndex.get(item.fileId) || -1

      if (item.type && item.type.startsWith('image')) {
        thumbs.push(
          <div
            className="flex items-center justify-center w-12 h-12"
            onClick={() => setIndexLightbox(index)}
            key={item.fileId}
          >
            <Image
              src={item.url}
              alt=""
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        )
        continue
      }

      if (item.type && item.type.startsWith('video')) {
        thumbs.push(
          <div
            className="border flex items-center justify-center bg-accent text-accent-foreground w-12 h-12"
            onClick={() => setIndexLightbox(index)}
            key={item.fileId}
          >
            <VideoIcon className="size-6" />
          </div>
        )
        continue
      }

      thumbs.push(
        <a
          className="border flex items-center justify-center bg-accent text-accent-foreground w-12 h-12"
          href={item.url}
          target="_blank"
          key={item.fileId}
        >
          <FileIcon className="size-8" />
        </a>
      )
    }

    return thumbs
  }, [media])

  return (
    <div className={styles.root}>
      <div className={styles.headline}>
        {author && <div className={styles.author}>{author.name}</div>}
        {date && <div className={styles.date}>{format(date, 'dd MMMM yyyy')}</div>}
        <div className={styles.rating}>
          <StarIcon
            className={cn('size-4', {
              [styles.ratingStarActive]: rating >= 1
            })}
          />
          <StarIcon
            className={cn('size-4', {
              [styles.ratingStarActive]: rating >= 2
            })}
          />
          <StarIcon
            className={cn('size-4', {
              [styles.ratingStarActive]: rating >= 3
            })}
          />
          <StarIcon
            className={cn('size-4', {
              [styles.ratingStarActive]: rating >= 4
            })}
          />
          <StarIcon
            className={cn('size-4', {
              [styles.ratingStarActive]: rating >= 5
            })}
          />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {advantages && (
          <div>
            <div className={styles.messageTitle}>Достоинства</div>
            <div className={styles.messageContent}>{advantages}</div>
          </div>
        )}
        {flaws && (
          <div>
            <div className={styles.messageTitle}>Недостатки</div>
            <div className={styles.messageContent}>{flaws}</div>
          </div>
        )}
        {comment && (
          <div>
            <div className={styles.messageTitle}>Комментарий</div>
            <div className={styles.messageContent}>{comment}</div>
          </div>
        )}
      </div>
      {media && media.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2 mt-8">{thumbs}</div>
          <Lightbox
            index={indexLightbox}
            isOpened={indexLightbox >= 0}
            close={() => setIndexLightbox(-1)}
            slides={slides}
          />
        </>
      )}
      {reply && (
        <div className="mt-8 ml-12 mr-32">
          <Reply {...reply} />
        </div>
      )}
    </div>
  )
}
