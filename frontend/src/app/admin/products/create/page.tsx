import { ProductsCreatePage } from '@/components/admin/ProductsCreatePage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить товар'
}

export default function Page() {
  return <ProductsCreatePage />
}
