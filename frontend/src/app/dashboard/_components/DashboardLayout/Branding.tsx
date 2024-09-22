'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import styles from './Branding.module.scss'

export function Branding() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={styles.button}>
          <Avatar className="rounded-md bg-primary p-1">
            <AvatarImage src="/small-logo.png" />
            <AvatarFallback>DM</AvatarFallback>
          </Avatar>
          <p className="text-xl font-sans-narrow font-bold leading-none text-neutral-100">
            DiveMaster
          </p>
          <div className="text-neutral-50 flex ml-auto">
            <ChevronDownIcon className="w-4 h-4" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[232px]">
        <Link href="/">
          <DropdownMenuItem>Перейти на сайт</DropdownMenuItem>
        </Link>
        <Link href="/dashboard/settings">
          <DropdownMenuItem>Настройки</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
