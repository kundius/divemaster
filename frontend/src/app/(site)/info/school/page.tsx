import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'

export default function Page() {
  return (
    <SectionPage>
      <Headline
        className="mb-12 max-lg:mb-8 max-md:mb-6"
        title="Школа подводной охоты и дайвинга"
      />
      <div className="mx-auto prose lg:prose-xl">
        <p></p>
      </div>
    </SectionPage>
  )
}
