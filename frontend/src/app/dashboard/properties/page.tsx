import type { Metadata } from 'next'
import Link from 'next/link'
import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { FindAllResult, PropertyEntity, PageProps } from '@/types'

import { PropertyList } from './_components/PropertyList'

export const metadata: Metadata = {
  title: 'Характеристики'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<PropertyEntity>>('properties', await searchParams)

  const actions = [
    <Button asChild key="create">
      <Link href="/dashboard/properties/create">Добавить параметр</Link>
    </Button>
  ]

  return (
    <PageLayout title="Характеристики" actions={actions}>
      <PropertyList fallbackData={fallbackData} />
    </PageLayout>
  )
}
