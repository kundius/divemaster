import { apiGet } from '@/lib/api'
import { CategoryEntity, ProductEntity } from '@/types'
import { Container } from '../Container'
import { PageHeadline, PageHeadlineCrumb } from '../PageHeadline'
import { CategoryCard } from '../CategoryCard'
import { getFileUrl } from '@/lib/utils'
import { ConsultationWidget } from '../ConsultationWidget'
import { BenefitsSideSlider, BenefitsSideSliderDiscount } from '../BenefitsSideSlider'

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
      <div className="grid grid-cols-5 gap-x-5 mt-10 gap-y-16 pb-10 border-b mb-14 border-neutral-100">
        {category.children?.map((item) => (
          <CategoryCard
            key={item.id}
            title={item.title}
            href={`/category/${item.alias}`}
            image={!!item.image ? getFileUrl(item.image) : '/noimage.png'}
          />
        ))}
      </div>
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
        <div className="w-4/5">
          4/5
        </div>
      </div>
    </Container>
  )
}
