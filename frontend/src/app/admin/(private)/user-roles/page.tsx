import { TablePage } from '@/components/admin/TablePage'
import { formatTags, paramsFromObject } from '@/components/admin/TablePage/utils'
import { PageProps, VespUserRole } from '@/types'
import type { Metadata } from 'next'
import { list } from './actions'

export const metadata: Metadata = {
  title: 'Доступы'
}

export default async function Page(props: PageProps) {
  const initialData = await list(paramsFromObject(props.searchParams))
  return (
    <TablePage<VespUserRole>
      title={`${metadata.title}`}
      sectionPath="/admin/user-roles"
      idKey="id"
      action={list}
      initialData={initialData}
      columns={[
        { key: 'id', label: 'ID', sortable: true },
        { key: 'title', label: 'Название', sortable: true },
        { key: 'scope', label: 'Разрешения', formatter: formatTags }
      ]}
    />
  )
}
