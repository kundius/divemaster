import { apiGet } from '@/lib/api'
import { CategoryEntity, ProductEntity } from '@/types'
import { Container } from '../Container'
import { PageHeadline, PageHeadlineCrumb } from '../PageHeadline'

export interface ParentCategoryPageProps {
  alias: string
}

export async function ParentCategoryPage({ alias }: ParentCategoryPageProps) {
  const category = await apiGet<CategoryEntity>(`categories/alias:${alias}`, {
    populate: ['children', 'parent']
  })

  const getCrumbs = () => {
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

    if (!!category.parent && typeof category.parent === 'object') {
      crumbs.push({
        title: category.parent.title,
        href: `/category/${category.parent.alias}`
      })
    }

    crumbs.push({
      title: category.title
    })

    return crumbs
  }

  return (
    <Container>
      <PageHeadline title={category.title} crumbs={getCrumbs()} />
      {category.title}
    </Container>
  )
}
