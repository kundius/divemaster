'use client'

import { Badge } from '@/components/ui/badge'

export function Search() {
  return (
    <button className="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-3 py-2 relative h-10 w-full justify-start rounded-lg bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-16 md:w-64 lg:w-80">
      <span className="hidden lg:inline-flex">Найти что-нибудь...</span>
      <span className="inline-flex lg:hidden">Поиск...</span>
      <Badge
        variant="secondary"
        className="pointer-events-none absolute right-[0.5rem] top-[0.5rem] hidden sm:flex"
      >
        Ctrl K
      </Badge>
    </button>
  )
}
