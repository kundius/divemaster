import { Layout } from '@/components/site/Layout'
import { getStaticParams } from '@/locales/server'

export function generateStaticParams() {
  return getStaticParams()
}

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  return (
    <Layout>
      Home page
    </Layout>
  )
}
