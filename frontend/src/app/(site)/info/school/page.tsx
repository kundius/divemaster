import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'
import { Metadata } from 'next'

import image1 from './1.jpg'
import image2 from './2.jpg'
import image3 from './3.jpg'
import image4 from './4.jpg'
import image5 from './5.jpg'
import image6 from './6.jpg'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Школа обучения подводному плаванию, скубатлону, подводной охоте взрослых и детей',
  keywords:
    'Школа обучения подводному плаванию, обучение скубатлону, обучения подводной охоте, обучение плаванию взрослых и детей, школа подвох, школа плавания в Воронеже',
  description:
    'В нашей школе проводится обучение плаванию сертифицированным тренером взрослых и детей в Воронеже, обучение по системе CMAS'
}

export default function Page() {
  return (
    <SectionPage>
      <Headline
        className="mb-12 max-lg:mb-8 max-md:mb-6"
        title="Школа подводной охоты и дайвинга"
      />
      <div className="mx-auto prose lg:prose-xl">
        <p>
          Школа подводной охоты и дайвинга предлагает обучение для всех уровней подготовки. Опытные
          инструкторы помогут вам освоить искусство подводной охоты и дайвинга, а также предоставят
          возможность заниматься индивидуально или в группе. Летние занятия проводятся на открытой
          воде, а зимой — в бассейне. По окончании курса ученики получают сертификаты международных
          стандартов CMA, PADI, которые позволяют арендовать снаряжение для подводной охоты и
          дайвинга в любой точке мира. Присоединяйтесь к нам и откройте для себя удивительный мир
          подводных приключений!
        </p>
        <p>В нашей школе обучают:</p>
        <p>Тренер по детскому плаванию и инструктор по дайвингу международной организации CMAS.</p>
        <p className="grid grid-cols-2 grid-rows-2 gap-4">
          <Image
            src={image3}
            alt=""
            width={597}
            height={856}
            className="m-0"
            style={{ gridColumn: '1 / 2', gridRow: '1 / 3' }}
          />
          <Image
            src={image6}
            alt=""
            width={1197}
            height={847}
            className="m-0"
            style={{ gridColumn: '2 / 3', gridRow: '1 / 2' }}
          />
          <Image
            src={image2}
            alt=""
            width={597}
            height={856}
            className="m-0"
            style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}
          />
        </p>
        <p>Инструктор по скубатлону</p>
        <p className="grid grid-cols-2 gap-4">
          <Image src={image2} alt="" width={597} height={856} />
        </p>
        <p>
          Профессионально занимаемся подводным плаванием с 2004 года. Проводится обучение и
          тренировки детей и взрослых.
        </p>
        <p className="grid grid-cols-3 gap-4">
          <Image src={image4} alt="" width={1080} height={1080} className="m-0" />
          <Image src={image1} alt="" width={640} height={640} className="m-0" />
          <Image src={image5} alt="" width={854} height={854} className="m-0" />
        </p>
        <p>
          Телефон для записи <strong>+7 (906) 586-55-55</strong>
        </p>
      </div>
    </SectionPage>
  )
}
