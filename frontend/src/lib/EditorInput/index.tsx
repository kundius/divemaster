'use client'

import { useEffect, useRef } from 'react'
import { getCookie } from 'cookies-next'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

import { TOKEN_NAME } from '@/constants'
import styles from './styles.module.css'
import { UploadAdapter } from './UploadAdapter.mjs'

export interface EditorInputProps {
  placeholder?: string
  value?: string
  onChange?: (value?: string) => void
}

export function EditorInput({ placeholder, value, onChange }: EditorInputProps) {
  const loading = useRef<boolean>(false)
  const container = useRef(null)

  useEffect(() => {
    if (!container.current || loading.current) return

    loading.current = true

    const el = container.current

    import('ckeditor5-custom-build').then((module) => {
      const Editor = module.default

      Editor.create(el, {
        placeholder,
        initialData: value
      }).then((editor) => {
        loading.current = false

        editor.model.document.on('change:data', (evt, data) => {
          onChange?.(editor.getData())
        })
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
          return new UploadAdapter(loader)
        }
      })
    })
  }, [])

  return (
    <div className={styles.wrapper}>
      <div ref={container}>
        <ArrowPathIcon className="h-4 w-4 animate-spin" />
      </div>
    </div>
  )
}
