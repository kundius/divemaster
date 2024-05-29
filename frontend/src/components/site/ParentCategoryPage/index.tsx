import { apiGet } from '@/lib/api'
import { CategoryEntity, ProductEntity } from '@/types'
import { Container } from '../Container'
import { PageHeadline, PageHeadlineCrumb } from '../PageHeadline'
import { CategoryCard } from '../CategoryCard'
import { getFileUrl } from '@/lib/utils'

export interface ParentCategoryPageProps {
  alias: string
}

export async function ParentCategoryPage({ alias }: ParentCategoryPageProps) {
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
      <div className="grid grid-cols-5">
        {category.children?.map((item) => (
          <div key={item.id}>
            <CategoryCard
              title={item.title}
              href={`/category/${item.alias}`}
              image={!!item.image ? getFileUrl(item.image) : undefined}
            />
          </div>
        ))}
      </div>
    </Container>
  )
}
