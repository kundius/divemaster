import Image from 'next/image'
import styles from './Thumb.module.css'

export interface ThumbProps {
  url: string
  alt: string
}

export function Thumb({ url, alt }: ThumbProps) {
  return (
    <div className={styles.thumb}>
      <Image
        src={url}
        alt={alt}
        fill
        className={styles.image}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
