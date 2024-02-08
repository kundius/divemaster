import { LoginPage } from '@/components/admin/LoginPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход'
}

export default function Page() {
  return <LoginPage />
}
