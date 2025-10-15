'use client'

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import useSWR from 'swr'
import { DataTable, DataTableColumn, DataTableFilterField } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { clearEmpty, getFileUrl } from '@/lib/utils'
import { BlogPostEntity, BlogTagEntity, FindAllResult } from '@/types'
import { BlogPostStatusColors, BlogPostStatusIcons, BlogPostStatusLabels } from '../data'

export interface BlogPostListProps {
  fallbackData?: FindAllResult<BlogPostEntity>
}

export function BlogPostList({ fallbackData }: BlogPostListProps) {
  const tagsQuery = useSWR<FindAllResult<BlogTagEntity>>([`blog/tag`, { limit: 100 }])

  const [pagination, setPagination] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10)
    },
    {
      clearOnDefault: true
    }
  )

  const [sorting, setSorting] = useQueryStates({
    sort: parseAsString,
    dir: parseAsString
  })

  const [filter, setFilter] = useQueryStates({
    query: parseAsString,
    tags: parseAsArrayOf(parseAsString)
  })

  const { data, isLoading, mutate } = useSWR<FindAllResult<BlogPostEntity>>(
    [
      `blog/post`,
      {
        ...pagination,
        ...clearEmpty(sorting),
        ...clearEmpty(filter)
      }
    ],
    {
      fallbackData,
      keepPreviousData: true
    }
  )

  const refetch = () => mutate(data, { revalidate: true })

  const columns: DataTableColumn<BlogPostEntity>[] = [
    {
      dataIndex: 'title',
      label: 'Пост',
      sortable: true,
      formatter: (title, record) => {
        return (
          <div className="flex gap-3 items-center">
            {record.image && (
              <div className="flex w-12 h-12 relative self-start">
                <Image
                  src={getFileUrl(record.image)}
                  fill
                  alt=""
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="space-y-1">
              <div className="text-balance">{title}</div>
              {record.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {record.tags.map((blogTag) => (
                    <Badge variant="outline" key={blogTag.id}>
                      {blogTag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      }
    },
    {
      dataIndex: 'status',
      label: 'Статус',
      sortable: true,
      headProps: {
        className: 'w-36'
      },
      formatter: (status) => {
        const label = BlogPostStatusLabels[status]
        const color = BlogPostStatusColors[status]
        const Icon = BlogPostStatusIcons[status]
        return (
          <div className="flex gap-1.5 items-center text-neutral-700 text-sm">
            <Icon className={`w-5 h-5 -mt-1 ${color}`} /> {label}
          </div>
        )
      }
    },
    {
      dataIndex: 'id',
      headProps: {
        className: 'w-0'
      },
      formatter: (id) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/blog/${id}`}>
            <Button variant="outline" size="icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <ApiRemoveDialog url={`blog/post/${id}`} onSuccess={refetch}>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              size="icon"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </ApiRemoveDialog>
        </div>
      )
    }
  ]

  const filters: DataTableFilterField[] = [
    {
      name: 'query',
      type: 'search',
      placeholder: 'Поиск по названию'
    },
    {
      name: 'tags',
      type: 'faceted',
      options: (tagsQuery.data?.rows || []).map((item) => ({ label: item.name, value: item.name })),
      title: 'Теги'
    }
  ]

  const { rows, total } = data || { rows: [], total: 0 }

  return (
    <DataTable<BlogPostEntity, typeof filter>
      data={rows}
      total={total}
      isLoading={isLoading}
      columns={columns}
      filters={filters}
      filter={filter}
      setFilter={setFilter}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
    />
  )
}
