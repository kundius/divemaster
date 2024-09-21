import type { Metadata } from 'next'

import { PageLayout } from '@/components/admin/PageLayout'

import { UserRoleForm } from '../_components/UserRoleForm'

export const metadata: Metadata = {
  title: 'Добавить доступ'
}

export default async function Page() {
  return (
    <PageLayout title="Добавить доступ">
      <UserRoleForm />
    </PageLayout>
  )
}

