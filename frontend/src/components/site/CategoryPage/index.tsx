import { apiGet } from '@/lib/api'
import { CategoryEntity, ProductEntity } from '@/types'
import { Container } from '../Container'
import { PageHeadline, PageHeadlineCrumb } from '../PageHeadline'

export interface CategoryPageProps {
  alias: string
}

export async function CategoryPage({ alias }: CategoryPageProps) {
  const category = await apiGet<CategoryEntity>(`categories/alias:${alias}`, {
    populate: ['children', 'parent', 'parent.parent']
  })

  const crumbs: PageHeadlineCrumb[] = [
    {
      title: 'Главная',
      href: '/'
    },
    {
      title: 'Каталог',
      href: '/catalog'
    }
  ]

  const addParents = (category: CategoryEntity) => {
    if (!!category.parent && typeof category.parent === 'object') {
      addParents(category.parent)
      crumbs.push({
        title: category.parent.title,
        href: `/category/${category.parent.alias}`
      })
    }
  }

  addParents(category)

  crumbs.push({
    title: category.title
  })

  return (
    <Container>
      <PageHeadline title={category.title} crumbs={crumbs} />
      CategoryPage
    </Container>
  )
}
