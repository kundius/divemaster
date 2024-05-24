import { CategoriesPage } from '@/components/admin/CategoriesPage'
import { DEFAULT_LIMIT } from '@/components/vesp/VespTable/constants'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { PageProps, Category } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Категории'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<VespTableData<Category>>(
    'categories',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withAuth()
  )

  return <CategoriesPage initialData={initialData} />
}
