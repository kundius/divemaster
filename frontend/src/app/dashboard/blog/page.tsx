import { PageLayout } from '@/components/admin/PageLayout'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { BlogPostEntity, FindAllResult, PageProps, ProductEntity } from '@/types'
import type { Metadata } from 'next'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table'
import { CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { revalidate } from './actions'
import { StaticPagination } from '../_components/StaticPagination'
import { BlogPostList } from './_components/BlogPostList'

export const metadata: Metadata = {
  title: 'Блог'
}

export default async function Page(props: PageProps) {
  const { page = 1, limit = 10 } = props.searchParams

  const data = await apiGet<FindAllResult<BlogPostEntity>>(
    'blog/post',
    {
      limit: +limit,
      page: +page
    },
    withServerAuth()
  )

  const actions = [
    <Button asChild key="create">
      <Link href="/dashboard/blog/create">Добавить запись</Link>
    </Button>
  ]

  return (
    <PageLayout title="Блог" actions={actions}>
      <BlogPostList initialData={data} />
      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Активен</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((row, i) => (
            <TableRow key={row.id}>
              <TableCell>
                <div className="text-balance">{row.title}</div>
              </TableCell>
              <TableCell className="w-0">
                {row.active ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-500 m-auto" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-amber-500 m-auto" />
                )}
              </TableCell>
              <TableCell className="w-0">
                <div className="flex gap-2">
                  <Link href={`/dashboard/blog/${row.id}`}>
                    <Button variant="outline" size="sm-icon">
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                  <ApiRemoveDialog url={`blog/post/${row.id}`} onSuccess={revalidate}>
                    <Button variant="destructive-outline" size="sm-icon">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </ApiRemoveDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="border-t pt-2 flex justify-end">
        <StaticPagination
          page={+page}
          limit={+limit}
          total={data.total}
        />
      </div> */}
    </PageLayout>
  )
}
