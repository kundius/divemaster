import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import i18n from '../i18n'
// import { match } from '@formatjs/intl-localematcher'
// import Negotiator from 'negotiator'

export function middleware(request: NextRequest) {
  // TODO: добавить определение языка
  // const headers = { 'accept-language': 'en-US,en;q=0.5' }
  // const languages = new Negotiator({ headers }).languages()
  // const locale = match(languages, i18n.locales, i18n.defaultLocale)
  let locale = request.cookies.get('x-next-locale')?.value || i18n.defaultLocale

  request.nextUrl.searchParams.set('lang', locale)

  return NextResponse.rewrite(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next).*)']
}
