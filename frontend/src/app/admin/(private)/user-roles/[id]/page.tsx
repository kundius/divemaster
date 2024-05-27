import { UserRolesUpdatePage } from '@/components/admin/UserRolesUpdatePage'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { VespUserRole } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать доступ'
}

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<VespUserRole>(`roles/${params.id}`, {}, withServerAuth())

  return <UserRolesUpdatePage initialData={initialData} />
}
