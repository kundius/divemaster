import { AllCategories } from '@/app/(site)/_components/AllCategories'
import { BestDealCarousel } from '@/app/(site)/_components/BestDealCarousel'
import { BestsellersCarousel } from '@/app/(site)/_components/BestsellersCarousel'
import { BrandsCarousel } from '@/app/(site)/_components/BrandsCarousel'
import { Container } from '@/components/Container'
import { FooterBenefits } from '@/app/(site)/_components/FooterBenefits'
import { apiGet } from '@/lib/api'
import { FindAllResult, ProductEntity } from '@/types'
import {
  HeroSlider,
  HeroSliderCarpHunting,
  HeroSliderDiscount,
  HeroSliderExpert,
  HeroSliderNewYear,
  HeroSliderSpearfishing
} from './_components/HeroSlider'
import { BenefitsSlider, BenefitsSliderDiscount } from './_components/BenefitsSlider'
import { HomeAbout } from './_components/HomeAbout'

export default async function Page() {
  const [favoriteProducts, recentProducts] = await Promise.all([
    apiGet<FindAllResult<ProductEntity>>(
      `products`,
      {
        limit: 10,
        favorite: true,
        withImages: true,
        withBrand: true,
        withOptions: true,
        withOffers: true,
        active: true
      },
      {
        next: {
          revalidate: 60 * 5
        }
      }
    ),
    apiGet<FindAllResult<ProductEntity>>(
      `products`,
      {
        limit: 10,
        recent: true,
        withImages: true,
        withBrand: true,
        withOptions: true,
        withOffers: true,
        active: true
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
          {/* TODO: brands */}
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
          <BestDealCarousel items={recentProducts.rows} />
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
