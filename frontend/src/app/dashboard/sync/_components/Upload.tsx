'use client'

import { Button, ButtonLoadingIcon } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { useTasks } from './TasksProvider'
import { apiPost } from '@/lib/api'

export function Upload() {
  const { refetch } = useTasks()

  const [isPending, setIsPending] = useState(false)

  const url = `sync/task`

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
      return await apiPost<string>(url, body)
    }
    setIsPending(true)
    try {
      for (const file of nativeFiles) {
        await asyncLoad(file)
      }
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
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
