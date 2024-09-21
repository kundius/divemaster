'use client'

import React from 'react'
import { Search } from './Search'
import { User } from './User'
import { Settings } from './Settings'
import { Notifications } from './Notifications'
import { NavDrawer } from './NavDrawer'

export function Header() {
  return (
    <div className="flex items-center justify-between px-3 sticky h-16 gap-4 bg-neutral-50/95 backdrop-blur z-50 top-0 lg:px-8 lg:relative">
      <div className="md:w-36 lg:hidden">
        <NavDrawer />
      </div>
      <Search />
      <div className="flex items-center gap-2 md:gap-4 md:w-36">
        <Notifications />
        <Settings />
        <User />
      </div>
    </div>
  )
}
