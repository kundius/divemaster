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
import { useMemo, useState } from 'react'
import { useIsFirstRender } from '@uidotdev/usehooks'
import { getFileUrl } from '@/lib/utils'
import { Pagination } from '@/components/Pagination'
import { AddDialog } from './AddDialog'

export interface ProductReviewsProps {
  productId: number
  reviewsCount: number
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

export function ProductReviews({ productId, reviewsCount }: ProductReviewsProps) {
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('publishedAt')
  const [dir, setDir] = useState('DESC')
  const { data, isLoading, mutate } = useSWR<Data>(
    [`reviews`, { productId, sort, dir, page, limit, isPublished: true }],
    {
      keepPreviousData: true
    }
  )
  const summaryData = data ?? defaultData

  const addButton = useMemo(() => {
    return (
      <AddDialog productId={productId} onSuccess={() => mutate()}>
        <Button size="lg" variant="shady" className="w-72 uppercase font-sans-narrow">
          Добавить отзыв
        </Button>
      </AddDialog>
    )
  }, [productId, mutate])

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
    if (isLoading && typeof data === 'undefined') {
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
    if (!isLoading && summaryData.rows.length === 0) {
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
          <EmptyContent>{addButton}</EmptyContent>
        </Empty>
      )
    }

    // во всех остальных случаях показываем список отзывов
    return (
      <div className="grid mt-8 gap-8 lg:grid-cols-3 lg:gap-16 lg:mt-16">
        <div>
          <Stats
            totalReviews={summaryData.total}
            averageRating={summaryData.averageRating}
            ratingDistribution={summaryData.ratingDistribution}
            recommendationPercentage={summaryData.recommendationPercentage}
          />
        </div>
        <div className="lg:col-span-2">
          <div className="mb-9">{addButton}</div>
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
            {summaryData.rows.map((item) => (
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
          {summaryData.total > limit && (
            <div className="flex justify-center mt-12">
              <Pagination
                limit={limit}
                page={page}
                total={summaryData.total}
                onChange={onChangePagination}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div id="reviews" className={styles.wrap}>
      <div className={styles.headline}>
        <span className="icon icon-comments w-6 h-6" />
        Отзывы ({reviewsCount})
      </div>
      {renderContent()}
    </div>
  )
}
