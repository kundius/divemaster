import { BestsellersSection } from '@/components/site/BestsellersSection'
import { BrandsSection } from '@/components/site/BrandsSection'
import { HeroSlider } from '@/components/site/HeroSlider'
import { CarpHunting } from '@/components/site/HeroSlider/CarpHunting'
import { Discount } from '@/components/site/HeroSlider/Discount'
import { Expert } from '@/components/site/HeroSlider/Expert'
import { NewYear } from '@/components/site/HeroSlider/NewYear'
import { Spearfishing } from '@/components/site/HeroSlider/Spearfishing'
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
            content: <Expert />,
            name: 'Expert'
          },
          {
            content: <NewYear />,
            name: 'NewYear'
          },
          {
            content: <Discount />,
            name: 'Discount'
          },
          {
            content: <Spearfishing />,
            name: 'Spearfishing'
          },
          {
            content: <CarpHunting />,
            name: 'CarpHunting'
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
      <BestsellersSection items={[demoProduct, demoProduct, demoProduct, demoProduct, demoProduct, demoProduct, demoProduct, demoProduct, demoProduct]} />
      <div>Home Page</div>
    </>
  )
}
