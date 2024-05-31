import { apiGet } from '@/lib/api'
import { CategoryEntity, ProductEntity } from '@/types'
import { Container } from '../Container'
import { PageHeadline, PageHeadlineCrumb } from '../PageHeadline'
import { ConsultationWidget } from '../ConsultationWidget'
import { BenefitsSideSlider, BenefitsSideSliderDiscount } from '../BenefitsSideSlider'

export interface CategoryPageProps {
  alias: string
}

export async function CategoryPage({ alias }: CategoryPageProps) {
  // TODO: HIERARCHY_DEPTH_LIMIT
  // в populate указана необходимоя вложенность родителей
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
      <div className="flex gap-x-5 pb-40 pt-14">
        <div className="w-1/5 space-y-5">
          <ConsultationWidget />
          <BenefitsSideSlider
            items={[
              {
                content: <BenefitsSideSliderDiscount />,
                name: 'BenefitsSideSliderDiscount1'
              },
              {
                content: <BenefitsSideSliderDiscount />,
                name: 'BenefitsSideSliderDiscount2'
              },
              {
                content: <BenefitsSideSliderDiscount />,
                name: 'BenefitsSideSliderDiscount3'
              }
            ]}
          />
        </div>
        <div className="w-4/5">4/5</div>
      </div>
    </Container>
  )
}
