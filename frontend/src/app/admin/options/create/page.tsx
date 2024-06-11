import { CategoriesAddPage } from '@/components/admin/CategoriesAddPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить параметр'
}

export default function Page() {
  return <CategoriesAddPage />
}
