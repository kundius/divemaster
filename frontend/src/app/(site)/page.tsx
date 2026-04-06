import { AllCategories } from '@/app/(site)/_components/AllCategories'
import { BestDealCarousel } from '@/app/(site)/_components/BestDealCarousel'
import { BestsellersCarousel } from '@/app/(site)/_components/BestsellersCarousel'
import { BrandsCarousel } from '@/app/(site)/_components/BrandsCarousel'
import { Container } from '@/components/Container'
import { FooterBenefits } from '@/app/(site)/_components/FooterBenefits'
import { apiGet } from '@/lib/api'
import { BrandEntity, FindAllResult, ProductEntity } from '@/types'
import {
  HeroSlider,
  HeroSliderCarpHunting,
  HeroSliderDefault,
  HeroSliderDiscount,
  HeroSliderExpert,
  HeroSliderNewYear,
  HeroSliderSeason,
  HeroSliderSpearfishing
} from './_components/HeroSlider'
import { BenefitsSlider, BenefitsSliderDiscount } from './_components/BenefitsSlider'
import { HomeAbout } from './_components/HomeAbout'
import { getApiUrl, getFileUrl } from '@/lib/utils'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PrimaryButton, PrimaryButtonArrow } from '@/components/PrimaryButton'
import Link from 'next/link'

export default async function Page() {
  const [favoriteProducts, recentProducts, brands] = await Promise.all([
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
    ),
    apiGet<FindAllResult<BrandEntity>>('brands', { limit: 100 })
  ])

  return (
    <>
      <HeroSlider
        slides={[
          // {
          //   content: <HeroSliderExpert />,
          //   name: 'HeroSliderExpert'
          // },
          // {
          //   content: <HeroSliderNewYear />,
          //   name: 'HeroSliderNewYear'
          // },
          // {
          //   content: (
          //     <HeroSliderDefault
          //       title="Пример заголовка слайда"
          //       description="Пример описания слайда"
          //       background={
          //         <>
          //           <Image
          //             src="/hero/default.jpg"
          //             width={2000}
          //             height={850}
          //             loading="eager"
          //             alt=""
          //             sizes="100vw"
          //             quality={90}
          //             className="max-sm:hidden"
          //           />
          //           <Image
          //             src="/hero/default.jpg"
          //             width={2000}
          //             height={850}
          //             loading="eager"
          //             alt=""
          //             sizes="100vw"
          //             quality={90}
          //             className="sm:hidden"
          //           />
          //         </>
          //       }
          //       action={
          //         <PrimaryButton asChild variant="outline">
          //           <Link href="/catalog">
          //             Перейти к товарам
          //             <PrimaryButtonArrow />
          //           </Link>
          //         </PrimaryButton>
          //       }
          //     />
          //   ),
          //   name: 'example'
          // },
          {
            content: <HeroSliderSeason />,
            name: 'season'
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
            items={brands.rows
              .filter((n) => !!n.imageId)
              .map((n) => ({
                image: getFileUrl(n.imageId as number),
                href: `/brand/${n.alias}`,
                name: n.name
              }))}
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
