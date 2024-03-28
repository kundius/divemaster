import { HasScope } from '@/components/HasScope'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <HasScope fallback={'Access Denied'} scopes="products">
      {children}
    </HasScope>
  )
}
