import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import type { Metadata } from 'next'
import { TasksProvider } from './_components/TasksProvider'
import { TasksTable } from './_components/TasksTable'
import { Upload } from './_components/Upload'

export const metadata: Metadata = {
  title: 'Синхронизация'
}

export default async function Page() {
  const actions = [<Upload key="create" />]
  return (
    <TasksProvider>
      <PageLayout title="Синхронизация" actions={actions}>
        <TasksTable />
      </PageLayout>
    </TasksProvider>
  )
}
