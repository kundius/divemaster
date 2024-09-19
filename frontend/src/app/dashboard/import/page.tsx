import { PageLayout } from '@/components/admin/PageLayout'
import { PageProps } from '@/types'
import type { Metadata } from 'next'
import { Exclamation } from './_components/Exclamation'
import { Upload } from './_components/Upload'

export const metadata: Metadata = {
  title: 'Импорт'
}

export default async function Page(props: PageProps) {
  return (
    <PageLayout title="Импорт" actions={<Upload />}>
      <Exclamation />
    </PageLayout>
  )
}
