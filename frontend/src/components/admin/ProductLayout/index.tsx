'use client'

import { PropsWithChildren } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export interface ProductLayoutNavItem {
  title: string
  href?: string
}

export interface ProductLayoutProps {
  nav: ProductLayoutNavItem[]
}

export function ProductLayout({ children, nav }: PropsWithChildren<ProductLayoutProps>) {
  const pathname = usePathname()

  const renderButton = (item: ProductLayoutNavItem) => {
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
    <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
      <aside className="-mx-4 md:w-1/5">
        <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          {nav.map((item, i) => (
            <div key={i}>{renderButton(item)}</div>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  )
}
