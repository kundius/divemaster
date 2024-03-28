'use client'

import { Button } from '@/components/ui/button'
import { Overlay } from '@/components/ui/overlay'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { apiGet, apiPost, apiPut } from '@/lib/api'
import { withToken } from '@/lib/api/with-token'
import { useAuth } from '@/lib/auth/use-auth'
import { getImageLink } from '@/lib/utils'
import { VespProductFile } from '@/types'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { ChangeEvent, DragEvent, useEffect, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import type { SortableEvent } from 'sortablejs'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

export function SortableItem(props: ItemType) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.productFile.file_id}
    </div>
  )
}

export interface ProductGalleryProps {
  productId: number
  thumbWidth?: number
  thumbHeight?: number
}

interface ItemType {
  id: number
  productFile: VespProductFile
}

export function ProductGallery(props: ProductGalleryProps) {
  const { productId, thumbHeight = 200, thumbWidth = 200 } = props

  const auth = useAuth()

  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [items, setItems] = useState<ItemType[]>([])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

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
          const item = await asyncLoad(file)
          setItems((prev) => [
            ...prev,
            {
              id: item.file_id,
              productFile: item
            }
          ])
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
      setItems(
        data.rows.map((item) => ({
          id: item.file_id,
          productFile: item
        }))
      )
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }

  // function setList(newList: ItemType[]) {
  //   setItems(newList)
  //   const _files: { [key: number]: number } = {}
  //   newList.forEach((i, idx) => {
  //     _files[i.file_id] = idx
  //   })
  //   apiPost(url, { files: _files })
  // }

  // function onSort() {
  //   setTimeout(async () => {
  //     // setItems(newList)
  //     const _files: { [key: number]: number } = {}
  //     items.forEach((i, idx) => {
  //       _files[i.file_id] = idx
  //     })
  //     await apiPost(url, { files: _files })
  //   }, 0)
  // }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    let newArray: ItemType[] = []

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        newArray = arrayMove(items, oldIndex, newIndex)

        return newArray
      })

      const ordered: { [key: number]: number } = {}
      newArray.forEach((item, idx) => {
        ordered[item.id] = idx
      })
      apiPost(url, { files: ordered })
    }
  }

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
          {/* className="grid grid-cols-4 gap-4" */}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <SortableItem key={item.id} {...item} />
              ))}
              {/* {items.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-2 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-sm card"
                >
                  <Image
                    src={getImageLink(item.file, { fit: 'crop', w: thumbWidth, h: thumbHeight })}
                    width={thumbWidth}
                    height={thumbHeight}
                    alt="Picture of the author"
                  />
                  <div className="flex gap-2 justify-end mt-2">
                    <Button></Button>
                  </div>
                </div>
              ))} */}
            </SortableContext>
          </DndContext>
        </div>
      </Overlay>
    </div>
  )
}
