'use client'

import { Button } from '@/components/ui/button'
import { Overlay } from '@/components/ui/overlay'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '@/lib/api'
import { withToken } from '@/lib/api/with-token'
import { useAuth } from '@/lib/auth/use-auth'
import { getImageLink } from '@/lib/utils'
import { VespProductFile } from '@/types'
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable
} from '@dnd-kit/sortable'
import {
  ArrowPathIcon,
  CheckIcon,
  PlusCircleIcon,
  PowerIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { CSS } from '@dnd-kit/utilities'

interface SortableItemProps {
  id: number
  url: string
  src: string
  active: boolean
  width: number
  height: number
  setItems: Dispatch<SetStateAction<ItemType[]>>
}

export function SortableItem(props: SortableItemProps) {
  const [disabling, setDisabling] = useState(false)
  const [enabling, setEnabling] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 10,
    filter: `grayscale(${props.active ? 0 : 100}%)`
  }

  async function onDelete() {
    setDeleting(true)
    await apiDelete(props.url + '/' + props.id)
    props.setItems((prev) => prev.filter((item) => item.id !== props.id))
    setDeleting(false)
  }

  async function onDisable() {
    setDisabling(true)
    props.setItems((prev) =>
      prev.map((item) => ({
        ...item,
        active: item.id === props.id ? false : item.active
      }))
    )
    await apiPatch(props.url + '/' + props.id, { active: false })
    setDisabling(false)
  }

  async function onEnable() {
    setEnabling(true)
    props.setItems((prev) =>
      prev.map((item) => ({
        ...item,
        active: item.id === props.id ? true : item.active
      }))
    )
    await apiPatch(props.url + '/' + props.id, { active: true })
    setEnabling(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative border rounded-lg p-2 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-sm"
    >
      <Image src={props.src} width={props.width} height={props.height} alt="" />
      <div className="flex gap-2 justify-end mt-2">
        {props.active ? (
          <Button
            size="icon"
            variant="outline"
            onClick={onDisable}
            className="relative z-20"
            disabled={disabling}
          >
            {disabling ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              <PowerIcon className="w-4 h-4" />
            )}
          </Button>
        ) : (
          <Button
            size="icon"
            variant="outline"
            onClick={onEnable}
            className="relative z-20"
            disabled={enabling}
          >
            {enabling ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              <CheckIcon className="w-4 h-4" />
            )}
          </Button>
        )}
        <Button
          size="icon"
          variant="outline"
          onClick={onDelete}
          className="relative z-20"
          disabled={deleting}
        >
          {deleting ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
          ) : (
            <TrashIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
      <button
        {...listeners}
        {...attributes}
        className="block absolute left-0 top-0 w-full h-full z-10"
      />
    </div>
  )
}

export interface ProductGalleryProps {
  productId: number
  thumbWidth?: number
  thumbHeight?: number
}

interface ItemType extends VespProductFile {
  id: number
}

export function ProductGallery(props: ProductGalleryProps) {
  const { productId, thumbHeight = 200, thumbWidth = 200 } = props

  const auth = useAuth()

  const [loading, setLoading] = useState(false)
  const [sorted, setSorted] = useState(false)
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

  useEffect(() => {
    if (sorted) {
      setSorted(false)
      const _files: { [key: number]: number } = {}
      items.forEach((i, idx) => {
        _files[i.file_id] = idx
      })
      apiPost(url, { files: _files })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, sorted])

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
              ...item,
              id: item.file_id
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
          ...item,
          id: item.file_id
        }))
      )
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === Number(active.id))
        const newIndex = items.findIndex((item) => item.id === Number(over?.id))

        return arrayMove(items, oldIndex, newIndex)
      })
      setSorted(true)
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
          className="grid grid-cols-4 gap-4"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={rectSortingStrategy}>
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  width={thumbWidth}
                  height={thumbHeight}
                  src={getImageLink(item.file, { fit: 'crop', w: thumbWidth, h: thumbHeight })}
                  active={item.active}
                  setItems={setItems}
                  url={url}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </Overlay>
    </div>
  )
}