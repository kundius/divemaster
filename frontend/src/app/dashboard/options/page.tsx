import type { Metadata } from 'next'
import Link from 'next/link'

import { PageLayout } from '@/components/admin/PageLayout'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { FindAllResult, OptionEntity, PageProps } from '@/types'

import { OptionList } from './_components/OptionList'

export const metadata: Metadata = {
  title: 'Характеристики'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<OptionEntity>>(
    'options',
    await searchParams,
    withServerAuth()
  )

  const actions = [
    <Button asChild key="create">
      <Link href="/dashboard/options/create">Добавить параметр</Link>
    </Button>
  ]

  return (
    <PageLayout title="Характеристики" actions={actions}>
      <OptionList fallbackData={fallbackData} />
    </PageLayout>
  )
}
