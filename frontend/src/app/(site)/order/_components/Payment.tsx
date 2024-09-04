import css from './Payment.module.scss'

export function Payment() {
  return (
    <div>
      <div className={css.title}>Способ оплаты</div>
      <div className={css.description}>
        Выберите способ получения и вы сможете выбрать способ оплаты
      </div>
    </div>
  )
}
