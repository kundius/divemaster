export interface VespUser {
  id: number
  name: string
  email: string
  active: boolean
  roleId: number
  role: VespUserRole
}

export interface VespUserRole {
  id: number
  title: string
  scope: string[] | null
}

export interface VespCategory {
  id: number
  parentId: number
  title: string
  alias: string
  description: string | null
  active: boolean
}

export interface VespProduct {
  id: number
  price: number
  title: string
  alias: string
  description: string | null
  sku: string | null
  file: VespFile | null
  active: boolean
}

export type VespFile = {
  id?: number
  uuid: string
  updated_at?: string
  [key: string]: any
}

export type VespFileOptions = {
  w?: string | number
  h?: string | number
  fit?: string
  fm?: string
  t?: string | number
  [key: string]: any
}

export type VespProductFile = {
  file_id: number
  product_id: number
  rank: number
  active: boolean
  file: {
    id: number
  }
}

export type PageProps<
  TParams = {},
  TSearchParams = { [key: string]: string | string[] | undefined }
> = {
  params: TParams
  searchParams: TSearchParams
}
