import Image from 'next/image'
import styles from './Default.module.css'
import { AuthButton } from './AuthButton'
import { ReactNode } from 'react'

interface DefaultProps {
  background?: ReactNode
  action?: ReactNode
  title?: ReactNode
  description?: ReactNode
}

export function Default({ title, description, background, action }: DefaultProps) {
  return (
    <div className={styles.root}>
      {background && (
        <div className={styles.bg} data-parallax={''}>
          {background}
        </div>
      )}
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {description && <div className={styles.desc}>{description}</div>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  )
}
