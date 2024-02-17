import { UsersPage } from '@/components/admin/UsersPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Пользователи'
}

export default function Page() {
  return <UsersPage />
}
