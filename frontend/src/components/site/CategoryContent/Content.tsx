import styles from './Content.module.scss'

export interface ContentProps {
  content: string
}

export function Content({ content }: ContentProps) {
  return <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
}
