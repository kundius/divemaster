import type { Metadata } from 'next'
import { CategoriesCreate } from '../_components/CategoriesCreate'
import { PageLayout } from '../../_components/PageLayout'

export const metadata: Metadata = {
  title: 'Добавить категорию'
}

export default function Page() {
  return (
    <PageLayout title="Добавить категорию">
      <CategoriesCreate />
    </PageLayout>
  )
}
