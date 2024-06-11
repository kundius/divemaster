import { Button } from '@/components/ui/button'
import { HasScope } from '@/lib/HasScope'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
      <aside className="-mx-4 md:w-1/5">
        <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <div>
            <Link className="block" href={'/admin/options'}>
              <Button
                type="button"
                className="w-full justify-start"
                // disabled={!item.href}
                variant="ghost"
              >
                Свойства
              </Button>
            </Link>
          </div>
          <div>
            <Link className="block" href={'/admin/options'}>
              <Button
                type="button"
                className="w-full justify-start"
                // disabled={!item.href}
                variant="ghost"
              >
                Категории
              </Button>
            </Link>
          </div>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  )
}
