import { CreateProductPage } from '@/components/admin/CreateProductPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить товар'
}

export default function Page() {
  return <CreateProductPage />
}
