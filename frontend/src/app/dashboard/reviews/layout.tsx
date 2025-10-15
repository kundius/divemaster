import { PropsWithChildren } from 'react'

import { HasScope } from '@/lib/HasScope'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <HasScope fallback={'Access Denied'} scopes="products">
      {children}
    </HasScope>
  )
}
