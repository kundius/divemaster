'use client'

import { Button } from '@/components/ui/button'
import { Overlay } from '@/components/ui/overlay'
import { Skeleton } from '@/components/ui/skeleton'
import { api, apiDelete, apiGet, apiPatch, apiPut } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { getApiUrl } from '@/lib/utils'
import { ProductImageEntity } from '@/types'
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
import { CSS } from '@dnd-kit/utilities'
import { ArrowPathIcon, CheckIcon, PowerIcon, TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

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
      className="relative flex flex-col border rounded-lg p-2 bg-white hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-sm"
    >
      <div
        className="flex items-center justify-center relative"
        style={{
          aspectRatio: props.width / props.height
        }}
      >
        <Image
          src={props.src}
          width={props.width}
          height={props.height}
          alt=""
          // objectFit="contain"
          // fill
        />
      </div>
      <div className="flex gap-2 justify-end mt-2">
        {props.active ? (
          <Button
            size="sm-icon"
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
            size="sm-icon"
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
          size="sm-icon"
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

interface ItemType extends ProductImageEntity {
  id: number
}

export function ProductGallery(props: ProductGalleryProps) {
  const { productId, thumbHeight = 200, thumbWidth = 200 } = props

  const [isLoading, setIsLoading] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [sorted, setSorted] = useState(false)
  const [items, setItems] = useState<ItemType[]>([])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    if (sorted) {
      setSorted(false)
      const _files: { [key: number]: number } = {}
      items.forEach((i, idx) => {
        _files[typeof i.file === 'number' ? i.file : i.fileId] = idx
      })
      apiPut(url, { files: _files })
    }
  }, [items, sorted])

  const url = `products/${productId}/images`

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
    const asyncLoad = async (file: File): Promise<ProductImageEntity> => {
      const body = new FormData()
      body.append('file', file)
      return await api<ProductImageEntity>(url, {
        method: 'POST',
        body
      })
    }
    setIsPending(true)
    try {
      for (const file of nativeFiles) {
        if (file.type.includes('image/')) {
          const item = await asyncLoad(file)
          setItems((prev) => [
            ...prev,
            {
              ...item,
              id: typeof item.file === 'number' ? item.file : item.fileId
            }
          ])
        }
      }
    } finally {
      setIsPending(false)
    }
  }

  async function fetch() {
    setIsLoading(true)
    try {
      const data = await apiGet<ProductImageEntity[]>(url, {}, withClientAuth())
      setItems(
        data.map((item) => ({
          ...item,
          id: typeof item.file === 'number' ? item.file : item.fileId
        }))
      )
    } finally {
      setIsLoading(false)
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
    <div className="space-y-6">
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <Button onClick={onFileSelect}>Добавить фото</Button>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
        </div>
      ) : (
        <Overlay show={isPending}>
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
                    src={`${getApiUrl()}storage/${item.id}/read`}
                    active={item.active}
                    setItems={setItems}
                    url={url}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </Overlay>
      )}
    </div>
  )
}
