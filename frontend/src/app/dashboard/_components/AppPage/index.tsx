import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { PropsWithChildren, ReactNode } from 'react'

export function AppPage({ children }: PropsWithChildren) {
  return <SidebarInset>{children}</SidebarInset>
}

export function AppPageHeader({ children }: PropsWithChildren) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 size-8" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <div className="flex items-center justify-between gap-2 grow">{children}</div>
      </div>
    </header>
  )
}

export function AppPageTitle({ children }: PropsWithChildren) {
  return <h1 className="text-base font-medium lg:text-lg">{children}</h1>
}

export function AppPageActions({ children }: PropsWithChildren) {
  return <div className="flex items-center gap-2">{children}</div>
}

export function AppPageContent({ children }: PropsWithChildren) {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">{children}</div>
  )
}
