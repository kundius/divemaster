import Image from 'next/image'
import styles from './index.module.scss'
import { cn } from '@/lib/utils'
import { Discount } from './Discount'
import { Guest } from './Guest'

export interface CategoryContentProps {
  title?: string
  content?: string
}

const pageBreakHtml =
  '<div class="page-break" style="page-break-after:always;"><span style="display:none;">&nbsp;</span></div>'

const parseContent = (content?: string): string[] => {
  if (!content) return []
  return content.split(pageBreakHtml)
}

export function CategoryContent({ title, content }: CategoryContentProps) {
  const renderContent = () => {
    const parsedContent = parseContent(content)

    if (parsedContent.length === 2) {
      return (
        <div className={styles.grid}>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: parsedContent[0] }} />
          <Discount />
          <Guest />
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: parsedContent[1] }} />
        </div>
      )
    }

    if (parsedContent.length === 1) {
      return (
        <div className={styles.grid}>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: parsedContent[0] }} />
          <Guest />
        </div>
      )
    }
    return (
      <div className={styles.grid}>
        <Guest />
        <Discount />
      </div>
    )
  }
  if (!content && !title) return null
  return (
    <div className={styles.wrapper}>
      {title && <div className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />}
      {renderContent()}
      <div className={styles.questions}>
        <div className={styles.questionsTitle}>Остались вопросы?</div>
        <div className={styles.questionsContent}>
          Позвоните нам по телефону +7 (906) 586-55-55 или напишите
          <br />
          на <a href="mailto:info@divemaster.pro">info@divemaster.pro</a>
        </div>
      </div>
    </div>
  )
}
