import { SidebarProvider } from '@/components/ui/sidebar'
import { PropsWithChildren } from 'react'
import { AppSidebar } from '../AppSidebar'

export async function AppLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 14)'
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      {children}
    </SidebarProvider>
  )
}
