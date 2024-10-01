import Image from 'next/image'
import styles from './CarpHunting.module.scss'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export function CarpHunting() {
  return (
    <div className={styles.root}>
      <div className={styles.bg} data-parallax={''}>
        <Image
          src="/hero/CarpHunting/bg.jpg"
          width={2000}
          height={850}
          loading="eager"
          alt=""
          sizes="100vw"
          quality={90}
        />
      </div>
      <div className={styles.content}>
        <Link href="/category/vsyo-dlya-podvodnoj-ohoty" className={styles.label}>
          Всё для подводной охоты
        </Link>
        <div className={styles.title}>Охота на&nbsp;карпа</div>
        <div className={styles.links}>
          <Link href="/category/vsyo-dlya-podvodnoj-ohoty-ruzhya-pnevmaty">
            пневматические подводные ружья
          </Link>
          <Link href="/category/vsyo-dlya-podvodnoj-ohoty-aksessuary-dlya-podvodnoj-ohoty">
            аксессуары
          </Link>
        </div>
        <Dialog>
          <DialogTrigger className={styles.button}>смотреть видео</DialogTrigger>
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Охота на&nbsp;карпа</DialogTitle>
              <DialogDescription>
                <video width="100%" height="500" controls autoPlay>
                  <source src="/Карп 7200.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                  Тег video не поддерживается вашим браузером.
                </video>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
