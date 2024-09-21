'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Navigation } from '../Navigation'

export function NavDrawer() {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="flex text-white w-10 h-10">
          <Bars3BottomLeftIcon className="w-8 h-8" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Navigation variant="dark" />
      </DrawerContent>
    </Drawer>
  )
}
