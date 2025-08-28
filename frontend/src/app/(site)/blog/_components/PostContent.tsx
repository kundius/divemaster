import css from './PostContent.module.css'

export interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  return <div className={css.content} dangerouslySetInnerHTML={{ __html: content }} />
}
