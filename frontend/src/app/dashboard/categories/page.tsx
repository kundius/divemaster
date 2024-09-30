import { PageLayout } from '@/components/admin/PageLayout'
import { Button } from '@/components/ui/button'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { PageProps, CategoryEntity } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CategoryList } from './_components/CategoryList'

export const metadata: Metadata = {
  title: 'Категории'
}

export default async function Page(props: PageProps) {
  const fallbackData = await apiGet<ApiTableData<CategoryEntity>>(
    'categories',
    props.searchParams,
    withServerAuth()
  )

  const actions = [
    <Button asChild key="create">
      <Link href="/dashboard/categories/create">Добавить категорию</Link>
    </Button>
  ]

  return (
    <PageLayout title="Блог" actions={actions}>
      <CategoryList fallbackData={fallbackData} />
    </PageLayout>
  )
}
