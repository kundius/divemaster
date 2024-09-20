import { PropsWithChildren } from 'react'

import { HasScope } from '@/lib/HasScope'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <HasScope fallback={'Access Denied for scope "blog"'} scopes="admin">
      {children}
    </HasScope>
  )
}
