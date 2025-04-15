import type { Metadata } from 'next'
import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import { apiGet } from '@/lib/api'
import { PageProps, UserRoleEntity } from '@/types'
import { UserRoleForm } from '../_components/UserRoleForm'

export const metadata: Metadata = {
  title: 'Редактировать доступ'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const record = await apiGet<UserRoleEntity>(`roles/${id}`)
  return (
    <PageLayout title="Редактировать доступ">
      <UserRoleForm record={record} />
    </PageLayout>
  )
}
