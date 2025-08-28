'use client'

import { DataTable, DataTableColumn } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { cn } from '@/lib/utils'
import { SyncTaskEntity, SyncTaskStatus } from '@/types'
import { TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { TasksFilterType, useTasks } from './TasksProvider'

export function TasksTable() {
  const { data = { rows: [], total: 0 }, refetch, ...tasks } = useTasks()

  const renderStatus = (status: SyncTaskStatus, record: SyncTaskEntity) => {
    switch (status) {
      case SyncTaskStatus.SYNCHRONIZATION:
        return (
          <Badge variant="secondary" className="bg-blue-100 hover:bg-blue-200 text-blue-600">
            Синхронизация
          </Badge>
        )
      case SyncTaskStatus.INITIALIZATION:
        return (
          <Badge variant="secondary" className="">
            Инициализация
          </Badge>
        )
      case SyncTaskStatus.CANCELLED:
        return (
          <Badge variant="secondary" className="bg-orange-100 hover:bg-orange-200 text-orange-600">
            Отменено
          </Badge>
        )
      case SyncTaskStatus.ERROR:
        return (
          <Badge variant="secondary" className="bg-red-100 hover:bg-red-200 text-red-600">
            Ошибка
          </Badge>
        )
      case SyncTaskStatus.SUCCESS:
        return (
          <Badge variant="secondary" className="bg-green-100 hover:bg-green-200 text-green-600">
            Выполнено
          </Badge>
        )
      case SyncTaskStatus.SUSPENDED:
        return (
          <Badge variant="secondary" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-600">
            Приостановлено
          </Badge>
        )
    }
  }

  const renderProgress = (total: number, record: SyncTaskEntity) => {
    const percent = total ? Math.round(100 - ((total - record.offset) / total) * 100) : 0
    return (
      <div className="w-40 flex" key={record.id}>
        <div
          className={cn(
            `progress-background relative overflow-hidden rounded border border-transparent bg-slate-100 w-full flex items-center justify-center`,
            {
              'animate-stripe-move': record.status === SyncTaskStatus.SYNCHRONIZATION,
              'bg-[linear-gradient(135deg,var(--color-slate-200)_25%,transparent_25%,transparent_50%,var(--color-slate-200)_50%,var(--color-slate-200)_75%,transparent_75%,transparent)] bg-[length:24px_24px]':
                [SyncTaskStatus.SYNCHRONIZATION, SyncTaskStatus.SUSPENDED].includes(record.status)
            }
          )}
        >
          <div
            className="absolute h-full w-full bg-slate-300 transition-all z-10"
            style={{ transform: `translateX(-${100 - percent}%)` }}
          />
          {record.status === SyncTaskStatus.ERROR ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-slate-600 px-2.5 py-0.5 text-xs font-semibold">
                    {record.statusMessage}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{record.statusMessage}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <>
              <div className="relative z-20 text-slate-600 px-2.5 py-0.5 text-xs font-semibold">
                {record.offset} из {total}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  const columns: DataTableColumn<SyncTaskEntity>[] = [
    {
      key: 'status',
      headProps: {
        className: 'w-1/3'
      },
      label: 'Статус',
      sortable: true,
      formatter: renderStatus
    },
    {
      key: 'total',
      headProps: {
        className: 'w-1/3'
      },
      label: 'Прогресс',
      formatter: renderProgress
    },
    {
      key: 'createdAt',
      label: 'Дата',
      sortable: true,
      headProps: {
        className: 'w-1/3 whitespace-nowrap'
      },
      formatter: (createdAt) => format(createdAt, 'dd MMMM, HH:mm')
    },
    {
      key: 'id',
      headProps: {
        className: 'w-0'
      },
      formatter: (id) => (
        <div className="flex gap-2">
          <ApiRemoveDialog url={`sync/task/${id}`} onSuccess={refetch}>
            <Button variant="outline-destructive" size="icon">
              <TrashIcon className="w-4 h-4" />
            </Button>
          </ApiRemoveDialog>
        </div>
      )
    }
  ]

  return (
    <DataTable<SyncTaskEntity, TasksFilterType>
      data={data.rows}
      total={data.total}
      columns={columns}
      {...tasks}
    />
  )
}
