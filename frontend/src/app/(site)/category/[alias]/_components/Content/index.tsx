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
    const output: JSX.Element[] = []

    if (title) {
      output.push(
        <h1 key="title" className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
      )
    }

    if (parsedContent.length === 2) {
      output.push(
        <div key="before" className={styles.grid}>
          <Description content={parsedContent[0]} />
          <Discount />
          <Guest />
          <Description content={parsedContent[1]} />
        </div>
      )
    }

    if (parsedContent.length === 1) {
      output.push(
        <div key="after" className={styles.grid}>
          <Description content={parsedContent[0]} />
          <Guest />
        </div>
      )
    }

    if (title && parsedContent.length === 0) {
      output.push(
        <div key="empty" className={styles.grid}>
          <Guest />
          <Discount />
        </div>
      )
    }

    return output
  }

  return (
    <>
      {renderContent()}
      <Questions />
    </>
  )
}
