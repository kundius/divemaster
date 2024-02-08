'use client'

// import Link from 'next/link'
import { Button } from '@/components/ui/button'
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form'
import { useFormState } from 'react-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getApiUrl } from '@/lib/utils'
import { loginAction } from './actions'
import { FormSubmitButton } from '@/components/FormSubmitButton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import { useEffect, useTransition } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useApiForm } from '@/lib/useApiForm'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/lib/auth'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  }),
  password: z.string().min(5, {
    message: 'Password must be at least 6 characters.'
  })
})

type FormFields = z.infer<typeof formSchema>
type FormResult = {
  token: string
}

export function LoginPage() {
  
  const auth = useAuth()
  // const [isPending, startTransition] = useTransition()

  const [formState, formAction] = useFormState(loginAction, {})
  // const [state, formAction] = useFormState(login, initialState)

  // useEffect(() => {
  //   console.log('first')
  //   if (state.error) {
  //     toast.error("Event has been created.")
  //   }
  // }, [state])

  // const formAction = async (formData: FormData) => {
  //   startTransition(async () => {
  //     try {
  //       const response = await login(formData)
  //       toast.success('Добро пожаловать!')
  //     } catch (e) {
  //       const error = e as Error
  //       toast.error(error.message)
  //     }
  //   })
  // }
  // console.log('1', eeee)

  const onSuccess = (data: FormResult) => {
    toast.success(data.token)
    auth.setToken(data.token)
  }

  const onError = (e: Error) => {
    toast.error(e.message)
  }

  const [form, onSubmit] = useApiForm<FormFields, FormResult>('security/login', {
    method: 'POST',
    onSuccess,
    onError,
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  return (
    <div>
      <div className="text-xl mb-6 leading-none">Вход</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Имя пользователя" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Пароль" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="flex flex-col w-full  gap-1.5">
          <Label htmlFor="username">Логин</Label>
          <Input
            defaultValue={formState.fieldValues?.username}
            id="username"
            name="username"
            type="text"
          />
          {formState.fieldErrors?.username && (
            <div className="text-sm text-red-500">{formState.fieldErrors.username}</div>
          )}
        </div> */}

          {/* <div className="grid flex-col w-full  gap-1.5">
          <Label htmlFor="password">Пароль</Label>
          <Input
            defaultValue={formState.fieldValues?.password}
            id="password"
            name="password"
            type="password"
          />
          {formState.fieldErrors?.password && (
            <div className="text-sm text-red-500">{formState.fieldErrors.password}</div>
          )}
        </div> */}

          <div className="flex justify-between items-center">
            {/* <FormSubmitButton>Войти</FormSubmitButton> */}
            <Button type="submit" disabled={form.formState.isLoading}>
              {form.formState.isLoading && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
              Войти
            </Button>
            <Button variant="link" type="button">
              Забыли пароль?
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
