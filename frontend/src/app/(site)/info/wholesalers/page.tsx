import { Headline } from '@/components/Headline'
import { LabeledInput } from '@/components/LabeledInput'
import { SectionPage } from '@/components/SectionPage'
import { Container } from '@/components/site/Container'
import { PrimaryButton, PrimaryButtonArrow } from '@/components/site/PrimaryButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <div className="relative">
        <Image
          src="https://divemaster.pro/templates/atemplate/images/optovikam-bg.jpg"
          width={1920}
          height={618}
          className="absolute inset-0 object-cover w-full h-full"
          alt=""
        />
        <div className="relative">
          <Container>
            <div className="w-full min-h-[640px] pt-8 pb-12 flex flex-col justify-center max-2xl:min-h-[540px] max-xl:min-h-[480px] max-lg:min-h-min">
              <h2
                className={cn(
                  'max-w-xl mb-12 text-5xl font-sans-narrow font-bold text-primary',
                  'max-lg:text-4xl max-lg:max-w-lg max-lg:mb-10',
                  'max-md:text-2xl max-md:mb-8 max-md:max-w-md'
                )}
              >
                ПРОИЗВОДИМ, ПОСТАВЛЯЕМ СНАРЯЖЕНИЕ ПО РОССИИ И ВСЕМУ МИРУ
              </h2>
              <p className="max-w-3xl text-xl max-lg:text-lg max-lg:max-w-xl max-md:text-base max-md:max-w-md">
                Предлагаем выгодные оптовые поставки снаряжения для дайвинга и подводной охоты
                собственного бренда DiveMaster, а также самых популярных мировых торговых марок,
                например, Ferei, Mares, Imersion и других. Действует гибкая система скидок в
                зависимости от объёма и частоты закупок.
              </p>
              <div className="flex mt-6 max-lg:mt-5 max-md:mt-4">
                <PrimaryButton asChild className="w-48">
                  <Link href="/contacts">
                    Получить прайс
                    <PrimaryButtonArrow />
                  </Link>
                </PrimaryButton>
              </div>
            </div>
          </Container>
        </div>
      </div>

      <SectionPage>
        <div className="mx-auto prose lg:prose-xl">
          <p>
            Предлагаем выгодное сотрудничество для оптовых клиентов из России и других стран мира.
          </p>
          <p>Мы гарантируем высокое качество продукции!</p>
          <p>
            Широкий ассортимент снаряжения для подводной охоты и дайвинга представлен такими
            категориями товаров, как гидрокостюмы, перчатки, маски, трубки, ласты, арбалеты,
            баллоны, регуляторы и многими другими.
          </p>
          <p>
            Мы являемся производителем собственного снаряжения под брендом DiveMaster, а также
            официальными дилерами известных мировых марок, таких как Mares, Seac, Omer, Beuchat,
            Sporasub, Cressi, Pelengas, AquaDiscovery, Sargan, Salvimar, Imersion и других.
          </p>
          <p>
            Количество качественной продукции на складе способно покрыть любые Ваши потребности.
          </p>
          <p>Каждый товар проходит тестирование перед массовым производством или закупкой.</p>
          <p>Гарантия — 1 год на весь ассортимент сайта.</p>
          <p>По согласованию возможен возврат продукции в особых случаях.</p>
          <p>
            Минимальная оптовая закупка — от 10 000 руб. С данной суммы заказа начинает действовать
            оптовая цена.
          </p>
          <p>Мы предлагаем индивидуальные оптовые цены с гибкой системой скидок.</p>
          <p>
            При больших объёмах и частых поставках — начинают действовать наиболее выгодные
            предложения по цене.
          </p>
          <p>Оптовая система действует только для юридических лиц и ИП.</p>
          <p>Мы гарантируем самую низкую цену!</p>
          <p>
            Если Вы нашли какую-то продукцию дешевле, чем в нашем предложении, мы сделаем цену ещё
            ниже!
          </p>
          <p>
            Для наших клиентов мы осуществляем маркетинговую поддержку: предоставляем акции,
            каталоги и другую печатную продукцию для удобства работы с покупателями на торговых
            точках.
          </p>
          <p>
            Для ценителей продукции нашего бренда DiveMaster среди оптовых клиентов мы готовы
            сделать выгодное предложение по дилерству или франшизе.
          </p>
          <p>
            Звоните, пишите, спрашивайте — мы открыты для взаимовыгодного сотрудничества с оптовыми
            клиентами, совместного развития и готовы обсуждать любые условия поставок!
          </p>
        </div>

        <section className="px-4 mt-24">
          <h3 className="mb-12 text-3xl font-bold text-center">Отзывы</h3>

          <div className="grid gap-12 text-center md:grid-cols-2">
            <div>
              <p className="mb-4 text-xl text-neutral-500">
              &ldquo;Хочу отметить хорошее качество товара и в меру мягкий силикон масок и трубок.
                Оптимальный вариант для воды в нашем регионе и контуров лиц. Для ласт хорошо
                подобрана толщина бортиков и жёсткость, ласты стали помягче, чем их
                модель-предшественник бора-бора. В целом соотношение &ldquo;цена/качество&rdquo; очень хорошее,
                всем рекомендую!&rdquo;
              </p>
              <p className="italic">
                Магазины подводного снаряжения &ldquo;Акула&rdquo;, г. Анапа - Юрий Трунев
              </p>
            </div>

            <div>
              <p className="mb-4 text-xl text-neutral-500">
                &ldquo;Неоднократно приобретали продукцию Divemaster для реализации, она пользуется
                большим спросом. Сочетание &ldquo;цена/качество&rdquo; на 100%. &rdquo;
              </p>
              <p className="italic">
                Магазин подводного снаряжения &ldquo;Китобой&rdquo;, г. Саратов - Наталья Коротаева
              </p>
            </div>

            <div>
              <p className="mb-4 text-xl text-neutral-500">
                &ldquo;Продукцию Divemaster приобретаем с момента появления бренда, всем довольны. Продажи
                товаров отличные, покупателям всё нравится, никаких претензий не поступало.&rdquo;
              </p>
              <p className="italic">
                Магазин &ldquo;Всё для подводной охоты&rdquo;, г. Новороссийск - Михаил Кузнецов
              </p>
            </div>

            <div>
              <p className="mb-4 text-xl text-neutral-500">
                &ldquo;О продукции можем сказать только самое хорошее. &ldquo;Цена/качество&rdquo; - просто отлично.
                Расширяйтесь, с вами приятно работать! Самые лучшие наши партнёры по поставкам
                товаров для подводного плавания.&rdquo;
              </p>
              <p className="italic">
                Магазин подводного снаряжения, г. Геленджик - Валентина Рудавина
              </p>
            </div>
          </div>
        </section>
      </SectionPage>
    </>
  )
}
