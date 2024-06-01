import Image from 'next/image'
import styles from './Guest.module.scss'

export function Guest() {
  return (
    <div className={styles.guest}>
      <div className={styles.title}>Приходите в гости!</div>
      <Image
        src="/home-about/guest-h.jpg"
        alt=""
        width={289}
        height={200}
        className={styles.guestImageH}
      />
      <div className={styles.content}>
        <p>
          Посетите наши магазины и получите экспертную консультацию по выбору снаряжения для
          дайвинга и подводной охоты.
          <br />
          Изучайте ассортимент, подбирайте товары. Мы не побеспокоим вас, пока вам не потребуется
          наша помощь.
        </p>
        <p>
          Адреса магазинов:
          <br />
          в Москве: Москва, Кузьминки, ул. Есенина, 123, ТЦ «МЕГА», 4 этаж.
          <br />в Воронеже: Воронеж, ул. 20 лет Октября, 123, ТЦ «Европа», 4 этаж.
        </p>
        <p>Работаем ежедневно с 10:00-18:00.</p>
      </div>
      <Image
        src="/home-about/guest-v.jpg"
        alt=""
        width={186}
        height={412}
        className={styles.guestImageV}
      />
    </div>
  )
}
