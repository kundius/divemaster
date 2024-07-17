import React from 'react'

import { AccessDeniedPage } from '@/components/admin/AccessDeniedPage'
import { PrivateLayout } from '@/components/admin/PrivateLayout'
import { HasScope } from '@/lib/HasScope'
import { enableAuthPreload } from '@/providers/auth-server-provider'

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  enableAuthPreload()
  return (
    <HasScope fallback={<AccessDeniedPage />} scopes="admin">
      <PrivateLayout>{children}</PrivateLayout>
    </HasScope>
  )
}
