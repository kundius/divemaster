import { PropsWithChildren } from 'react'
import { OfficeLayout } from './_components/OfficeLayout'

export default function Layout({ children }: PropsWithChildren) {
  return <OfficeLayout>{children}</OfficeLayout>
}
