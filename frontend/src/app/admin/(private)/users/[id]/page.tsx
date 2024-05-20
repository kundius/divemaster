import { UsersUpdatePage } from '@/components/admin/UsersUpdatePage'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { VespUser } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать пользователя'
}

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<VespUser>(`admin/users/${params.id}`, {}, withAuth())

  return <UsersUpdatePage initialData={initialData} />
}
