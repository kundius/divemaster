import { BrandsCreatePage } from '@/components/admin/BrandsCreatePage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить бренд'
}

export default function Page() {
  return <BrandsCreatePage />
}
