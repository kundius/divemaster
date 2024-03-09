'use server'

import type { UserRoleFormFields } from '@/components/admin/UserRoleForm'
import type { VespTableData, VespTableParams } from '@/components/admin/VespTable'
import { apiGet, apiPatch, apiPut } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import type { VespUserRole } from '@/types'

export async function create(values?: UserRoleFormFields) {
  return apiPut<VespUserRole>(`admin/user-roles`, values, withAuth())
}

export async function update(values?: UserRoleFormFields) {
  return apiPatch<VespUserRole>(`admin/user-roles`, values, withAuth())
}

export async function many(values?: VespTableParams) {
  return apiGet<VespTableData<VespUserRole>>(`admin/user-roles`, values, withAuth())
}

export async function one(id: number) {
  return apiGet<VespUserRole>(`admin/user-roles/${id}`, {}, withAuth())
}
