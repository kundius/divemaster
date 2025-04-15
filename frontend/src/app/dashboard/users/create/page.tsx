import type { Metadata } from 'next'

import { PageLayout } from '@/app/dashboard/_components/PageLayout'

import { UserForm } from '../_components/UserForm'

export const metadata: Metadata = {
  title: 'Добавить пользователя'
}

export default async function Page() {
  return (
    <PageLayout title="Добавить пользователя">
      <UserForm />
    </PageLayout>
  )
}

