import { CategoriesPage } from '@/components/admin/CategoriesPage'
import { DEFAULT_LIMIT } from '@/lib/ApiTable/constants'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { PageProps, CategoryEntity } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Категории'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<ApiTableData<CategoryEntity>>(
    'categories',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withServerAuth()
  )

  return <CategoriesPage initialData={initialData} />
}
