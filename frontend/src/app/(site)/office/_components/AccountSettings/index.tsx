'use client'

import { PrimaryButton } from '@/components/site/PrimaryButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useAuthStore } from '@/providers/auth-store-provider'
import { apiPost } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { toast } from 'sonner'
import { UserEntity } from '@/types'
import { ApiClient, ValidationError } from '@/lib/api-client'

interface AccountSettingsFields {
  name: string
  email: string
  phone: string
  password: string
  passwordConfirmation: string
  address: {
    city: string
    street: string
    house: string
    apartment: string
    intercom: string
    floor: string
    entrance: string
  }
}

export function AccountSettings() {
  const user = useAuthStore((store) => store.user)
  const setUser = useAuthStore((store) => store.setUser)

  if (!user) {
    throw new Error(
      'Этот компонент должен вызываться только при наличии авторизованного пользователя'
    )
  }

  const form = useForm<AccountSettingsFields>({
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      passwordConfirmation: '',
      address: {
        city: user.address?.city || '',
        street: user.address?.street || '',
        house: user.address?.house || '',
        apartment: user.address?.apartment || '',
        intercom: user.address?.intercom || '',
        floor: user.address?.floor || '',
        entrance: user.address?.entrance || ''
      }
    }
  })

  async function onSubmit(values: AccountSettingsFields) {
    const api = new ApiClient()
    await api.withClientAuth()
    try {
      const response = await api.post<{ user: UserEntity }>(`auth/profile`, values)
      setUser(response.user)
      form.setValue('password', '')
      form.setValue('passwordConfirmation', '')
      toast.success('Данные изменены')
    } catch (error) {
      if (error instanceof ValidationError) {
        toast.error(error.message)
        Object.entries(error.details).forEach(([key, message]) => {
          form.setError(key as keyof AccountSettingsFields, { message })
        })
      } else {
        toast.error((error as Error).message)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-full flex flex-col gap-4">
        <div className="max-w-4xl">
          <div>
            <div className="text-xl font-medium mb-6 max-md:text-base max-md:mb-4">Личная информация</div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  rules={{ required: 'Введите имя' }}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Имя и фамилия <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  rules={{ required: 'Введите e-mail' }}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        E-mail <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  rules={{ required: 'Введите телефон' }}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Телефон <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="text-xl font-medium mb-6 max-md:text-base max-md:mb-4">Адрес</div>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Город</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Улица</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="address.house"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Номер дома</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="address.apartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Кв/офис</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <FormField
                    control={form.control}
                    name="address.entrance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Подъезд</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="address.floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Этаж</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="address.intercom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Домофон</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="text-xl font-medium mb-6 max-md:text-base max-md:mb-4">Изменение пароля</div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Повторить пароль</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <Button type="submit" size="lg" className="w-48 uppercase font-sans-narrow">
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
