'use client'

import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { setCookie } from 'cookies-next'
// import setLanguage from 'next-translate/setLanguage'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'
// const locales = ['en', 'ru']

export function Footer() {
  const { t, lang } = useTranslation()
  const router = useRouter()

  // const changeLanguage = locales.map((lng) => {
  //   // if (lng === lang) return null

  //   // return (
  //   //   <button key={lng} onClick={async () => await setLanguage(lng)}>
  //   //     {lng}
  //   //   </button>
  //   // )

  //   return (
  //     <Link href="/" locale={lng} key={lng}>
  //       {t(`layout:language-name-${lng}`)}
  //     </Link>
  //   )
  // })
  const onLangChange = (v: string) => {
    setCookie('x-next-locale', v, { path: '/' })
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between px-3 h-16 gap-4 lg:px-8">
      <div />
      <div className="flex">
        <Select onValueChange={onLangChange} defaultValue={lang}>
          <SelectTrigger className="w-[148px]">
            <SelectValue placeholder="Выбрать язык" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ru">Russian</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
