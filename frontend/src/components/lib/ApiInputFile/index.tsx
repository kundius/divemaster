import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { apiGet } from '@/lib/api'
import { getApiUrl, uploadFile } from '@/lib/utils'
import { FileEntity } from '@/types'
import { TrashIcon } from '@heroicons/react/24/outline'
import { DownloadIcon, ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './index.module.scss'

export interface ApiInputFileProps {
  errorMessage?: React.ReactNode
  infoMessage?: React.ReactNode
  allowedTypes?: string[]
  maxSize?: number
  placeholder?: string
  value?: number | null
  onChange?: (value: number | null) => void
}

export function ApiInputFile({
  value: controlledValue,
  onChange: controlledOnChange,
  placeholder = 'Выбрать файл',
  errorMessage,
  infoMessage,
  allowedTypes,
  maxSize
}: ApiInputFileProps) {
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [showMessage, setShowMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uncontrolledValue, setUncontrolledValue] = useState<number | null>(null)
  const [fileEntity, setFileEntity] = useState<FileEntity | null>(null)

  const value = controlledValue || uncontrolledValue
  const setValue = controlledOnChange || setUncontrolledValue

  useEffect(() => {
    if (!!value && !fileEntity) {
      initialLoad()
    }
  }, [])

  const initialLoad = async () => {
    setFileEntity(await apiGet<FileEntity>(`files/${value}`))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: async (files) => {
      const [file] = files

      setIsLoading(true)
      setLoadingError(null)

      if (allowedTypes) {
        let isAllowed = false
        for (const type of allowedTypes) {
          if (type === file.type) {
            isAllowed = true
          }
        }
        if (!isAllowed) {
          const formats = allowedTypes.map((v) => v.split('/')[1]).filter((v) => !!v)
          setLoadingError(`Неподходящий тип файла. Доступные форматы: ${formats.join(', ')}`)
          setShowMessage(true)
          setIsLoading(false)
          return
        }
      }

      if (maxSize && file.size > maxSize) {
        setLoadingError(`Файл слишком большой. Максимально доустимый размер ${maxSize}`)
        setShowMessage(true)
        setIsLoading(false)
        return
      }

      try {
        const uploadResponse = await uploadFile(file)
        setFileEntity(uploadResponse)
        setValue(uploadResponse.id)
      } catch {
        setLoadingError('Не удалось загрузить файл')
        setShowMessage(true)
      }

      setIsLoading(false)
    }
  })

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: добавить удаление файла на сервере
    setValue(null)
    setFileEntity(null)
  }

  const handleShowMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMessage((prev) => !prev)
  }

  const handleDownloadClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!fileEntity) return

    const url = `${getApiUrl()}storage/${fileEntity.id}/read`
    const open = window.open(url, '_blank')
    if (open === null || typeof open === 'undefined') {
      window.location.replace(url)
    }
  }

  const renderActions = () => {
    const actions: React.ReactNode[] = []

    if (isLoading) {
      actions.push(
        <Button
          key="loading"
          type="button"
          size="sm-icon"
          loading
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        />
      )
    }

    if (!!(loadingError || errorMessage || infoMessage)) {
      actions.push(
        <Popover open={showMessage} onOpenChange={setShowMessage}>
          <PopoverTrigger asChild>
            <Button
              key="message"
              type="button"
              size="sm-icon"
              variant="outline"
              onClick={handleShowMessage}
            >
              {loadingError || errorMessage ? (
                <ExclamationTriangleIcon className="w-4 h-4" />
              ) : (
                <InfoCircledIcon className="w-4 h-4" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent>{loadingError || errorMessage || infoMessage}</PopoverContent>
        </Popover>
      )
    }

    if (!!fileEntity) {
      actions.push(
        <Button
          key="download"
          type="button"
          size="sm-icon"
          variant="outline"
          onClick={handleDownloadClick}
        >
          <DownloadIcon className="w-4 h-4" />
        </Button>
      )
    }

    if (!!value) {
      actions.push(
        <Button
          key="delete"
          type="button"
          size="sm-icon"
          variant="destructive-outline"
          onClick={handleDeleteClick}
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      )
    }

    if (actions.length > 0) {
      return <div className={styles.actions}>{actions}</div>
    }

    return null
  }

  const renderedActions = renderActions()

  return (
    <div
      {...getRootProps({
        className: classNames(styles.input, {
          [styles.inputDragActive]: isDragActive,
          [styles.inputNotEmpty]: !!fileEntity,
          [styles.inputError]: !!loadingError
        })
      })}
    >
      <input {...getInputProps()} />

      <div className={styles.name}>{fileEntity?.file || placeholder}</div>

      {renderedActions}
    </div>
  )
}
