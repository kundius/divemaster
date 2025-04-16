'use client'

import { setDefaultOptions } from 'date-fns'
import { ru } from 'date-fns/locale'

export function DateFnsInit() {
  setDefaultOptions({ locale: ru })
  return null
}
