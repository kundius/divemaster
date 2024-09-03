'use client'

import { useAuthStore } from '@/providers/auth-store-provider'
import styles from './Authorization.module.scss'

export function Authorization() {
  const loginDialogToggle = useAuthStore((state) => state.loginDialogToggle)
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Покупайте выгодно!</div>
      <div className={styles.desc}>
        Не забудьте авторизоваться для увеличения персональной скидки и&nbsp;её&nbsp;использования
        в&nbsp;этом заказе.
      </div>
      <div className={styles.authorize}>
        <button onClick={() => loginDialogToggle(true)} className={styles.authorizeButton}>
          Авторизоваться
        </button>
      </div>
    </div>
  )
}
