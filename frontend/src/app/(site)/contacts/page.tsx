import { Breadcrumbs, BreadcrumbsProps } from '@/components/site/Breadcrumbs'
import { DEFAULT_LIMIT } from '@/lib/ApiTable/constants'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { ProductEntity } from '@/types'

export default async function Page() {
  const initialData = await apiGet<ApiTableData<ProductEntity>>('products', {
    limit: DEFAULT_LIMIT
  })

  const crumbs: BreadcrumbsProps['items'] = [
    {
      title: 'Главная',
      href: '/'
    }
  ]
  return (
    <>
      <div className="pb-3 pt-6">
        <Breadcrumbs items={crumbs} />
        <div className="mt-2 text-4xl font-sans-narrow uppercase font-bold">Contacts</div>
      </div>
      Contacts
    </>
  )
}
