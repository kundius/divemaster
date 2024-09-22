'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/providers/auth-store-provider'
import Link from 'next/link'
import styles from './User.module.scss'

export function User() {
  const { user, logout } = useAuthStore((state) => state)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={styles.button}>
          <Avatar className='rounded-md'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{user?.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 max-lg:hidden">
            <p className="text-sm font-medium leading-none text-neutral-100">{user?.name}</p>
            <p className="text-xs leading-none text-neutral-200">{user?.email}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[232px]">
        <Link href="/dashboard/profile">
          <DropdownMenuItem>Профиль</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Выход</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
