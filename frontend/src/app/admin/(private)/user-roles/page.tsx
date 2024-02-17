import { UserRolesPage } from '@/components/admin/UserRolesPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Доступы'
}

export default function Page() {
  return <UserRolesPage />
}
