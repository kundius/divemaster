import { HasScope } from '@/lib/HasScope'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <HasScope fallback={'Access Denied'} scopes="orders">
      {children}
    </HasScope>
  )
}
