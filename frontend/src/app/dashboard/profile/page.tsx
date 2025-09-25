import { apiGet } from '@/lib/api'
import { UserEntity } from '@/types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../_components/AppPage'
import { ProfileUpdate } from './_components/ProfileUpdate'

export const metadata: Metadata = {
  title: 'Профиль'
}

export default async function Page() {
  const { user = null } = await apiGet<{ user?: UserEntity }>('auth/profile', undefined, {
    ssr: true
  })

  if (!user) {
    notFound()
  }

  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Редактировать профиль</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <ProfileUpdate record={user} />
      </AppPageContent>
    </AppPage>
  )
}
