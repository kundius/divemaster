import Link from 'next/link'
import { Container } from '../Container'
import styles from './Bottom.module.css'
import Image from 'next/image'

export function Bottom() {
  return (
    <div className={styles.root}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.copyright}>
            © 2008-2025 «ДАЙВМАСТЕР». Все&nbsp;права&nbsp;защищены
          </div>
          <div className={styles.links}>
            <Link href="/info/user-agreement">Пользовательское соглашение</Link>
            <Link href="/info/personal-data">Согласие на обработку ПД</Link>
            <Link href="/info/privacy-policy">Политика конфиденциальности</Link>
          </div>
          {/* <Link href="https://domenart-studio.ru/" target="_blank" className={styles.creator}>
            <Image src="/creator.png" width={98} height={27} alt="" />
          </Link> */}
        </div>
      </Container>
    </div>
  )
}
