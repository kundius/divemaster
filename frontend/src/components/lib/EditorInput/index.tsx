'use client'

import { TOKEN_NAME } from '@/lib/auth/constants'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { getCookie } from 'cookies-next'
import { useEffect, useRef } from 'react'
import styles from './styles.module.scss'

export interface EditorInputProps {
  placeholder?: string
  value?: string
  onChange?: (value?: string) => void
}

export function EditorInput({ placeholder, value, onChange }: EditorInputProps) {
  const loading = useRef<boolean>(false)
  const container = useRef(null)

  useEffect(() => {
    console.log('useEffect')
    if (!container.current || loading.current) return

    loading.current = true

    const el = container.current

    import('ckeditor5-custom-build').then((module) => {
      const Editor = module.default
      const token = getCookie(TOKEN_NAME)

      Editor.create(el, {
        simpleUpload: {
          uploadUrl: `${process.env.NEXT_PUBLIC_API_URL}storage/upload`,
          withCredentials: false,
          headers: {
            Authorization: 'Bearer ' + token
          }
        },
        placeholder,
        initialData: value
      }).then((editor) => {
        loading.current = false

        editor.model.document.on('change:data', (evt, data) => {
          onChange?.(editor.getData())
        })
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={container} className={styles.wrapper}>
      <ArrowPathIcon className="h-4 w-4 animate-spin" />
    </div>
  )
}
