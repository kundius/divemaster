import styles from './styles.module.scss'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '../AuthLayout'

export function AccessDeniedPage() {
  return (
    <AuthLayout>
      <div className={styles.title}>Аутентификация</div>
      <div className={styles.desc}>У вас нет доступа к данной странице.</div>
      <Link href="/auth/signin" passHref key="signin">
        <div className={styles.submit}>
          <Button>Вход</Button>
        </div>
      </Link>
    </AuthLayout>
  )
}
