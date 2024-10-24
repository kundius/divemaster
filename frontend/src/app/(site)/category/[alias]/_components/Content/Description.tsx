import styles from './Description.module.scss'

export interface DescriptionProps {
  content: string
}

export function Description({ content }: DescriptionProps) {
  return <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
}
