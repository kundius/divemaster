'use client'

import { PrimaryButton } from '@/components/site/PrimaryButton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

export function Exclamation() {
  return (
    <>
      <Alert>
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Внимание!</AlertTitle>
        <AlertDescription className='flex'>
          <div>
            В архиве должны присутствовать следующие файлы:
            <br />
            <strong>import.xml</strong> - файл с товарами
            <br />
            <strong>offers.xml</strong> - файл с торговыми предложениями
            <br />
            изображения, по пути указанном в import.xml
          </div>
        </AlertDescription>
      </Alert>
    </>
  )
}
