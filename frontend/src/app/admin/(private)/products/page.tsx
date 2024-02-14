import { ProductsPage } from '@/components/admin/ProductsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Товары - Divemaster'
}

export default function Page() {
  return <ProductsPage />
}
