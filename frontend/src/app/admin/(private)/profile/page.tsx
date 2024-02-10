import { ProfilePage } from '@/components/admin/ProfilePage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Профиль'
}

export default function Page() {
  return <ProfilePage />
}
