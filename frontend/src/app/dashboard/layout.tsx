import { PropsWithChildren } from 'react'

import { HasScope } from '@/lib/HasScope'

import { AccessDenied } from './_components/AccessDenied'
import { DashboardLayout } from './_components/DashboardLayout'

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <HasScope fallback={<AccessDenied />} scopes="admin">
      <DashboardLayout>{children}</DashboardLayout>
    </HasScope>
  )
}
