import { Description } from './Description'
import { Discount } from './Discount'
import { Guest } from './Guest'
import { Questions } from './Questions'
import styles from './index.module.scss'

export interface ContentProps {
  title?: string
  content?: string
}

const pageBreakHtml =
  '<div class="page-break" style="page-break-after:always;"><span style="display:none;">&nbsp;</span></div>'

const parseContent = (content?: string): string[] => {
  if (!content) return []
  return content.split(pageBreakHtml)
}

export function Content({ title, content }: ContentProps) {
  const renderContent = () => {
    const parsedContent = parseContent(content)

    if (parsedContent.length === 2) {
      return (
        <div className={styles.grid}>
          <Description content={parsedContent[0]} />
          <Discount />
          <Guest />
          <Description content={parsedContent[1]} />
        </div>
      )
    }

    if (parsedContent.length === 1) {
      return (
        <div className={styles.grid}>
          <Description content={parsedContent[0]} />
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
    <div className={styles.block}>
      {title && <div className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />}
      {renderContent()}
      <Questions />
    </div>
  )
}
