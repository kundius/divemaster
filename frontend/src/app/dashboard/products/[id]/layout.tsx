import { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { SubNav } from '../../_components/SubNav'

export const metadata: Metadata = {
  title: 'Редактировать товар'
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const nav = [
    {
      title: 'Свойства',
      url: `/dashboard/products/${id}`
    },
    {
      title: 'Описание',
      url: `/dashboard/products/${id}/description`
    },
    {
      title: 'Категории',
      url: `/dashboard/products/${id}/categories`
    },
    {
      title: 'Галерея',
      url: `/dashboard/products/${id}/gallery`
    },
    {
      title: 'Характеристики',
      url: `/dashboard/products/${id}/options`
    },
    // {
    //   title: 'Связи',
    //   url: `/dashboard/products/${id}/links`
    // },
    {
      title: 'Торговые предложения',
      url: `/dashboard/products/${id}/offers`
    },
    {
      title: 'Отзывы',
      url: `/dashboard/products/${id}/reviews`
    }
  ]
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Редактировать товар</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <SubNav items={nav} />
        {children}
      </AppPageContent>
    </AppPage>
  )
}
