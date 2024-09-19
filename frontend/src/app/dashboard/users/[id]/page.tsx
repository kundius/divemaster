import { UsersUpdatePage } from '@/components/admin/UsersUpdatePage'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { UserEntity } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать пользователя'
}

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<UserEntity>(`users/${params.id}`, {}, withServerAuth())

  return <UsersUpdatePage initialData={initialData} />
}
