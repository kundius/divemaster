// import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
// import {
//   CategoryForm,
//   CategoryFormFields,
//   CategoryFormSchema
// } from '@/components/admin/CategoryForm'
// import { VespForm } from '@/components/vesp/VespForm'
// import { VespFormCancel } from '@/components/vesp/VespFormCancel'
// import { VespFormSubmit } from '@/components/vesp/VespFormSubmit'
// import type { Metadata } from 'next'
// import { VespCategory } from '@/types'

// export const metadata: Metadata = {
//   title: 'Добавить категорию'
// }

// export default function Page() {
//   const url = 'admin/categories'
//   const actions: PageHeaderProps['actions'] = [
//     <VespFormCancel key="back" />,
//     <VespFormSubmit key="submit" />
//   ]

//   return (
//     <VespForm<CategoryFormFields>
//       url={url}
//       method="PUT"
//       redirect="table"
//       schema={CategoryFormSchema}
//       defaultValues={{
//         id: 0,
//         title: '',
//         description: '',
//         alias: '',
//         active: true
//       }}
//     >
//       <PageHeader title={`${metadata.title}`} actions={actions} />
//       <CategoryForm />
//     </VespForm>
//   )
// }
import { CategoriesAddPage } from '@/components/admin/CategoriesAddPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить категорию'
}

export default function Page() {
  return <CategoriesAddPage />
}
