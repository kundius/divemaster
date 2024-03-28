'use client'

import { Button } from '@/components/ui/button'
import { Overlay } from '@/components/ui/overlay'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { apiGet, apiPut } from '@/lib/api'
import { withToken } from '@/lib/api/with-token'
import { useAuth } from '@/lib/auth/use-auth'
import { getImageLink } from '@/lib/utils'
import { VespProductFile } from '@/types'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { ChangeEvent, DragEvent, useEffect, useState } from 'react'

export interface ProductGalleryProps {
  productId: number
  thumbWidth?: number
  thumbHeight?: number
}

export function ProductGallery(props: ProductGalleryProps) {
  const { productId, thumbHeight = 200, thumbWidth = 200 } = props

  const auth = useAuth()

  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [files, setFiles] = useState<VespProductFile[]>([])

  useEffect(() => {
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const url = `admin/product/${productId}/files`

  function onFileSelect() {
    const el = document.createElement('input')
    el.type = 'file'
    el.multiple = true
    el.accept = 'image/*'
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
    const asyncLoad = (file: File): Promise<VespProductFile> => {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = async ({ target }) => {
          if (target) {
            const data = await apiPut<VespProductFile>(url, {
              file: target.result,
              metadata: { name: file.name, size: file.size, type: file.type }
            })
            resolve(data)
          } else {
            reject(new Error('target is null'))
          }
        }
        reader.readAsDataURL(file)
      })
    }
    setLoading(true)
    try {
      for (const file of nativeFiles) {
        if (file.type.includes('image/')) {
          const res = await asyncLoad(file)
          setFiles((prev) => [...prev, res])
        }
      }
    } finally {
      setLoading(false)
    }
  }

  async function fetch() {
    setLoading(true)
    try {
      const data = await apiGet<VespTableData<VespProductFile>>(url, {}, withToken(auth.token)())
      setFiles(data.rows)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }

  console.log(files)

  return (
    <div>
      <div className="justify-end flex items-center mb-4">
        <Button onClick={onFileSelect}>
          <PlusCircleIcon className="w-6 h-6 mr-2 -ml-2" />
          Загрузить
        </Button>
      </div>

      <Overlay show={loading}>
        <div
          onDrop={(e) => {
            e.preventDefault()
            onAddFiles(e.dataTransfer.files)
          }}
          onDragOver={(e) => {
            e.preventDefault()
          }}
        >
          {files.map((item) => (
            <div key={item.file_id} className='border rounded-lg p-2 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-sm card'>
              <Image
                src={getImageLink(item.file, { fit: 'crop', w: thumbWidth, h: thumbHeight })}
                width={thumbWidth}
                height={thumbHeight}
                alt="Picture of the author"
              />
              <div className='flex gap-2 justify-end mt-2'>
                <Button>

                </Button>
              </div>
            </div>
          ))}
        </div>
      </Overlay>
    </div>
  )
}
