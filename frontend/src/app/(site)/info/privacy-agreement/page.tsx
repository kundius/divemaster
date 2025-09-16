import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'
import Link from 'next/link'

export default function Page() {
  return (
    <SectionPage>
      <Headline
        className="mb-12 max-lg:mb-8 max-md:mb-6"
        title="Согласие на обработку персональных данных"
      />
      <div className="mx-auto prose lg:prose-xl">
        <p>
          Сайт использует cookie-файлы, и передает данные службе веб-аналитики Яндекс Метрика.
          Оставаясь на сайте, Вы соглашаетесь с{' '}
          <Link herf="/info/user-agreement">Пользовательским соглашением</Link> и{' '}
          <Link herf="/info/privacy-policy">Политикой обработки персональных данных</Link>
        </p>
      </div>
    </SectionPage>
  )
}
