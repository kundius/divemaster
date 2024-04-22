import { BenefitsSlider, BenefitsSliderDiscount } from '@/components/site/BenefitsSlider'
import { BestDdeal } from '@/components/site/BestDdeal'
import { BestsellersSection } from '@/components/site/BestsellersSection'
import { BrandsSection } from '@/components/site/BrandsSection'
import { AllCategories } from '@/components/site/AllCategories'
import { Container } from '@/components/site/Container'
import {
  HeroSlider,
  HeroSliderCarpHunting,
  HeroSliderDiscount,
  HeroSliderExpert,
  HeroSliderNewYear,
  HeroSliderSpearfishing
} from '@/components/site/HeroSlider'

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

export default function Page({ params: { locale } }: { params: { locale: string } }) {
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
          <BrandsSection
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
      <div className="bg-gray-to-light pt-6 pb-20 overflow-hidden">
        <Container>
          <BestsellersSection
            items={[
              demoProduct,
              demoProduct,
              demoProduct,
              demoProduct,
              demoProduct,
              demoProduct,
              demoProduct,
              demoProduct,
              demoProduct
            ]}
          />
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
      <div className="pt-32 overflow-hidden">
        <Container className="space-y-20">
          <BestDdeal items={[demoProduct, demoProduct, demoProduct, demoProduct]} />
          <div className="space-y-6">
            <div className="text-lg font-bold font-sans-narrow uppercase">
              Снаряжение для подводной охоты, дайвинга и плавания
            </div>
            <AllCategories />
          </div>
        </Container>
      </div>
      <div style={{ height: 2000 }}>Home Page</div>
    </>
  )
}
