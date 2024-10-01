import css from './PostContent.module.scss'

export interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  return <div className={css.content} dangerouslySetInnerHTML={{ __html: content }} />
}
