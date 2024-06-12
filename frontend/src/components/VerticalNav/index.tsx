'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'

export interface VerticalNavItem {
  title: string
  href?: string
}

export interface VerticalNavProps {
  items: VerticalNavItem[]
}

export function VerticalNav({ items }: VerticalNavProps) {
  const pathname = usePathname()

  const renderButton = (item: VerticalNavItem) => {
    let button = (
      <Button
        type="button"
        className="w-full justify-start"
        disabled={!item.href}
        variant={pathname === item.href ? 'secondary' : 'ghost'}
      >
        {item.title}
      </Button>
    )
    if (!!item.href) {
      button = <Link href={item.href}>{button}</Link>
    }
    return button
  }

  return (
    <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-2">
      {items.map((item, i) => (
        <div key={i}>{renderButton(item)}</div>
      ))}
    </nav>
  )
}
