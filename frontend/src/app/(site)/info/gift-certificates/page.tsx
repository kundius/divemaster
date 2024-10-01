import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'
import { PrimaryButton, PrimaryButtonArrow } from '@/components/site/PrimaryButton'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <SectionPage>
      <Headline className="mb-12 max-lg:mb-8 max-md:mb-6" title="Подарочные сертификаты" />
      <div className="flex items-center gap-12 max-w-3xl mx-auto max-md:flex-col">
        <Image
          src="https://divemaster.pro/templates/atemplate/images/gift_card_image.png"
          width={407}
          height={271}
          alt=""
        />
        <div className="">
          <div className="text-lg">Пожалуй, лучший подарок для дайвера или подвоха</div>
          <div className="flex mt-6 max-lg:mt-5 max-md:mt-4">
            <PrimaryButton asChild className="w-48 no-underline">
              <Link href="/contacts">
                Заказать
                <PrimaryButtonArrow />
              </Link>
            </PrimaryButton>
          </div>
        </div>
      </div>
    </SectionPage>
  )
}
