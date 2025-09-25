import type { Metadata } from 'next'
import {
  AppPage,
  AppPageActions,
  AppPageContent,
  AppPageHeader,
  AppPageTitle
} from '../_components/AppPage'
import { TasksProvider } from './_components/TasksProvider'
import { TasksTable } from './_components/TasksTable'
import { Upload } from './_components/Upload'

export const metadata: Metadata = {
  title: 'Синхронизация'
}

export default async function Page() {
  return (
    <TasksProvider>
      <AppPage>
        <AppPageHeader>
          <AppPageTitle>Синхронизация</AppPageTitle>
          <AppPageActions>
            <Upload />
          </AppPageActions>
        </AppPageHeader>
        <AppPageContent>
          <TasksTable />
        </AppPageContent>
      </AppPage>
    </TasksProvider>
  )
}
