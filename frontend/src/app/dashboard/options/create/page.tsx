import { PageLayout } from '@/components/admin/PageLayout'
import type { Metadata } from 'next'
import { OptionCreateForm } from '../_components/OptionCreateForm'
import { VerticalNav } from '@/components/VerticalNav'

export const metadata: Metadata = {
  title: 'Добавить параметр'
}

export default function Page() {
  const items = [
    {
      title: 'Свойства',
      href: `/admin/options/create`
    },
    {
      title: 'Категории'
    }
  ]
  return (
    <PageLayout title="Добавить параметр" aside={<VerticalNav items={items} />}>
      <OptionCreateForm />
    </PageLayout>
  )
}
