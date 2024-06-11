import { BrandsPage } from '@/components/admin/BrandsPage'
import { DEFAULT_LIMIT } from '@/lib/ApiTable/constants'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { BrandEntity, PageProps } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Бренды'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<ApiTableData<BrandEntity>>(
    'brands',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withServerAuth()
  )

  return <BrandsPage initialData={initialData} />
}
