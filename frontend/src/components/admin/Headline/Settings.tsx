'use client'

import { Button } from '@/components/ui/button'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'

export function Settings() {
  return (
    <Button variant="ghost" size="icon">
      <Cog6ToothIcon className="h-6 w-6" />
    </Button>
  )
}
