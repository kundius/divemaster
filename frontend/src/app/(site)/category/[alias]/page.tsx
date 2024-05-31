import { CategoryPage } from '@/components/site/CategoryPage'
import { ParentCategoryPage } from '@/components/site/ParentCategoryPage'
import { ApiTableData } from '@/components/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { CategoryEntity } from '@/types'

export async function generateStaticParams() {
  const categories = await apiGet<ApiTableData<CategoryEntity>>(`categories`, { all: true })
  return categories.rows.map(({ alias }) => ({ alias }))
}

export default async function Page({ params }: { params: { alias: string } }) {
  // TODO: HIERARCHY_DEPTH_LIMIT
  // в populate указана необходимоя вложенность родителей 
  const category = await apiGet<CategoryEntity>(`categories/alias:${params.alias}`, {
    populate: ['children', 'parent', 'parent.parent']
  })

  if (!!category.children?.length) {
    return <ParentCategoryPage alias={params.alias} />
  }

  return <CategoryPage alias={params.alias} />
}
