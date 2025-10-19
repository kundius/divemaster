import { Button } from '@/components/ui/button'
import { Item } from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'
import { apiGet } from '@/lib/api'
import { getFileUrl, uploadFile } from '@/lib/utils'
import { FileEntity } from '@/types'
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
import { TrashIcon } from '@heroicons/react/24/outline'
import { FileIcon, PlusIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

export interface ApiInputFilesProps {
  allowedTypes?: string[]
  maxSize?: number
  value?: number[]
  onChange?: (value: number[]) => void
}

type BaseItem = {
  localId: string
  entity?: FileEntity
  status: 'created' | 'uploading' | 'loading' | 'complete' | 'error'
}

type UploadItem = {
  entityId: undefined
  file: File
}

type LoadItem = {
  entityId: number
  file: undefined
}

type Item = BaseItem & (LoadItem | UploadItem)

interface ApiInputFileProps {
  item: Item
  onDelete?: (item: Item) => void
}

function ApiInputFile({ item, onDelete }: ApiInputFileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.localId
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 10
  }

  const renderItemImage = (i: Item) => {
    if (i.status === 'loading' || i.status === 'uploading') {
      return (
        <div className="w-24 h-24 flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      )
    }
    if (!i.entity || !i.entity.type) {
      return (
        <div className="w-24 h-24 flex items-center justify-center">
          <FileIcon className="size-8" />
        </div>
      )
    }
    if (i.entity.type.startsWith('image/')) {
      return (
        <Image
          src={getFileUrl(i.entity.id)}
          alt={i.entity.file}
          fill
          className="aspect-square w-full rounded-sm object-cover"
        />
      )
    }
    return <FileIcon />
  }

  return (
    <div
      className="group w-24 relative border bg-background shadow-xs rounded-md"
      title={item.entity?.file}
      ref={setNodeRef}
      style={style}
    >
      {renderItemImage(item)}
      <button
        {...listeners}
        {...attributes}
        type="button"
        className="block absolute left-0 top-0 w-full h-full z-10"
      />
      {onDelete && (
        <Button
          type="button"
          size="icon"
          className="absolute z-20 right-1 top-1 opacity-0 group-hover:opacity-100"
          variant="outline"
          onClick={() => onDelete(item)}
        >
          <TrashIcon />
        </Button>
      )}
    </div>
  )
}

export function ApiInputFiles({
  value: controlledValue,
  onChange: controlledOnChange,
  allowedTypes,
  maxSize
}: ApiInputFilesProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const [uncontrolledValue, setUncontrolledValue] = useState<number[]>([])

  const value = controlledValue ?? uncontrolledValue
  const setValue = controlledOnChange ?? setUncontrolledValue

  const [items, setItems] = useState<Item[]>(
    value.map((id) => ({
      localId: nanoid(),
      entityId: id,
      entity: undefined,
      status: 'created',
      file: undefined
    }))
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop: async (files) => {
      for (const file of files) {
        if (allowedTypes) {
          let isAllowed = false
          for (const type of allowedTypes) {
            if (type === file.type) {
              isAllowed = true
            }
          }
          if (!isAllowed) {
            const formats = allowedTypes.map((v) => v.split('/')[1]).filter((v) => !!v)
            toast.error(
              `Неподходящий тип файла ${file.name}. Доступные форматы: ${formats.join(', ')}`
            )
            continue
          }
        }

        if (maxSize && file.size > maxSize) {
          toast.error(`Файл ${file.name} слишком большой. Максимально доустимый размер ${maxSize}`)
          continue
        }

        setItems((prev) => [
          ...prev,
          {
            localId: nanoid(),
            entity: undefined,
            status: 'created',
            entityId: undefined,
            file
          }
        ])
      }
    }
  })

  const loadItem = async (item: BaseItem & LoadItem) => {
    setItems((prev) =>
      prev.map((v) => (v.localId === item.localId ? { ...v, status: 'loading' } : v))
    )
    const entity = await apiGet<FileEntity>(`files/${item.entityId}`)
    setItems((prev) =>
      prev.map((v) => (v.localId === item.localId ? { ...v, status: 'complete', entity } : v))
    )
  }

  const uploadItem = async (item: BaseItem & UploadItem) => {
    setItems((prev) =>
      prev.map((v) => (v.localId === item.localId ? { ...v, status: 'uploading' } : v))
    )
    const entity = await uploadFile(item.file)
    setItems((prev) =>
      prev.map((v) => (v.localId === item.localId ? { ...v, status: 'complete', entity } : v))
    )
  }

  const deleteItem = (item: Item) => {
    setItems((prev) => prev.filter((v) => v.localId !== item.localId))
  }

  useEffect(() => {
    const newValue: number[] = []
    for (const item of items) {
      if (item.entityId) {
        newValue.push(item.entityId)
      } else if (item.entity) {
        newValue.push(item.entity.id)
      }
      if (item.status === 'created') {
        if (typeof item.entityId !== 'undefined') {
          loadItem(item)
        }
        if (typeof item.file !== 'undefined') {
          uploadItem(item)
        }
      }
    }
    setValue(newValue)
  }, [items])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.localId === String(active.id))
        const newIndex = prev.findIndex((item) => item.localId === String(over?.id))

        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((v) => ({ id: v.localId }))} strategy={rectSortingStrategy}>
        <div className="flex flex-row flex-wrap gap-2">
          {items.map((item) => (
            <ApiInputFile key={item.localId} item={item} onDelete={deleteItem} />
          ))}
          <Button
            type="button"
            variant="outline"
            size="icon"
            {...getRootProps({
              className: 'size-24'
            })}
          >
            <PlusIcon className="size-8" />
            <input {...getInputProps()} />
          </Button>
        </div>
      </SortableContext>
    </DndContext>
  )
}
