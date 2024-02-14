import { ClientsPage } from '@/components/admin/ClientsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Клиенты - Divemaster'
}

export default function Page() {
  return <ClientsPage />
}
