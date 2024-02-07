import { AuthLayout } from '@/components/admin/AuthLayout'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthLayout>{children}</AuthLayout>
}
