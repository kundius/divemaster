import { Container } from '../Container'
import styles from './index.module.scss'
import Image from 'next/image'

export function HomeAbout() {
  return (
    <div className={styles.root}>
      <Container>
        <div className={styles.heading}>
          Интернет-магазин снаряжения для дайвинга, подводной охоты
          <br />и плавания DiveMaster
        </div>
        <Image
          src="/home-about/image1.jpg"
          alt=""
          width={709}
          height={817}
          className={styles.image1}
        />
        <Image
          src="/home-about/ivemaster.png"
          width={641}
          height={253}
          alt=""
          className={styles.ivemaster}
        />
        <Image src="/home-about/d.png" alt="" width={143} height={431} className={styles.d} />
        <div className={styles.grid}>
          <div className={styles.equipment}>
            <div className={styles.title}>
              Экипировка для подводной охоты, дайвинга, плавания
              <br />
              оптом и в розницу
            </div>
            <div className={styles.content}>
              <ul className={styles.listCheck}>
                <li>Низкие цены в Воронеже и России.</li>
                <li>Бесплатная доставка по России при заказе от 5 000 ₽ ₽.</li>
                <li>
                  Поставки по всему миру по конкурентной цене от производителя снаряжения
                  DiveMaster.
                </li>
              </ul>
              <p>
                У нас в магазине divemaster.pro Вы найдёте абсолютно всё, что нужно для активного
                отдыха в воде!
                <br /> А менеджеры проконсультируют и помогут подобрать наиболее подходящий товар
                именно Вам.
              </p>
            </div>
          </div>
          <div className={styles.assortment}>
            <div className={styles.title}>Ассортимент товаров</div>
            <div className={styles.content}>
              <p>
                Предлагаем рассмотреть в каталоге широкий ассортимент снаряжения и аксессуаров для
                дайвинга и подводной охоты. На выбор:
              </p>
              <ul className={styles.listDot}>
                <li>Все виды костюмов для плавания</li>
                <li>Разнообразные маски для ныряния и трубки</li>
                <li>Ласты и лопасти</li>
                <li>Арбалеты и пневматические ружья для подводной охоты и комплектующие к ним</li>
                <li>Ножи и гарпуны</li>
                <li>Жилеты, разгрузки, груза и пр.</li>
                <li>
                  Баллоны и оборудование для контроля показателей (манометр, компас, компьютер для
                  дайвинга и т.д.)
                </li>
                <li>Дополнительные аксессуары для подводного плавания</li>
              </ul>
              <p>И многое другое, что может потребоваться при активном отдыхе на воде.</p>
              <p>
                Соберите полный комплект снаряжения для прохождения обучения дайвингу и подводной
                охоте или для профессионального занятия!
              </p>
            </div>
          </div>
          <div className={styles.guest}>
            <div className="flex justify-between gap-12">
              <div>
                <div className={styles.title}>Приходите в гости!</div>
                <div className={styles.content}>
                  <p>
                    Посетите наши магазины и получите экспертную консультацию по выбору снаряжения
                    для дайвинга и подводной охоты.
                    <br />
                    Изучайте ассортимент, подбирайте товары. Мы не побеспокоим вас, пока вам не
                    потребуется наша помощь.
                  </p>
                  <p>
                    Адреса магазинов:
                    <br />
                    в Москве: Москва, Кузьминки, ул. Есенина, 123, ТЦ «МЕГА», 4 этаж.
                    <br />в Воронеже: Воронеж, ул. 20 лет Октября, 123, ТЦ «Европа», 4 этаж.
                  </p>
                  <p>Работаем ежедневно с 10:00-18:00.</p>
                </div>
              </div>
              <div>
                <Image
                  src="/home-about/image2.jpg"
                  alt=""
                  width={186}
                  height={412}
                  className={styles.image2}
                />
              </div>
            </div>
          </div>
          <div className={styles.discount}>
            <div className={styles.title}>Покупайте выгодно: скидки, бонусы и подарки</div>
            <div className={styles.content}>
              <div className="flex items-center justify-around w-[540px] max-w-full">
                <div>
                  <Image src="/home-about/gift.svg" alt="" width={58} height={58} />
                </div>
                <div>
                  <Image src="/home-about/card.svg" alt="" width={92} height={67} />
                </div>
                <div>
                  <Image src="/home-about/discount.svg" alt="" width={70} height={70} />
                </div>
              </div>
              <ul className={styles.listDotAlt}>
                <li>Покупайте товары со скидкой по бонусной карте DiveMaster.</li>
                <li>Выбирайте подарки и подарочные сертификаты для родных и близких.</li>
                <li>
                  Подписывайтесь на нашу рассылку и среди первых получайте доступ к закрытым
                  распродажам.
                </li>
                <li>
                  Получите доступ в сообщество дайверов и единомышленников в нашем телеграм-канале и
                  других соцсетях.
                </li>
              </ul>
            </div>
            <Image src="/home-about/s.png" alt="" width={98} height={385} className={styles.s} />
          </div>
        </div>
      </Container>
    </div>
  )
}