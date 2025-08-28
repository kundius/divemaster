import Image from 'next/image'
import styles from './Discount.module.css'

export function Discount() {
  return (
    <div className={styles.discount}>
      <div className={styles.title}>Покупайте выгодно: скидки, бонусы и подарки</div>
      <div className={styles.content}>
        <div className="flex items-center justify-around w-[550px] max-w-full mt-16 mb-8 -ml-4 max-xl:mt-12 max-lg:mt-8 max-md:w-[240px] max-md:mt-6">
          <div>
            <Image
              src="/home-about/gift.svg"
              alt=""
              width={58}
              height={58}
              className="max-lg:w-[40px] max-lg:h-[40px] max-md:w-[32px] max-md:h-[32px] object-cover"
            />
          </div>
          <div>
            <Image
              src="/home-about/card.svg"
              alt=""
              width={92}
              height={67}
              className="max-lg:w-[60px] max-lg:h-[44px] max-md:w-[51px] max-md:h-[38px] object-cover"
            />
          </div>
          <div>
            <Image
              src="/home-about/discount.svg"
              alt=""
              width={70}
              height={70}
              className="max-lg:w-[48px] max-lg:h-[48px] max-md:w-[38px] max-md:h-[38px] object-cover"
            />
          </div>
        </div>
        <ul className={styles.listDotAlt}>
          <li>Покупайте товары со скидкой по бонусной карте DiveMaster.</li>
          <li>Выбирайте подарки и подарочные сертификаты для родных и близких.</li>
          <li>
            Подписывайтесь на нашу рассылку и среди первых получайте доступ к закрытым распродажам.
          </li>
          <li>
            Получите доступ в сообщество дайверов и единомышленников в нашем телеграм-канале и
            других соцсетях.
          </li>
        </ul>
      </div>
      <Image src="/home-about/s.png" alt="" width={98} height={385} className={styles.s} />
    </div>
  )
}
