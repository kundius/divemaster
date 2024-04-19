import { BenefitsSlider, BenefitsSliderDiscount } from '@/components/site/BenefitsSlider'
import { BestsellersSection } from '@/components/site/BestsellersSection'
import { BrandsSection } from '@/components/site/BrandsSection'
import {
  HeroSlider,
  HeroSliderCarpHunting,
  HeroSliderDiscount,
  HeroSliderExpert,
  HeroSliderNewYear,
  HeroSliderSpearfishing
} from '@/components/site/HeroSlider'
import { getStaticParams } from '@/locales/server'

export function generateStaticParams() {
  return getStaticParams()
}

const demoProduct = {
  title: 'Гидрокостюм AQUADISCOVERY Воевода V2',
  brand: 'AQUADISCOVERY',
  price: 14000,
  oldPrice: 4000,
  images: ['/products/1.png', '/products/2.png', '/products/3.png', '/products/4.png'],
  hit: true,
  discount: 50,
  new: true,
  colors: ['red', 'blue']
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
      <div style={{ height: 2000 }}>Home Page</div>
    </>
  )
}
