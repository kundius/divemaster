import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'
import Script from 'next/script'

export default function Page() {
  return (
    <SectionPage>
      <Headline className="mb-12 max-lg:mb-8 max-md:mb-6" title="Доставка" />
      <div className="mx-auto prose lg:prose-xl">
        <h2>Доставка ТК &ldquo;СДЭК&rdquo;</h2>
      </div>
    </SectionPage>
  )
}
