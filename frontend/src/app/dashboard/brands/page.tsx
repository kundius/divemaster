import type { Metadata } from 'next'
import Link from 'next/link'
import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { BrandEntity, FindAllResult, PageProps } from '@/types'
import { BrandList } from './_components/BrandList'

export const metadata: Metadata = {
  title: 'Бренды'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<BrandEntity>>('brands', await searchParams)

  const actions = [
    <Button asChild key="create">
      <Link href="/dashboard/brands/create">Добавить бренд</Link>
    </Button>
  ]

  return (
    <PageLayout title="Бренды" actions={actions}>
      <BrandList fallbackData={fallbackData} />
    </PageLayout>
  )
}
