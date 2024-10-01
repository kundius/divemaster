import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'
import Image from 'next/image'

export default function Page() {
  return (
    <SectionPage>
      <Headline className="mb-12 max-lg:mb-8 max-md:mb-6" title="СКИДОЧНЫЕ КАРТЫ" />
      <div className="mx-auto prose lg:prose-xl">
        <p>
          При первой покупке в нашем магазине, Вы получите накопительную скидочную карту. Совершая
          покупки по карте «DiveMaster», Вы сможете увеличивать персональную скидку.
        </p>
      </div>
      <div className="flex justify-center flex-wrap mx-auto max-w-5xl mt-12">
        <div className="w-1/3 flex items-center justify-center flex-col aspect-square border-r border-b max-md:w-1/2">
          <div className="text-7xl font-bold text-primary mb-4 max-md:text-5xl">2%</div>
          <div className="text-2xl max-md:text-xl">от&nbsp;1&nbsp;000 ₽</div>
        </div>
        <div className="w-1/3 flex items-center justify-center flex-col aspect-square border-b max-md:w-1/2">
          <div className="text-7xl font-bold text-primary mb-4 max-md:text-5xl">5%</div>
          <div className="text-2xl max-md:text-xl">от&nbsp;10&nbsp;000 ₽</div>
        </div>
        <div className="w-1/3 flex items-center justify-center flex-col aspect-square border-l border-b max-md:w-1/2 max-md:border-l-0 max-md:border-r">
          <div className="text-7xl font-bold text-primary mb-4 max-md:text-5xl">10%</div>
          <div className="text-2xl max-md:text-xl">от&nbsp;30&nbsp;000 ₽</div>
        </div>
        <div className="w-1/3 flex items-center justify-center flex-col aspect-square border-r max-md:w-1/2 max-md:border-r-0 max-md:border-b">
          <div className="text-7xl font-bold text-primary mb-4 max-md:text-5xl">15%</div>
          <div className="text-2xl max-md:text-xl">от&nbsp;100&nbsp;000 ₽</div>
        </div>
        <div className="w-1/3 flex items-center justify-center flex-col aspect-square max-md:w-1/2">
          <div className="text-7xl font-bold text-primary mb-4 max-md:text-5xl">20%</div>
          <div className="text-2xl max-md:text-xl">от&nbsp;200&nbsp;000 ₽</div>
        </div>
      </div>
    </SectionPage>
  )
}
