import type { Metadata } from 'next'

import { PageLayout } from '@/components/admin/PageLayout'

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

