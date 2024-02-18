'use server'

import type { TablePageData, TablePageFields } from '@/components/admin/TablePage'
import type { UserRoleFormFields } from '@/components/admin/UserRoleForm'
import { apiGet, apiPatch, apiPut } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import type { VespUserRole } from '@/types'

export async function create(values?: UserRoleFormFields) {
  return apiPut<VespUserRole>(`admin/user-roles`, values, withAuth())
}

export async function update(values?: UserRoleFormFields) {
  return apiPatch<VespUserRole>(`admin/user-roles`, values, withAuth())
}

export async function list(values?: Partial<TablePageFields>) {
  return apiGet<TablePageData<VespUserRole>>(`admin/user-roles`, values, withAuth())
}
