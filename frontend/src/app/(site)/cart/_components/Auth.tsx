'use client'

import { useAuthStore } from '@/providers/auth-store-provider'
import styles from './Auth.module.scss'

export function Auth() {
  const loginDialogToggle = useAuthStore((state) => state.loginDialogToggle)
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Покупайте выгодно!</div>
      <div className={styles.desc}>
        Не забудьте авторизоваться для увеличения персональной скидки и её использования в&nbsp;этом
        заказе.
      </div>
      <div className={styles.authorize}>
        <button onClick={() => loginDialogToggle(true)} className={styles.authorizeButton}>
          Авторизоваться
        </button>
      </div>
    </div>
  )
}
