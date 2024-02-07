'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth'
import { getApiUrl } from '@/lib/utils'

export function User() {
  const { user } = useAuth()

  // console.log(getApiUrl())

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="px-2 py-1.5 text-sm font-normal min-w-40">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">shadcn</p>
            <p className="text-xs leading-none text-muted-foreground">m@example.com</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Профиль</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Выход</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
