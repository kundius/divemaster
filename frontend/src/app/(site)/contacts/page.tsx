import { getStaticParams } from '@/locales/server'

export function generateStaticParams() {
  return getStaticParams()
}

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  return (
    <>
      Contacts
    </>
  )
}
