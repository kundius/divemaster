'use server'

import type { TablePageData, TablePageParams } from '@/components/admin/TablePage/types'
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

export async function list(values?: TablePageParams) {
  return apiGet<TablePageData<VespUserRole>>(`admin/user-roles`, values, withAuth())
}
