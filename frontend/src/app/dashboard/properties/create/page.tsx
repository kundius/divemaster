import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import type { Metadata } from 'next'
import { PropertyCreateForm } from '../_components/PropertyCreateForm'
import { VerticalNav } from '@/components/VerticalNav'

export const metadata: Metadata = {
  title: 'Добавить параметр'
}

export default function Page() {
  const items = [
    {
      title: 'Свойства',
      href: `/dashboard/properties/create`
    },
    {
      title: 'Категории'
    }
  ]
  return (
    <PageLayout title="Добавить параметр" aside={<VerticalNav items={items} />}>
      <PropertyCreateForm />
    </PageLayout>
  )
}
