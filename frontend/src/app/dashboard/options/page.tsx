import { PageLayout } from '@/components/admin/PageLayout'
import { Button } from '@/components/ui/button'
import { DEFAULT_LIMIT } from '@/lib/ApiTable/constants'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { OptionEntity, PageProps } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { OptionTable } from './_components/OptionTable'

export const metadata: Metadata = {
  title: 'Характеристики'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<ApiTableData<OptionEntity>>(
    'options',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withServerAuth()
  )

  return (
    <PageLayout
      title="Характеристики"
      actions={
        <Link href="/admin/options/create">
          <Button>Добавить параметр</Button>
        </Link>
      }
    >
      <OptionTable initialData={initialData} />
    </PageLayout>
  )
}
