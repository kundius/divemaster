import { HasScope } from '@/components/HasScope'
import { AccessDeniedPage } from '@/components/admin/AccessDeniedPage'
import { CategoriesPage } from '@/components/admin/CategoriesPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Категории'
}

export default function Page() {
  return (
    <HasScope fallback={<AccessDeniedPage />} scopes="products">
      <CategoriesPage />
    </HasScope>
  )
}
