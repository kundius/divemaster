'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build'
import styles from './styles.module.scss'
import { getCookie } from 'cookies-next'
import { TOKEN_NAME } from '@/lib/auth/constants'

export interface EditorInputProps {
  placeholder?: string
  value?: string
  onChange?: (value?: string) => void
}

export function EditorInput({ placeholder, value, onChange }: EditorInputProps) {
  const [token, setToken] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const token = getCookie(TOKEN_NAME)
    setToken(token || '')
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={styles.wrapper}>
      <CKEditor
        editor={Editor}
        config={{
          simpleUpload: {
            uploadUrl: `${process.env.NEXT_PUBLIC_API_URL}storage/upload`,
            withCredentials: false,
            headers: {
              Authorization: 'Bearer ' + token
            }
          },
          placeholder
        }}
        data={value}
        onChange={(e, editor) => {
          onChange?.(editor.getData())
        }}
      />
    </div>
  )
}
