import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import styles from './Warranty.module.scss'

export function Warranty() {
  return (
    <div className={styles.items}>
      <Popover>
        <PopoverTrigger asChild>
          <div className={styles.item}>
            <div className={styles.icon}>
              <svg viewBox="0 0 20 21" width="20" height="21">
                <use href="/sprite.svg#manufacturer"></use>
              </svg>
            </div>
            <div className={styles.title}>Гарантийное обслуживание производителя</div>
          </div>
        </PopoverTrigger>
        <PopoverContent className={styles.content}>
          <p><strong>Срок гарантии на все товары 1 год</strong></p>
          <p>
            Убедительно просим вас внимательно ознакомиться с условиями гарантийных обязательств, а
            также правильно заполнять гарантийный талон. Гарантия действует, только если указаны
            модель, серийный номер, дата продажи, а также присутствуют четкая печать фирмы-продавца
            и подпись покупателя.
          </p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <div className={styles.item}>
            <div className={styles.icon}>
              <svg viewBox="0 0 21 23" width="21" height="23">
                <use href="/sprite.svg#certificate"></use>
              </svg>
            </div>
            <div className={styles.title}>Гарантия подлинности товара</div>
          </div>
        </PopoverTrigger>
        <PopoverContent className={styles.content}>
          <p><strong>Гарантия подлинности</strong></p>
          <p>
            Убедительно просим вас внимательно ознакомиться с условиями гарантийных обязательств, а
            также правильно заполнять гарантийный талон. Гарантия действует, только если указаны
            модель, серийный номер, дата продажи, а также присутствуют четкая печать фирмы-продавца
            и подпись покупателя.
          </p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <div className={styles.item}>
            <div className={styles.icon}>
              <svg viewBox="0 0 21 23" width="21" height="23">
                <use href="/sprite.svg#refund"></use>
              </svg>
            </div>
            <div className={styles.title}>100% гарантия возврата или обмена</div>
          </div>
        </PopoverTrigger>
        <PopoverContent className={styles.content}>
          <p><strong>Гарантия возврата</strong></p>
          <p>
            Убедительно просим вас внимательно ознакомиться с условиями гарантийных обязательств, а
            также правильно заполнять гарантийный талон. Гарантия действует, только если указаны
            модель, серийный номер, дата продажи, а также присутствуют четкая печать фирмы-продавца
            и подпись покупателя.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  )
}
