import { UserRolesUpdatePage } from '@/components/admin/UserRolesUpdatePage'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { VespUserRole } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать доступ'
}

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<VespUserRole>(`roles/${params.id}`, {}, withAuth())

  return <UserRolesUpdatePage initialData={initialData} />
}
