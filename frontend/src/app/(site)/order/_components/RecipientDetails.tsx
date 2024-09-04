import css from './RecipientDetails.module.scss'

export function RecipientDetails() {
  return (
    <div>
      <div className={css.title}>Данные получателя</div>
      <div className={css.description}>
        Выберите способ получения и вы сможете ввести контактные данные
      </div>
    </div>
  )
}
