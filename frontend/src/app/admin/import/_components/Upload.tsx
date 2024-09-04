'use client'

import { Button, ButtonLoadingIcon } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useState } from 'react'

export function Upload() {
  const [isPending, setIsPending] = useState(false)

  const url = `products/import`

  function onFileSelect() {
    const el = document.createElement('input')
    el.type = 'file'
    el.multiple = false
    el.accept = 'application/x-zip-compressed'
    el.click()
    el.addEventListener('change', (e) => {
      onAddFiles((e?.target as unknown as DataTransfer)?.files)
    })
  }

  async function onAddFiles(files?: FileList) {
    const nativeFiles: File[] = Array.from(files || [])
    if (!nativeFiles.length) {
      return
    }
    const asyncLoad = async (file: File): Promise<string> => {
      const body = new FormData()
      body.append('file', file)
      return await api<string>(url, {
        method: 'POST',
        body
      })
    }
    setIsPending(true)
    try {
      for (const file of nativeFiles) {
        if (['application/x-zip-compressed', 'application/zip'].includes(file.type)) {
          await asyncLoad(file)
        }
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button onClick={onFileSelect} disabled={isPending}>
      {isPending && <ButtonLoadingIcon />}
      Загрузить архив
    </Button>
  )
}
