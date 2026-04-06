import Image from 'next/image'
import styles from './Season.module.css'
import { PrimaryButton, PrimaryButtonArrow } from '@/components/PrimaryButton'
import Link from 'next/link'
import { PaintTransition } from './PaintTransition'
import { cn } from '@/lib/utils'

export function Season() {
  return (
    <div className={styles.root}>
      <div className={styles.bg} data-parallax={''}>
        <PaintTransition interval={5000} duration="2.5s">
          <div className={styles['bg-group']}>
            <Image
              src="/hero/season2026-1_3.jpg"
              width={2000}
              height={850}
              loading="eager"
              alt=""
              sizes="100vw"
              quality={90}
              className={cn('max-sm:hidden', styles['bg-image'])}
            />
            <Image
              src="/hero/season2026-1_3-small.jpg"
              width={640}
              height={480}
              loading="eager"
              alt=""
              sizes="100vw"
              quality={90}
              className={cn('sm:hidden', styles['bg-image'])}
            />
          </div>
          <div className={styles['bg-group']}>
            <Image
              src="/hero/season2026-2_2.jpg"
              width={2000}
              height={850}
              loading="eager"
              alt=""
              sizes="100vw"
              quality={90}
              className={cn('max-sm:hidden', styles['bg-image'])}
            />
            <Image
              src="/hero/season2026-2_2-small.jpg"
              width={640}
              height={480}
              loading="eager"
              alt=""
              sizes="100vw"
              quality={90}
              className={cn('sm:hidden', styles['bg-image'])}
            />
          </div>
        </PaintTransition>
      </div>
      <div className={styles.content}>
        <div className={styles.labelWrap}>
          <div className={styles.label}>Всё для подводной охоты</div>
          <div className={styles.labelText1}>
            <span className={styles.labelText1El1} />
            <span className={styles.labelText1El2} />
            <span className={styles.labelText1El3} />
            <span className={styles.labelText1El4} />
            <span className={styles.labelText1El5} />
            <span className={styles.labelText1El6} />
            <span className={styles.labelText1El7} />
            <span className={styles.labelText1El8} />
            <span className={styles.labelText1El9} />
            2026
          </div>
          <div className={styles.labelText2}>
            <span className={styles.labelText2El1} />
            <span className={styles.labelText2El2} />
            <span className={styles.labelText2El3} />
            <span className={styles.labelText2El4} />
            Консультации профессионалов
          </div>
          <div className={styles.labelText3}>
            <span className={styles.labelText3El1} />
            <span className={styles.labelText3El2} />
            <span className={styles.labelText3El3} />
            <span className={styles.labelText3El4} />
            <span className={styles.labelText3El5} />
            <span className={styles.labelText3El6} />
            Бесплатная доставка по России при заказе от 5 000 рублей
          </div>
        </div>
        <div className={styles.title}>
          Сезон 2026
          <br /> открыт!
        </div>
        <div className={styles.desc}>
          Заказывайте <span>снаряжение</span> на сайте divemaster.ru
          <br />и получайте специальные скидки
        </div>
        <div className={styles.action}>
          <PrimaryButton asChild variant="outline">
            <Link href="/catalog">
              Перейти к товарам
              <PrimaryButtonArrow />
            </Link>
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
