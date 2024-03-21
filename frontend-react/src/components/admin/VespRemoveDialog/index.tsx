import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { PropsWithChildren, ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { apiDelete } from '@/lib/api'
import { useAuth } from '@/lib/auth/use-auth'
import { withToken } from '@/lib/api/with-token'

// export interface VespRemoveActionState {
//   isPending: boolean
//   run: () => void
// }

export interface VespRemoveDialogProps {
  url: string
  onSuccess?: () => void
  // action: () => Promise<void>
  // children: (state: VespRemoveActionState) => ReactNode
}

export function VespRemoveDialog({
  children,
  url,
  onSuccess
}: PropsWithChildren<VespRemoveDialogProps>) {
  const auth = useAuth()
  const [isPending, setIsPending] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsPending(true)

    try {
      await apiDelete(url, {}, withToken(auth.token)())
      toast.success(`Удалено`)
      setOpen(false)
      onSuccess?.()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
          <AlertDialogDescription>Это действие не может быть отменено.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <Button loading={isPending} onClick={handleSubmit} variant="destructive">
            Удалить
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
