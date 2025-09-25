import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { SubNav } from '../../_components/SubNav'
import { PropertyCreateForm } from '../_components/PropertyCreateForm'

export const metadata: Metadata = {
  title: 'Добавить характеристику'
}

export default function Page() {
  const nav = [
    {
      title: 'Свойства',
      url: `/dashboard/properties/create`
    },
    {
      title: 'Категории',
      url: '#',
      disabled: true
    }
  ]
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Добавить характеристику</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <SubNav items={nav} />
        <PropertyCreateForm />
      </AppPageContent>
    </AppPage>
  )
}
