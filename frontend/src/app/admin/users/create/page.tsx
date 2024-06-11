import { UsersCreatePage } from '@/components/admin/UsersCreatePage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить пользователя'
}

export default function Page() {
  return <UsersCreatePage />
}
