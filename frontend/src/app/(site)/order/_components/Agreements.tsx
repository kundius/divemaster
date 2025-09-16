import css from './Agreements.module.css'
import Link from 'next/link'

export function Agreements() {
  return (
    <div className={css.wrap}>
      Прочитал(-а) и соглашаюсь с{' '}
      <Link href="/info/privacy" target="_blank">
        политикой конфиденциальности
      </Link>
      , а также даю{' '}
      <Link href="/info/agreement" target="_blank">
        Согласие
      </Link>{' '}
      на обработку своих персональных данных и подтверждаю ознакомление с{' '}
      <Link href="/info/regulation" target="_blank">
        Положением
      </Link>{' '}
      об обработке персональных данных.
    </div>
  )
}
