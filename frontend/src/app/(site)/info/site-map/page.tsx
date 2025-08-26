import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'

export default function Page() {
  return (
    <SectionPage>
      <Headline className="mb-12 max-lg:mb-8 max-md:mb-6" title="Карта сайта" />
      <div className="mx-auto prose lg:prose-xl">
        <h4>ИНФОРМАЦИЯ</h4>
        <ul>
          <li>
            <a href="/catalog">Каталог</a>
          </li>
          <li>
            <a href="/info/about">О магазине</a>
          </li>
          <li>
            <a href="/info/delivery">Доставка</a>
          </li>
          <li>
            <a href="/info/payment">Оплата</a>
          </li>
          <li>
            <a href="/info/guarantee">Гарантии</a>
          </li>
          <li>
            <a href="/info/discount">Скидки</a>
          </li>
          <li>
            <a href="/blog">Блог</a>
          </li>
        </ul>
        <h4>ОПТОВИКАМ</h4>
        <ul>
          <li>
            <a href="/info/wholesalers">Прайс-лист</a>
          </li>
          <li>
            <a href="/contacts">Контакты</a>
          </li>
        </ul>
      </div>
    </SectionPage>
  )
}
