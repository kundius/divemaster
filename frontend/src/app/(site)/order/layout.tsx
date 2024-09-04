import { PropsWithChildren } from 'react'

import { OrderStoreProvider } from '@/providers/order-store-provider'

export default function Layout({ children }: PropsWithChildren) {
  return <OrderStoreProvider>{children}</OrderStoreProvider>
}
