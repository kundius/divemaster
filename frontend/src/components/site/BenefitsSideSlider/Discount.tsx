import Image from 'next/image'
import styles from './Discount.module.css'
import { PrimaryButton, PrimaryButtonArrow } from '../PrimaryButton'
import discountImage from './assets/discount.jpg'

export function Discount() {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.title}>Увеличивайте скидку</div>
        <div className={styles.desc}>
          При первой покупке в нашем магазине Вы получаете накопительную{' '}
          <span>скидочную карту</span>. Совершая покупки по карте «DiveMaster», Вы увеличиваете
          персональную скидку.
        </div>
        <div className={styles.action}>
          <PrimaryButton asChild variant="outline" size="sm">
            <a href="#">
              Узнать больше
              <PrimaryButtonArrow />
            </a>
          </PrimaryButton>
        </div>
      </div>
      <Image className={styles.image} src={discountImage} alt="Увеличивайте скидку" />
    </div>
  )
}
