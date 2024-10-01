import Link from 'next/link'

import { Headline } from '@/components/Headline'
import { SpriteIcon } from '@/components/SpriteIcon'

import { Group } from './_components/Group'
import { Wall } from './_components/Wall'
import { SectionPage } from '@/components/SectionPage'

export default async function Page() {
  return (
    <SectionPage>
      <Headline className="mb-24 max-md:mb-12" title="Контакты" />
      <Wall className="grid grid-cols-3 gap-12 max-2xl:gap-8 max-xl:gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
        <Group
          title="Позвоните по телефону"
          icon={<SpriteIcon name="contacts-phone" className="w-12 h-12 mt-0.5 -ml-2" />}
        >
          +7 (906) 586-55-55
        </Group>
        <Group
          title="Приходите в магазин"
          icon={<SpriteIcon name="contacts-marker" className="w-10 h-10 ml-0.5 mt-1.5" />}
        >
          г. Воронеж, ул. 20 лет Октября 123, ТЦ&nbsp;"Европа", 4&nbsp;этаж
        </Group>
        <Group
          title="Напишите нам в соцсетях"
          icon={<SpriteIcon name="contacts-social" className="w-11 h-11 mt-1 -ml-0.5" />}
        >
          <div className="flex gap-4 -mt-1.5 -mb-1 max-xl:gap-3 max-xl:mt-0 max-xl:mb-0">
            <Link
              href="https://ok.ru/group/49481371549835"
              className="flex items-center justify-center text-white w-9 h-9 rounded-md bg-[#9ea4a7] hover:bg-[#ff7700] transition"
              target="_blank"
            >
              <SpriteIcon name="social-ok" size={20} />
            </Link>
            <Link
              href="https://vk.com/clubpodvoh"
              className="flex items-center justify-center text-white w-9 h-9 rounded-md bg-[#9ea4a7] hover:bg-[#0077ff] transition"
              target="_blank"
            >
              <SpriteIcon name="social-vk" />
            </Link>
          </div>
        </Group>
      </Wall>
    </SectionPage>
  )
}
