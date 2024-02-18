import { TablePage, TablePageFields } from '@/components/admin/TablePage'
import { PageProps, VespUserRole } from '@/types'
import type { Metadata } from 'next'
import { list } from './actions'

export const metadata: Metadata = {
  title: 'Доступы'
}

export default async function Page(props: PageProps) {
  const defaultFields: TablePageFields = {
    limit: 2,
    page: 1
  }
  const fields: TablePageFields = { ...defaultFields }
  if ('limit' in props.searchParams) {
    fields.limit = Number(props.searchParams.limit)
  }
  if ('page' in props.searchParams) {
    fields.page = Number(props.searchParams.page)
  }
  const initialData = await list(fields)
  return (
    <TablePage<VespUserRole>
      idKey="id"
      action={list}
      initialData={initialData}
      defaultFields={defaultFields}
    />
  )
}
