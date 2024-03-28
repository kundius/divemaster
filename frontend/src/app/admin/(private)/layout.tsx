import { AccessDeniedPage } from '@/components/admin/AccessDeniedPage'
import { HasScope } from '@/components/HasScope'
import { PrivateLayout } from '@/components/admin/PrivateLayout'
import { enableAuthPreload } from '@/lib/auth/auth-preload'
import React from "react";

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
