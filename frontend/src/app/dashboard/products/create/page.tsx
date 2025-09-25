import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { SubNav } from '../../_components/SubNav'
import { ProductCreate } from '../_components/ProductCreate'

export const metadata: Metadata = {
  title: 'Добавить товар'
}

export default function Page() {
  const nav = [
    {
      title: 'Свойства',
      url: `/dashboard/products/create`
    },
    {
      title: 'Описание',
      url: '#',
      disabled: true
    },
    {
      title: 'Категории',
      url: '#',
      disabled: true
    },
    {
      title: 'Галерея',
      url: '#',
      disabled: true
    },
    {
      title: 'Характеристики',
      url: '#',
      disabled: true
    },
    {
      title: 'Отзывы',
      url: '#',
      disabled: true
    },
    {
      title: 'Связи',
      url: '#',
      disabled: true
    }
  ]
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Добавить товар</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <SubNav items={nav} />
        <ProductCreate />
      </AppPageContent>
    </AppPage>
  )
}
