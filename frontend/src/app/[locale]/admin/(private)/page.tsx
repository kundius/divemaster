import { DashboardPage } from '@/components/admin/DashboardPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Divemaster'
}

export default function Page() {
  return <DashboardPage />
}
