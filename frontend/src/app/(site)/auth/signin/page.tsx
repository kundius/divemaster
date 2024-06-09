import { SignInPage } from '@/components/site/auth/SignInPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход'
}

export default function Page() {
  return <SignInPage />
}
