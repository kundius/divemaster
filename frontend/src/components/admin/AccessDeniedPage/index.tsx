import styles from './styles.module.scss'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AccessDeniedPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header} />
      <div className={styles.body}>
        <div className={styles.title}>Аутентификация</div>
        <div>У вас нет доступа к данной странице.</div>
        <Link href="/admin/auth/login" passHref key="signin">
          <div className={styles.submit}>
            <Button>Вход</Button>
          </div>
        </Link>
      </div>
      <div className={styles.footer} />
    </div>
  )
}
