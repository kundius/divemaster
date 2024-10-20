import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'
import Image from 'next/image'

export default function Page() {
  return (
    <SectionPage>
      <Headline className="mb-12 max-lg:mb-8 max-md:mb-6" title="О магазине" />
      <div className="mx-auto prose lg:prose-xl">
        <p>Приветствую Вас на сайте компании DiveMaster!</p>
        <p>
          Её история началась в 2008 г., когда я открыл свой первый магазин подводного снаряжения в
          городе Воронеж, с небольшим количеством ассортимента.
        </p>
        <p>
          Но на самом деле всё началось намного раньше, когда в 13 лет отец познакомил меня с водной
          стихией. Сначала это было подводное плавание, потом — и охота. Видимо, поймав свою первую
          рыбу, я определился с тем, чем хочу заниматься по жизни.
        </p>
        <p>
          К девятнадцати годам я знал уже всё об особенностях подводной охоты, необходимом
          снаряжении, и часто выступал уже как консультант для начинающих любителей.
        </p>
        <p>
          В то время качественное снаряжение было дефицитным товаром в Воронеже, и я решил открыть
          магазин с отборной продукцией, проверенной на личном опыте.
        </p>
        <p>
          Магазин стал пользоваться популярностью, так как снаряжение для дайвинга и подводной охоты
          было в нём представлено наилучшего качества. Ни одного возврата или жалобы на качество не
          было от покупателей за все эти годы.
        </p>
        <p>
          Помимо этого, популярность магазину обеспечило моё личное присутствие в нём, так как я
          давал полезные советы о нюансах нашего хобби, делился своим личным опытом и знаниями с
          начинающими «подвохами». И до сих пор участвую в жизни магазинов, так как люблю своих
          покупателей, ведь они имеют ту же страсть, что и я — страсть к подводной среде обитания.
        </p>
        <p>
          Все выходные и отпуска я провожу с семьёй и друзьями на природе, мы выезжаем с палатками к
          берегам рек и озёр, где я провожу по 6-7 часов в день в воде. И это делает меня
          счастливым. Я всегда испытываю на личной практике любой товар для подводной охоты, прежде
          чем он поступит в мои магазины для продажи. Таким образом, я даю личную гарантию на
          качество продаваемых изделий, помимо того, что они имеют свою заводскую гарантию по
          умолчанию.
        </p>
        <p>
          В 25 лет я стал обучать людей подводной охоте и дайвингу. Сегодня успешно работает моя
          школа с несколькими инструкторами. Предоставляется возможность как индивидуальных занятий,
          так и занятий в группе единомышленников. Летом занятия проходят на открытой воде — реках и
          озёрах. Зимой — в бассейне. Наша школа официальная, по окончании курса выдаются ученикам
          сертификаты международных форматов СMAZ, PADI. Предъявив данные сертификаты, можно в любой
          точке мира брать в аренду снаряжение для подводной охоты и дайвинга. Приглашаем всех
          желающих к нам на обучение!
        </p>
        <p>
          На текущий момент магазин DiveMaster является дилером известных мировых брендов, таких как
          Mares, Seac, Omer, Beuchat, Sporasub, Cressi, Pelengas, AquaDiscovery, Sargan, Salvimar,
          Imersion. Количество качественных товаров на складе способно покрыть потребности не только
          города Воронеж, но и других регионов России.
        </p>
        <p>
          В 2018 году я зарегистрировал новый бренд DiveMaster с целью производить самостоятельно
          снаряжение для подводной охоты и дайвинга. Просто в рамках предложений поставщиков мне уже
          было тесно — хотелось делать свой уникальный качественный продукт. Наиболее оптимальный по
          соотношению качества и цены. К вопросу я подошёл с особым вниманием, лично посетив
          популярные заводы-производителей данных товаров по всему миру.
        </p>
        <p>Сегодня продукция бренда DiveMaster производится на лучших предприятиях Италии.</p>
        <p>
          Мы предлагаем неопреновые товары — гидрокостюмы, перчатки. А также — маски, трубки, ласты,
          ружья (в том числе из дерева тика, что является большой редкостью), арбалеты. В планах
          выпускать баллоны, регуляторы DiveMaster. Для ценителей нашей продукции среди оптовых
          клиентов мы готовы сделать выгодное предложение по дилерству или франшизе.
        </p>
        <p>
          Таким образом, наша компания стремительно развивается с момента появления на рынке и
          добивается новых успехов. Мы любим наших клиентов и работаем для них.
        </p>
        <p>
          В качестве завершения своей приветственной речи хочу всем посоветовать: в жизни надо
          сделать один ключевой правильный выбор — в пользу дела, которое действительно любишь, и
          тогда при должном усердии успех будет обеспечен!
        </p>
        <div className="flex items-center justify-end gap-6 max-sm:flex-col">
          <div className="text-right text-xl max-sm:w-full">
            С уважением,
            <br />
            Ян Владимирович Назаревич
            <br />
            Генеральный директор,
            <br />
            основатель компании DiveMaster
          </div>
          <Image
            src="https://divemaster.pro/images/pages/yan_thumb.jpg"
            width={255}
            height={189}
            alt="Ян Владимирович Назаревич"
            className="m-0 max-sm:w-full"
          />
        </div>
      </div>
    </SectionPage>
  )
}
