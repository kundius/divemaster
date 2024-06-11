import { ApiTableData } from '@/lib/ApiTable/types'
import { AllCategories } from '@/components/site/AllCategories'
import { BenefitsSlider, BenefitsSliderDiscount } from '@/components/site/BenefitsSlider'
import { BestDdealCarousel } from '@/components/site/BestDdealCarousel'
import { BestsellersCarousel } from '@/components/site/BestsellersCarousel'
import { BrandsCarousel } from '@/components/site/BrandsCarousel'
import { Container } from '@/components/site/Container'
import { FooterBenefits } from '@/components/site/FooterBenefits'
import {
  HeroSlider,
  HeroSliderCarpHunting,
  HeroSliderDiscount,
  HeroSliderExpert,
  HeroSliderNewYear,
  HeroSliderSpearfishing
} from '@/components/site/HeroSlider'
import { HomeAbout } from '@/components/site/HomeAbout'
import { apiGet } from '@/lib/api'
import { ProductEntity } from '@/types'

const demoProduct = {
  title: 'Гидрокостюм AQUADISCOVERY Воевода V2',
  brand: 'AQUADISCOVERY',
  price: 14000,
  oldPrice: 4000,
  images: ['/products/1.png', '/products/2.png', '/products/3.png', '/products/4.png'],
  hit: true,
  discount: 50,
  new: true,
  colors: ['red', 'blue'],
  sizes: ['S', 'M', 'L', 'XL', 'XXL']
}

export default async function Page() {
  const [favoriteProducts, recentProducts] = await Promise.all([
    apiGet<ApiTableData<ProductEntity>>(
      `products`,
      {
        limit: 10,
        populate: ['images', 'brand'],
        filters: ['active', 'favorite']
      },
      {
        next: {
          revalidate: 60 * 5
        }
      }
    ),
    apiGet<ApiTableData<ProductEntity>>(
      `products`,
      {
        limit: 10,
        populate: ['images', 'brand'],
        filters: ['active', 'recent']
      },
      {
        next: {
          revalidate: 60 * 5
        }
      }
    )
  ])

  return (
    <>
      <HeroSlider
        slides={[
          {
            content: <HeroSliderExpert />,
            name: 'HeroSliderExpert'
          },
          {
            content: <HeroSliderNewYear />,
            name: 'HeroSliderNewYear'
          },
          {
            content: <HeroSliderDiscount />,
            name: 'HeroSliderDiscount'
          },
          {
            content: <HeroSliderSpearfishing />,
            name: 'HeroSliderSpearfishing'
          },
          {
            content: <HeroSliderCarpHunting />,
            name: 'HeroSliderCarpHunting'
          }
        ]}
      />
      <div className="bg-white py-6">
        <Container>
          <BrandsCarousel
            items={[
              {
                image: '/brands/1.png'
              },
              {
                image: '/brands/2.png'
              },
              {
                image: '/brands/3.png'
              },
              {
                image: '/brands/4.png'
              },
              {
                image: '/brands/5.png'
              },
              {
                image: '/brands/6.png'
              },
              {
                image: '/brands/1.png'
              },
              {
                image: '/brands/2.png'
              },
              {
                image: '/brands/3.png'
              },
              {
                image: '/brands/4.png'
              },
              {
                image: '/brands/5.png'
              },
              {
                image: '/brands/6.png'
              }
            ]}
          />
        </Container>
      </div>
      <div className="bg-gray-to-light pt-6 pb-20 overflow-hidden max-md:pb-6 max-md:pt-8">
        <Container>
          <BestsellersCarousel items={favoriteProducts.rows} />
        </Container>
      </div>
      <BenefitsSlider
        items={[
          {
            content: <BenefitsSliderDiscount />,
            name: 'BenefitsSliderDiscount1'
          },
          {
            content: <BenefitsSliderDiscount />,
            name: 'BenefitsSliderDiscount2'
          },
          {
            content: <BenefitsSliderDiscount />,
            name: 'BenefitsSliderDiscount3'
          }
        ]}
      />
      <div className="pt-32 pb-16 overflow-hidden max-md:pt-12 max-md:pb-8">
        <Container className="space-y-20 max-md:space-y-16">
          <BestDdealCarousel items={recentProducts.rows} />
          <div className="space-y-6">
            <div className="text-lg font-bold font-sans-narrow uppercase max-md:text-base ">
              Снаряжение для подводной охоты, дайвинга и плавания
            </div>
            <AllCategories />
          </div>
        </Container>
      </div>
      <HomeAbout />
      <FooterBenefits />
    </>
  )
}
