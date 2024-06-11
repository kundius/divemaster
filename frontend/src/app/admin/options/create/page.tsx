import { PageLayout } from '@/components/admin/PageLayout'
import type { Metadata } from 'next'
import { OptionCreateForm } from '../_components/OptionCreateForm'

export const metadata: Metadata = {
  title: 'Добавить параметр'
}

export default function Page() {
  return (
    <PageLayout title="Добавить параметр">
      <OptionCreateForm />
    </PageLayout>
  )
}
