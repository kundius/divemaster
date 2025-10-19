import type { Metadata } from 'next'

import { apiGet } from '@/lib/api'
import { PageProps, ReviewEntity } from '@/types'
import {
  AppPage,
  AppPageActions,
  AppPageContent,
  AppPageHeader,
  AppPageTitle
} from '../../_components/AppPage'
import { ReviewReply } from '../_components/ReviewReply'
import { ReviewUpdate } from '../_components/ReviewUpdate'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { Button } from '@/components/ui/button'
import { TrashIcon } from '@heroicons/react/24/outline'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Редактировать отзыв'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const record = await apiGet<ReviewEntity>(`reviews/${id}`)
  const onDelete = async () => {
    'use server'
    redirect('/dashboard/reviews')
  }
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Редактировать отзыв</AppPageTitle>
        <AppPageActions>
          <ApiRemoveDialog url={`reviews/${record.id}`} onSuccess={onDelete}>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              <TrashIcon className="w-4 h-4" /> Удалить отзыв
            </Button>
          </ApiRemoveDialog>
        </AppPageActions>
      </AppPageHeader>
      <AppPageContent>
        <ReviewReply reviewId={record.id} initialData={record.reply} />
        <ReviewUpdate record={record} />
      </AppPageContent>
    </AppPage>
  )
}
