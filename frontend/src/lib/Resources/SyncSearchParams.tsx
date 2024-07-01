'use client'

import { shallowEqual } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ResorcesParams, useResorces } from '.'

export function ResorcesSyncParams() {
  const { params, setParams, defaultParams } = useResorces()
  const [isPersisted, setIsPersisted] = useState(false)
  const searchParams = useSearchParams()

  const parsedSearchParams = useMemo(() => {
    const output: ResorcesParams = defaultParams

    if (searchParams.has('page')) {
      output.page = Number(searchParams.get('page'))
    }

    if (searchParams.has('limit')) {
      output.limit = Number(searchParams.get('limit'))
    }

    return output
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    setIsPersisted(true)

    if (!shallowEqual(params, parsedSearchParams)) {
      setParams((prev) => ({
        ...prev,
        ...parsedSearchParams
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedSearchParams])

  useEffect(() => {
    if (!isPersisted) {
      return
    }

    if (!shallowEqual(params, parsedSearchParams)) {
      const urlParams = new URLSearchParams(searchParams.toString())

      if (params.page === defaultParams.page) {
        urlParams.delete('page')
      } else {
        urlParams.set('page', String(params.page))
      }

      if (params.limit === defaultParams.limit) {
        urlParams.delete('limit')
      } else {
        urlParams.set('limit', String(params.limit))
      }

      window.history.pushState(null, '', `?${urlParams.toString()}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return null
}
