import type { Metadata } from 'next'
import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import { apiGet } from '@/lib/api'
import { PageProps, UserEntity } from '@/types'

import { UserForm } from '../_components/UserForm'

export const metadata: Metadata = {
  title: 'Редактировать пользователя'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const record = await apiGet<UserEntity>(`users/${id}`)
  return (
    <PageLayout title="Редактировать пользователя">
      <UserForm record={record} />
    </PageLayout>
  )
}
