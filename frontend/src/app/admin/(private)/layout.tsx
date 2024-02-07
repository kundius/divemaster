import { AccessDeniedPage } from '@/components/admin/AccessDeniedPage'
import { HasScope } from '@/components/HasScope'
import { PrivateLayout } from '@/components/admin/PrivateLayout'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <HasScope fallback={<AccessDeniedPage />} scopes="admin">
      <PrivateLayout>{children}</PrivateLayout>
    </HasScope>
  )
}
