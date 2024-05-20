import { UserRolesCreatePage } from '@/components/admin/UserRolesCreatePage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить доступ'
}

export default function Page() {
  return <UserRolesCreatePage />
}
