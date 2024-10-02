import { DashboardPage } from '@/components/admin/DashboardPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Панель управления'
}

export default function Page() {
  return <DashboardPage />
}
