// 'use client'

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form'
// import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
// import { z } from 'zod'
// import { Input } from '@/components/ui/input'
// import { TagsInput } from '@/components/ui/tags-input'
// import { UseFormReturn } from 'react-hook-form'

// export const UserRoleFormSchema = z.object({
//   id: z.number(),
//   title: z.string(),
//   scope: z.string().array()
// })

// export type UserRoleFormFields = z.infer<typeof UserRoleFormSchema>

// export interface UpdateUserRolePageProps {
//   title: string
//   form: UseFormReturn<UserRoleFormFields>
//   onSubmit: (values: UserRoleFormFields) => void
// }

// export function UserRoleForm({ title, form, onSubmit }: UpdateUserRolePageProps) {
//   const actions: PageHeaderProps['actions'] = [
//     {
//       title: 'Отмена',
//       variant: 'secondary',
//       route: '/admin/user-roles'
//     },
//     {
//       title: 'Сохранить',
//       // disabled: !form.formState.isValid,
//       loading: form.formState.isLoading,
//       type: 'submit'
//     }
//   ]

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <PageHeader title={title} actions={actions} />

//         <FormField
//           control={control}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Название</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={control}
//           name="scope"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Разрешения</FormLabel>
//               <FormControl>
//                 <TagsInput {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </form>
//     </Form>
//   )
// }

'use client'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TagsInput } from '@/components/ui/tags-input'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const UserRoleFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1),
  scope: z.string().array()
})

export type UserRoleFormFields = z.infer<typeof UserRoleFormSchema>

export function UserRoleForm() {
  const { control } = useFormContext<UserRoleFormFields>()
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Название</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="scope"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Разрешения</FormLabel>
            <FormControl>
              <TagsInput {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
