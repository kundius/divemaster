import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import { apiGet } from '@/lib/api'
import { getApiUrl, uploadFile } from '@/lib/utils'
import { FileEntity } from '@/types'
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline'
import { DownloadIcon, ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { FileIcon, PlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle
} from '@/components/ui/item'
import Image from 'next/image'

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

export function ApiInputFiles({
  value: controlledValue,
  onChange: controlledOnChange,
  allowedTypes,
  maxSize
}: ApiInputFilesProps) {
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

  useEffect(() => {
    for (const item of items) {
      if (item.status !== 'created') continue
      if (typeof item.entityId !== 'undefined') {
        loadItem(item)
      }
      if (typeof item.file !== 'undefined') {
        uploadItem(item)
      }
    }
  }, [items])

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: добавить удаление файла на сервере
    setValue([])
  }

  // const handleDownloadClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.preventDefault()
  //   e.stopPropagation()

  //   if (!fileEntity) return

  //   const url = `${getApiUrl()}storage/${fileEntity.id}/read`
  //   const open = window.open(url, '_blank')
  //   if (open === null || typeof open === 'undefined') {
  //     window.location.replace(url)
  //   }
  // }

  // const renderActions = () => {
  //   const actions: React.ReactNode[] = []

  //   if (!!(loadingError || errorMessage || infoMessage)) {
  //     actions.push(
  //       <Popover open={showMessage} onOpenChange={setShowMessage}>
  //         <PopoverTrigger asChild>
  //           <Button
  //             key="message"
  //             type="button"
  //             size="icon"
  //             variant="ghost"
  //             onClick={handleShowMessage}
  //           >
  //             {loadingError || errorMessage ? (
  //               <ExclamationTriangleIcon className="w-4 h-4" />
  //             ) : (
  //               <InfoCircledIcon className="w-4 h-4" />
  //             )}
  //           </Button>
  //         </PopoverTrigger>
  //         <PopoverContent>{loadingError || errorMessage || infoMessage}</PopoverContent>
  //       </Popover>
  //     )
  //   }

  //   if (!!fileEntity) {
  //     actions.push(
  //       <Button
  //         key="download"
  //         type="button"
  //         size="icon"
  //         variant="ghost"
  //         onClick={handleDownloadClick}
  //       >
  //         <DownloadIcon className="w-4 h-4" />
  //       </Button>
  //     )
  //   }

  //   if (!!value && !!fileEntity) {
  //     actions.push(
  //       <Button key="delete" type="button" size="icon" variant="ghost" onClick={handleDeleteClick}>
  //         <TrashIcon className="w-4 h-4" />
  //       </Button>
  //     )
  //   }

  //   if (actions.length > 0) {
  //     return <div className="flex items-center">{actions}</div>
  //   }

  //   return null
  // }

  return (
    <ItemGroup className="flex flex-row flex-wrap gap-2">
      {items.map((item, i) => (
        <Item key={item.localId} variant="outline" className="w-24">
          <ItemHeader>
            <FileIcon />
            {/* <Image
                src={model.image}
                alt={model.name}
                width={128}
                height={128}
                className="aspect-square w-full rounded-sm object-cover"
              /> */}
          </ItemHeader>
          <ItemContent>
            <ItemTitle>
              <div className="line-clamp-1 min-w-0">{item.entity?.file}</div>
            </ItemTitle>
          </ItemContent>
        </Item>
        // <div
        //   className="w-16 h-16 rounded border flex items-center justify-center"
        //   key={item.entityId ?? `${item.file.name}-${i}`}
        // >
        //   {item.status}
        //   {item.status === 'loading' || item.status === 'uploading' ? <Spinner /> : <FileIcon />}
        // </div>
      ))}
      {/* {value.map((fileId) => (
        <div className="w-16 h-16 rounded border flex items-center justify-center" key={fileId}>
          <FileIcon />
        </div>
      ))} */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        {...getRootProps({
          className: 'size-24'
        })}
      >
        <PlusIcon className="size-6" />
        <input {...getInputProps()} />
      </Button>
      {/* {renderActions()} */}
    </ItemGroup>
  )
}
