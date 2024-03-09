import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import {
  UserRoleForm,
  UserRoleFormFields,
  UserRoleFormSchema
} from '@/components/admin/UserRoleForm'
import { VespForm } from '@/components/admin/VespForm'
import type { Metadata } from 'next'
import { one, update } from '../actions'
import { VespFormSubmit } from '@/components/admin/VespFormSubmit'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Изменить роль'
}

export default async function Page({ params }: { params: { id: number } }) {
  const data = await one(params.id)

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/user-roles" key="back">
      <Button variant="secondary">Отмена</Button>
    </Link>,
    <VespFormSubmit key="submit">Сохранить</VespFormSubmit>
  ]

  return (
    <VespForm<UserRoleFormFields> action={update} schema={UserRoleFormSchema} defaultValues={data}>
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <UserRoleForm />
    </VespForm>
  )
}
