import { HasScope } from '@/lib/HasScope'
import { PropsWithChildren } from 'react'
import { AccessDenied } from './_components/AccessDenied'
import { AppLayout } from './_components/AppLayout'

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <HasScope fallback={<AccessDenied />} scopes="admin">
      <AppLayout>{children}</AppLayout>
    </HasScope>
  )
}
