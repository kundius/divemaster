// import {
//   CategoryForm,
//   CategoryFormFields,
//   CategoryFormSchema,
//   CategoryFormMapValues
// } from '@/components/admin/CategoryForm'
// import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
// import { VespForm } from '@/components/vesp/VespForm'
// import { VespFormCancel } from '@/components/vesp/VespFormCancel'
// import { VespFormSubmit } from '@/components/vesp/VespFormSubmit'
// import { apiGet } from '@/lib/api'
// import { withAuth } from '@/lib/api/with-auth'
// import { VespCategory } from '@/types'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Редактировать категорию'
// }

// export default async function Page({ params }: { params: { id: number } }) {
//   const url = 'admin/categories'
//   const data = await apiGet<VespCategory>(url, params, withAuth())

//   const actions: PageHeaderProps['actions'] = [
//     <VespFormCancel key="back" />,
//     <VespFormSubmit key="submit" />
//   ]

//   return (
//     <VespForm<CategoryFormFields>
//       url={url}
//       method="PATCH"
//       redirect={false}
//       schema={CategoryFormSchema}
//       mapValues={CategoryFormMapValues}
//       defaultValues={{
//         id: data.id,
//         active: data.active,
//         description: data.description || '',
//         title: data.title,
//         alias: data.alias
//       }}
//     >
//       <PageHeader title={`${metadata.title}`} actions={actions} />
//       <CategoryForm />
//     </VespForm>
//   )
// }
import { CategoriesEditPage } from '@/components/admin/CategoriesEditPage'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { VespCategory } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать категорию'
}

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<VespCategory>(`admin/categories/${params.id}`, {}, withAuth())
  return <CategoriesEditPage initialData={initialData} />
}
