'use client'

import { MessageSquareQuoteIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '@/components/ui/item'
import { ReviewReplyEntity } from '@/types'
import { ReviewReplyDialog } from './ReviewReplyDialog'

export interface ReviewReplyProps {
  initialData?: ReviewReplyEntity | null
  reviewId: number
}

export function ReviewReply({ initialData, reviewId }: ReviewReplyProps) {
  const [data, setData] = useState(initialData)

  return (
    <Item variant="outline">
      <ItemMedia>
        <MessageSquareQuoteIcon className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{data ? `Ответ от ${data.user?.name}:` : 'Ответ'}</ItemTitle>
        {data && <ItemDescription>{data.comment}</ItemDescription>}
      </ItemContent>
      <ItemActions>
        <ReviewReplyDialog reviewId={reviewId} initialData={initialData} onChange={setData}>
          <Button variant="outline" size="sm">
            {data ? 'Редактировать' : 'Добавить'}
          </Button>
        </ReviewReplyDialog>
      </ItemActions>
    </Item>
  )
}
