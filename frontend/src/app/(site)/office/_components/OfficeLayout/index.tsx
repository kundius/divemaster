'use client'

import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'
import { HasScope } from '@/lib/HasScope'
import { PropsWithChildren, useEffect, useState } from 'react'
import { UnauthorizedFallback } from '../UnauthorizedFallback'
import { Nav } from '../Nav'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/providers/auth-store-provider'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { useMobileNavigation } from '@/components/MobileNavigation'

const guestPages: Array<string> = ['/office/favourites', '/office/comparison']
const pageTitles: Record<string, string> = {
  '/office': 'Мои данные',
  '/office/favourites': 'Избранное',
  '/office/comparison': 'Сравнение товаров',
  '/office/orders': 'Мои заказы'
}

export function OfficeLayout({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const mobileNavigation = useMobileNavigation()

  const subtitleClickHandler = () => {
    if (window.matchMedia('not all and (min-width: 768px)').matches) {
      mobileNavigation.open('office')
    }
  }

  const renderFallback = () => {
    if (guestPages.includes(pathname)) {
      return (
        <div className="max-w-7xl mx-auto">
          {pageTitles[pathname] && (
            <Headline className="mb-12 max-lg:mb-8 max-md:mb-6" title={pageTitles[pathname]} />
          )}
          {children}
        </div>
      )
    }

    return (
      <div className="max-w-7xl mx-auto">
        <Headline className="mb-8 max-lg:mb-8 max-md:mb-6" title="Личный кабинет" />
        <UnauthorizedFallback />
      </div>
    )
  }

  return (
    <SectionPage>
      <HasScope fallback={renderFallback()} scopes="profile">
        <Headline className="mb-12 max-lg:mb-8 max-md:mb-6" title="Личный кабинет" />
        <div className="flex gap-8 max-md:flex-col">
          <div
            className={cn('w-80 flex-shrink-0 max-2xl:w-72 max-xl:w-60 max-lg:w-44 max-md:hidden')}
          >
            <Nav />
          </div>
          <div className={cn('flex-grow')}>
            {pageTitles[pathname] && (
              <div
                className="flex items-center gap-2 text-2xl font-sans-narrow uppercase font-bold mb-8 max-md:py-1 max-md:border-b max-md:text-lg"
                onClick={subtitleClickHandler}
              >
                <ChevronLeftIcon className="w-4 h-4 md:hidden" />
                {pageTitles[pathname]}
              </div>
            )}
            {children}
          </div>
        </div>
      </HasScope>
    </SectionPage>
  )
}
