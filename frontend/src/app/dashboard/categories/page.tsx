import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import { Button } from '@/components/ui/button'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { PageProps, CategoryEntity } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CategoriesList } from './_components/CategoryList'

export const metadata: Metadata = {
  title: 'Категории'
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const fallbackData = await apiGet<ApiTableData<CategoryEntity>>('categories', {
    ...params,
    allowInactive: true
  })

  return (
    <PageLayout
      title="Категории"
      actions={
        <Button asChild>
          <Link href="/dashboard/categories/create">Добавить категорию</Link>
        </Button>
      }
    >
      <CategoriesList fallbackData={fallbackData} />
    </PageLayout>
  )
}
