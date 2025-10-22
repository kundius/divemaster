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

  const lightboxSlides = useMemo(() => {
    const slides: Map<number, SlideImage | SlideVideo> = new Map()

    if (!media) return slides

    for (const item of media) {
      if (!item.type) continue

      if (item.type.startsWith('image')) {
        slides.set(item.fileId, {
          src: item.url
        })
      }

      if (item.type.startsWith('video')) {
        slides.set(item.fileId, {
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

    return slides
  }, [media])

  const mediaThumbs = useMemo(() => {
    const thumbs: Map<number, ReactNode> = new Map()

    if (!media) return thumbs

    const arr = Array.from(lightboxSlides.values())
    for (const item of media) {
      const el = lightboxSlides.get(item.fileId)
      const index = el ? arr.indexOf(el) : -1

      if (item.type && item.type.startsWith('image')) {
        thumbs.set(
          item.fileId,
          <div
            className="border flex items-center justify-center bg-accent w-12 h-12"
            onClick={() => setIndexLightbox(index)}
            key={item.fileId}
          >
            <Image src={item.url} alt="" width={48} height={48} />
          </div>
        )
        continue
      }

      if (item.type && item.type.startsWith('video')) {
        thumbs.set(
          item.fileId,
          <div
            className="border flex items-center justify-center bg-accent w-12 h-12"
            onClick={() => setIndexLightbox(index)}
            key={item.fileId}
          >
            <VideoIcon className="size-6" />
          </div>
        )
        continue
      }

      thumbs.set(
        item.fileId,
        <a
          className="border flex items-center justify-center bg-accent w-12 h-12"
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
          <div className="flex flex-wrap gap-2 mt-8">{Array.from(mediaThumbs.values())}</div>
          <Lightbox
            index={indexLightbox}
            isOpened={indexLightbox >= 0}
            close={() => setIndexLightbox(-1)}
            slides={Array.from(lightboxSlides.values())}
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
