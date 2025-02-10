import type { Metadata } from 'next'

import { PageLayout } from '@/components/admin/PageLayout'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { PageProps, UserRoleEntity } from '@/types'
import { UserRoleForm } from '../_components/UserRoleForm'

export const metadata: Metadata = {
  title: 'Редактировать доступ'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const record = await apiGet<UserRoleEntity>(`roles/${id}`, {}, await withServerAuth())
  return (
    <PageLayout title="Редактировать доступ">
      <UserRoleForm record={record} />
    </PageLayout>
  )
}
