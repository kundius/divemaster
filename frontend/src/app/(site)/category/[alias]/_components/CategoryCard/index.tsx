import Image from 'next/image'
import styles from './index.module.css'
import Link from 'next/link'

export interface CategoryCardProps {
  title: string
  href: string
  image: string
}

export function CategoryCard({ title, href, image }: CategoryCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.figure}>
        <Image src={image} alt="" width={320} height={440} className={styles.figureImage} />
      </div>
      <Link href={href} className={styles.title}>
        {title}
      </Link>
    </div>
  )
}
