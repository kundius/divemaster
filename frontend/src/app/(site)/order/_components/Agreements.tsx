import css from './Agreements.module.css'

export function Agreements() {
  return (
    <div className={css.wrap}>
      Нажимая кнопку «Оформить заказ» вы соглашаетесь с <a href="">пользовательским соглашением</a>,{' '}
      <a href="">политикой конфиденциальности</a>, условиями <a href="">Клубной программы</a>
    </div>
  )
}
