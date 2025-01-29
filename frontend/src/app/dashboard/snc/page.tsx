import { PageLayout } from '@/components/admin/PageLayout'
import { PageProps } from '@/types'
import type { Metadata } from 'next'
import { Exclamation } from './_components/Exclamation'

export const metadata: Metadata = {
  title: 'Синхронизация'
}

export default async function Page(props: PageProps) {
  return (
    <PageLayout title="Синхронизация">
      <Exclamation />
    </PageLayout>
  )
}
