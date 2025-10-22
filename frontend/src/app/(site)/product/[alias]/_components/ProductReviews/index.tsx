'use client'

import useSWR from 'swr'
import styles from './index.module.css'
import { FindAllResult, ReviewEntity } from '@/types'
import { Stats } from './Stats'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Review } from './Review'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { FolderIcon, InboxIcon, MessageCircleIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react'
import { useIsFirstRender } from '@uidotdev/usehooks'
import { getFileUrl } from '@/lib/utils'
import { Pagination } from '@/components/Pagination'

export interface ProductReviewsProps {
  productId: number
}

type Data = FindAllResult<ReviewEntity> & {
  averageRating: number
  ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number }
  recommendationPercentage: number
}

const defaultData: Data = {
  averageRating: 0,
  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  recommendationPercentage: 0,
  rows: [],
  total: 0
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('publishedAt')
  const [dir, setDir] = useState('DESC')
  const query = useSWR<Data>([`reviews`, { productId, sort, dir, page, limit }], {
    keepPreviousData: true
  })
  const data = query.data ?? defaultData

  const onChangeSort = (value: string) => {
    const [newSort, newDir] = value.split(':')
    setSort(newSort)
    setDir(newDir)
  }

  const onChangePagination = (page: number, limit: number) => {
    setLimit(limit)
    setPage(page)
  }

  const renderContent = () => {
    // данные загружаются и прошлого состояния нет? показываем общий прелоадер
    if (query.isLoading && typeof query.data === 'undefined') {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Spinner className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Отзывы загружаются</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )
    }

    // данные уже загружены, но отзывов нет? показываем пустое состояние
    if (!query.isLoading && data.rows.length === 0) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageCircleIcon />
            </EmptyMedia>
            <EmptyTitle>Отзывов пока нет</EmptyTitle>
            <EmptyDescription>
              Ваш отзыв может повлиять на решение других — поделитесь честным мнением.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="lg" variant="shady" className="w-72 uppercase font-sans-narrow">
              Добавить отзыв
            </Button>
          </EmptyContent>
        </Empty>
      )
    }

    // во всех остальных случаях показываем список отзывов
    return (
      <div className="grid grid-cols-3 gap-16 mt-16">
        <div>
          <Stats
            totalReviews={data.total}
            averageRating={data.averageRating}
            ratingDistribution={data.ratingDistribution}
            recommendationPercentage={data.recommendationPercentage}
          />
        </div>
        <div className="col-span-2">
          <div className="mb-9">
            <Button size="lg" variant="shady" className="w-72 uppercase font-sans-narrow">
              Добавить отзыв
            </Button>
          </div>
          <div className="mb-14">
            <Select defaultValue={`${sort}:${dir}`} onValueChange={onChangeSort}>
              <SelectTrigger size="lg" className="w-72">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publishedAt:DESC">Сначала новые</SelectItem>
                <SelectItem value="publishedAt:ASC">Сначала старые</SelectItem>
                <SelectItem value="rating:DESC">Оценка по убыванию</SelectItem>
                <SelectItem value="rating:ASC">Оценка по возрастанию</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-20">
            {data.rows.map((item) => (
              <Review
                key={item.id}
                advantages={item.advantages || undefined}
                comment={item.comment || undefined}
                flaws={item.flaws || undefined}
                date={item.publishedAt || undefined}
                rating={item.rating}
                author={{
                  name: item.user ? item.user.name : item.author || 'Гость',
                  avatar: undefined // TODO: AVATAR
                }}
                media={
                  item.media
                    ? item.media.map((m) => ({
                        url: getFileUrl(m.fileId),
                        fileId: m.fileId,
                        type: m.file?.type
                      }))
                    : undefined
                }
                reply={
                  item.reply
                    ? {
                        author: {
                          name: item.reply.user?.name || 'Администрация',
                          avatar: undefined // TODO: AVATAR
                        },
                        comment: item.reply.comment,
                        date: item.reply.publishedAt
                      }
                    : undefined
                }
              />
            ))}
          </div>
          {data.total > limit && (
            <div className="flex justify-center mt-12">
              <Pagination
                limit={limit}
                page={page}
                total={data.total}
                onChange={onChangePagination}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  console.log(data.rows)

  return (
    <div id="reviews">
      <div className={styles.headline}>
        <span className="icon icon-comments w-6 h-6" />
        Отзывы {query.isLoading ? <Spinner className="size-6" /> : `(${data.total})`}
      </div>
      {renderContent()}
    </div>
  )
}
